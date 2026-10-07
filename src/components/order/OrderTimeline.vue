<script setup lang="ts">
import { computed } from 'vue'
import type { OrderStatus } from '@/types'
import { orderCopy as copy } from '@/config/copy/checkout'

const props = defineProps<{ status: OrderStatus }>()

// Paso alcanzado por cada estado. Cancelado y rechazado se muestran aparte.
const reached: Record<OrderStatus, number> = {
  pending_payment: 0,
  awaiting_transfer: 0,
  payment_failed: 0,
  canceled: 0,
  paid: 1,
  confirmed: 1,
  shipped: 2,
  delivered: 3,
}

const current = computed(() => reached[props.status])
</script>

<template>
  <ol class="timeline" :aria-label="copy.eyebrow">
    <li
      v-for="(label, index) in copy.timeline"
      :key="label"
      class="timeline__step"
      :class="{ 'timeline__step--done': index <= current, 'timeline__step--current': index === current }"
      :aria-current="index === current ? 'step' : undefined"
    >
      <span class="timeline__dot">
        <i v-if="index <= current" class="fa-solid fa-check" aria-hidden="true"></i>
      </span>
      <span class="timeline__label">{{ label }}</span>
    </li>
  </ol>
</template>

<style scoped lang="scss">
.timeline {
  list-style: none;
  @include flex(row, flex-start, space-between);
  position: relative;

  &__step {
    @include flex(column, center, flex-start, 0.5rem);
    flex: 1;
    position: relative;
    text-align: center;

    // Línea hacia el paso anterior.
    &:not(:first-child)::before {
      content: '';
      position: absolute;
      top: 0.85rem;
      right: 50%;
      width: 100%;
      height: 2px;
      background: $line;
      z-index: 0;
    }

    &--done:not(:first-child)::before {
      background: $accent;
    }
  }

  &__dot {
    @include flex(row, center, center);
    position: relative;
    z-index: 1;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 50%;
    border: 2px solid $line;
    background: $surface;
    color: $surface;
    font-size: 0.7rem;
  }

  &__step--done &__dot {
    border-color: $accent;
    background: $accent;
  }

  &__step--current &__dot {
    box-shadow: 0 0 0 4px rgba($accent, 0.18);
  }

  &__label {
    font-size: 0.7rem;
    font-weight: 600;
    color: $ink-muted;
    line-height: 1.25;
    padding-inline: 0.2rem;

    @include from('md') {
      font-size: $text-xs;
    }
  }

  &__step--done &__label {
    color: $ink;
  }
}
</style>
