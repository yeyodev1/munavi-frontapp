<script setup lang="ts">
import { computed } from 'vue'
import type { Prices } from '@/types'
import { hasPrice, money, savingsPercent } from '@/utils/price'
import { productCopy as copy } from '@/config/copy/product'

const props = withDefaults(
  defineProps<{
    prices: Prices
    compareAtPrice?: number | null
    size?: 'sm' | 'lg'
  }>(),
  { compareAtPrice: null, size: 'sm' },
)

const priced = computed(() => hasPrice(props.prices))
const savings = computed(() => savingsPercent(props.compareAtPrice, props.prices.card))
</script>

<template>
  <div v-if="!priced" class="price price--pending" :class="`price--${size}`">
    <span class="price__tag">
      <i class="fa-regular fa-clock" aria-hidden="true"></i>
      {{ copy.noPrice }}
    </span>
    <p class="price__others">{{ copy.noPriceHint }}</p>
  </div>

  <div v-else class="price" :class="`price--${size}`">
    <span class="price__label">{{ copy.cardPrice }}</span>
    <div class="price__main">
      <strong class="price__card">{{ money(prices.card) }}</strong>
      <template v-if="savings">
        <s class="price__compare">{{ money(compareAtPrice!) }}</s>
        <span class="price__save">-{{ savings }}%</span>
      </template>
    </div>
    <p class="price__others">
      {{ copy.transfer }} {{ money(prices.transfer) }}
      <span aria-hidden="true">·</span>
      {{ copy.cashOnDelivery }} {{ money(prices.cashOnDelivery) }}
    </p>
  </div>
</template>

<style scoped lang="scss">
.price {
  @include flex(column, flex-start, flex-start, 0.15rem);

  &__label {
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: $accent;
  }

  &__main {
    @include flex(row, baseline, flex-start, 0.5rem);
    flex-wrap: wrap;
  }

  &__card {
    font-size: 1.25rem;
    font-weight: 700;
    color: $ink;
    letter-spacing: -0.01em;
  }

  &__compare {
    font-size: $text-sm;
    color: $ink-muted;
  }

  &__save {
    font-size: 0.7rem;
    font-weight: 700;
    color: $surface;
    background: $rose;
    padding: 0.15rem 0.45rem;
    border-radius: $radius-pill;
  }

  &__others {
    font-size: 0.72rem;
    color: $ink-muted;
    line-height: 1.4;
  }

  &__tag {
    @include flex(row, center, flex-start, 0.45rem);
    font-family: $font-display;
    font-size: 0.92rem;
    font-weight: 500;
    white-space: nowrap;
    color: $accent-deep;
    padding: 0.28rem 0.7rem;
    border-radius: $radius-pill;
    background: rgba($accent, 0.08);
    border: 1px solid rgba($accent, 0.18);

    i {
      font-size: 0.8em;
      color: $accent;
    }
  }

  &--lg &__tag {
    font-size: clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem);
    padding: 0.45rem 1.1rem;
  }

  &--lg &__label {
    font-size: $text-xs;
  }

  &--lg &__card {
    font-size: clamp(1.8rem, 1.5rem + 1.2vw, 2.3rem);
    color: $accent-deep;
  }

  &--lg &__compare {
    font-size: $text-base;
  }

  &--lg &__save {
    font-size: $text-xs;
  }

  &--lg &__others {
    font-size: $text-sm;
    color: $ink-soft;
    margin-top: 0.2rem;
  }
}
</style>
