<script setup lang="ts">
import type { QuoteItem } from '@/types'
import { money } from '@/utils/price'
import { checkoutCopy } from '@/config/copy/checkout'

type SummaryItem = Pick<
  QuoteItem,
  'productName' | 'variantSlug' | 'variantName' | 'image' | 'quantity' | 'lineSubtotal' | 'lineTotal' | 'volumeDiscountPercent'
>

/** Pinta una cotización o un pedido tal como los calculó el servidor. */
withDefaults(
  defineProps<{
    items: SummaryItem[]
    subtotal: number
    volumeDiscount: number
    couponDiscount: number
    couponCode?: string | null
    shipping: number
    total: number
    loading?: boolean
    title?: string
  }>(),
  { couponCode: null, loading: false, title: checkoutCopy.summary.title },
)

const copy = checkoutCopy.summary
</script>

<template>
  <section class="summary" :class="{ 'summary--loading': loading }" :aria-busy="loading">
    <h2 class="summary__title">{{ title }}</h2>

    <ul class="summary__items">
      <li v-for="item in items" :key="`${item.productName}-${item.variantSlug}`" class="summary__item">
        <span class="summary__thumb">
          <img v-if="item.image" :src="item.image" :alt="item.productName" loading="lazy" />
          <i v-else class="fa-solid fa-image" aria-hidden="true"></i>
          <span class="summary__qty">{{ item.quantity }}</span>
        </span>
        <span class="summary__info">
          <span class="summary__name">{{ item.productName }}</span>
          <span v-if="item.variantSlug !== 'unico'" class="summary__meta">{{ item.variantName }}</span>
          <span v-if="item.volumeDiscountPercent" class="summary__off">
            {{ copy.volumeOff(item.volumeDiscountPercent) }}
          </span>
        </span>
        <span class="summary__amount">
          <s v-if="item.lineTotal !== item.lineSubtotal">{{ money(item.lineSubtotal) }}</s>
          {{ money(item.lineTotal) }}
        </span>
      </li>
    </ul>

    <dl class="summary__totals">
      <div class="summary__row">
        <dt>{{ copy.subtotal }}</dt>
        <dd>{{ money(subtotal) }}</dd>
      </div>
      <div v-if="volumeDiscount" class="summary__row summary__row--discount">
        <dt>{{ copy.volume }}</dt>
        <dd>-{{ money(volumeDiscount) }}</dd>
      </div>
      <div v-if="couponDiscount" class="summary__row summary__row--discount">
        <dt>{{ copy.coupon(couponCode || '') }}</dt>
        <dd>-{{ money(couponDiscount) }}</dd>
      </div>
      <div class="summary__row">
        <dt>{{ copy.shipping }}</dt>
        <dd :class="{ 'summary__free': !shipping }">{{ shipping ? money(shipping) : copy.free }}</dd>
      </div>
      <div class="summary__row summary__row--total">
        <dt>{{ copy.total }}</dt>
        <dd>{{ money(total) }}</dd>
      </div>
    </dl>
    <slot />
  </section>
</template>

<style scoped lang="scss">
.summary {
  @include card;
  @include flex(column, stretch, flex-start, 1rem);
  padding: 1.25rem;
  @include transition(opacity);

  &--loading {
    opacity: 0.55;
  }

  &__title {
    @include display($text-xl, 500);
  }

  &__items {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.85rem);
  }

  &__item {
    @include flex(row, center, flex-start, 0.8rem);
  }

  &__thumb {
    position: relative;
    @include flex(row, center, center);
    flex: 0 0 3.4rem;
    height: 3.4rem;
    border-radius: $radius-sm;
    background: $blush;
    color: rgba($accent, 0.4);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: inherit;
    }
  }

  &__qty {
    position: absolute;
    top: -0.4rem;
    right: -0.4rem;
    @include flex(row, center, center);
    min-width: 1.3rem;
    height: 1.3rem;
    padding-inline: 0.3rem;
    border-radius: $radius-pill;
    background: $ink;
    color: $surface;
    font-size: 0.68rem;
    font-weight: 700;
  }

  &__info {
    @include flex(column, flex-start, flex-start, 0.1rem);
    flex: 1;
    min-width: 0;
  }

  &__name {
    font-size: $text-sm;
    font-weight: 600;
    line-height: 1.3;
  }

  &__meta {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__off {
    font-size: 0.7rem;
    font-weight: 600;
    color: $rose-deep;
  }

  &__amount {
    @include flex(column, flex-end, flex-start);
    font-size: $text-sm;
    font-weight: 600;
    white-space: nowrap;

    s {
      font-size: $text-xs;
      font-weight: 400;
      color: $ink-muted;
    }
  }

  &__totals {
    @include flex(column, stretch, flex-start, 0.45rem);
    padding-top: 1rem;
    border-top: 1px solid $line;
    font-size: $text-sm;
  }

  &__row {
    @include flex(row, baseline, space-between, 1rem);
    color: $ink-soft;

    dd {
      font-weight: 600;
      color: $ink;
    }

    &--discount dd {
      color: $rose-deep;
    }

    &--total {
      margin-top: 0.4rem;
      padding-top: 0.7rem;
      border-top: 1px dashed $line;
      color: $ink;
      font-weight: 700;

      dd {
        font-size: $text-xl;
        font-weight: 700;
      }
    }
  }

  &__free {
    color: $success !important;
  }
}
</style>
