<script setup lang="ts">
import { computed } from 'vue'
import type { Prices } from '@/types'
import { money, savingsPercent } from '@/utils/price'
import { productCopy as copy } from '@/config/copy/product'

const props = withDefaults(
  defineProps<{
    prices: Prices
    compareAtPrice?: number | null
    size?: 'sm' | 'lg'
  }>(),
  { compareAtPrice: null, size: 'sm' },
)

const savings = computed(() => savingsPercent(props.compareAtPrice, props.prices.card))
</script>

<template>
  <div class="price" :class="`price--${size}`">
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
