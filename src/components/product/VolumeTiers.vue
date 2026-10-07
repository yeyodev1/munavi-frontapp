<script setup lang="ts">
import { computed } from 'vue'
import type { VolumeDiscount } from '@/types'
import { sortedTiers, tierFor } from '@/utils/price'
import { productCopy as copy } from '@/config/copy/product'

const props = withDefaults(
  defineProps<{
    tiers: VolumeDiscount[]
    quantity?: number
    compact?: boolean
  }>(),
  { quantity: 0, compact: false },
)

const list = computed(() => sortedTiers(props.tiers))
const active = computed(() => tierFor(props.tiers, props.quantity))
const first = computed(() => list.value[0])
</script>

<template>
  <p v-if="compact && first" class="tiers-compact">
    <i class="fa-solid fa-tags" aria-hidden="true"></i>
    {{ copy.tier(first.minQty, first.percent) }}
  </p>

  <div v-else-if="list.length" class="tiers">
    <span class="tiers__title">{{ copy.tiersTitle }}</span>
    <ul class="tiers__list">
      <li
        v-for="tier in list"
        :key="tier.minQty"
        class="tiers__item"
        :class="{ 'tiers__item--active': active?.minQty === tier.minQty }"
      >
        <i class="fa-solid fa-tag" aria-hidden="true"></i>
        {{ copy.tier(tier.minQty, tier.percent) }}
        <span v-if="active?.minQty === tier.minQty" class="tiers__badge">{{ copy.tierActive }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.tiers-compact {
  @include flex(row, center, flex-start, 0.35rem);
  font-size: 0.72rem;
  font-weight: 600;
  color: $accent;
}

.tiers {
  @include flex(column, flex-start, flex-start, 0.5rem);

  &__title {
    @include eyebrow;
  }

  &__list {
    list-style: none;
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
  }

  &__item {
    @include flex(row, center, flex-start, 0.4rem);
    font-size: $text-sm;
    font-weight: 500;
    padding: 0.45rem 0.85rem;
    border-radius: $radius-pill;
    background: $sage-soft;
    color: $accent-deep;
    @include transition;

    &--active {
      background: $accent;
      color: $surface;
    }
  }

  &__badge {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    opacity: 0.85;
  }
}
</style>
