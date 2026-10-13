<script setup lang="ts">
import { computed } from 'vue'
import type { VolumePromoStatus } from '@/types'
import { volumePromoCopy as copy } from '@/config/copy/checkout'

/** Progreso hacia el siguiente nivel de "Compra más, ahorra más", tal como lo cotizó el servidor. */
const props = defineProps<{ status: VolumePromoStatus | null | undefined }>()

const visible = computed(() => {
  const s = props.status
  return !!s?.isActive && (!!s.next || s.percent > 0)
})

const reached = computed(() => (props.status?.percent ?? 0) > 0)

// Sin siguiente nivel ya está en el más alto: la barra va llena.
const progress = computed(() => {
  const s = props.status
  if (!s?.next) return 100
  return Math.min(100, (s.units / s.next.minQty) * 100)
})
</script>

<template>
  <div v-if="visible && status" class="promo" :class="{ 'promo--done': reached }" aria-live="polite">
    <p class="promo__text">
      <i :class="reached ? 'fa-solid fa-circle-check' : 'fa-solid fa-layer-group'" aria-hidden="true"></i>
      <span v-if="reached">{{ copy.reached(status.percent, status.units) }}</span>
      <span v-else-if="status.next">{{ copy.missing(status.next.unitsMissing, status.next.percent) }}</span>
    </p>
    <p v-if="reached && status.next" class="promo__next">
      {{ copy.nextUp(status.next.unitsMissing, status.next.percent) }}
    </p>
    <div
      class="promo__track"
      role="progressbar"
      :aria-valuenow="Math.round(progress)"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <span class="promo__fill" :style="{ width: `${progress}%` }"></span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.promo {
  @include flex(column, stretch, flex-start, 0.45rem);
  padding: 0.85rem 1rem;
  border-radius: $radius-sm;
  background: rgba($accent, 0.05);

  &__text {
    @include flex(row, baseline, flex-start, 0.5rem);
    font-size: $text-xs;
    font-weight: 600;
    color: $ink-soft;

    i {
      color: $accent;
    }
  }

  &__next {
    padding-left: 1.4rem;
    font-size: 0.72rem;
    color: $ink-muted;
  }

  &__track {
    height: 0.4rem;
    border-radius: $radius-pill;
    background: rgba($accent, 0.12);
    overflow: hidden;
  }

  &__fill {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, $accent, $olive);
    transition: width 0.5s $ease;
  }

  &--done &__text {
    color: $accent-deep;

    i {
      color: $success;
    }
  }
}
</style>
