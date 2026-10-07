<script setup lang="ts">
import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { money } from '@/utils/price'
import { cartCopy as copy } from '@/config/copy/checkout'

/** Progreso hacia el envío gratis. `amount` en centavos, ya con descuentos. */
const props = defineProps<{ amount: number }>()

const settings = useSettingsStore()

const threshold = computed(() => {
  const shipping = settings.shipping
  // Sin umbral o con envío siempre gratis no hay meta que mostrar.
  if (!shipping || !shipping.flatRate || !shipping.freeShippingThreshold) return null
  return shipping.freeShippingThreshold
})

const missing = computed(() => (threshold.value ? Math.max(0, threshold.value - props.amount) : 0))
const progress = computed(() => (threshold.value ? Math.min(100, (props.amount / threshold.value) * 100) : 0))
</script>

<template>
  <div v-if="threshold" class="ship" :class="{ 'ship--done': !missing }">
    <p class="ship__text">
      <i :class="missing ? 'fa-solid fa-truck' : 'fa-solid fa-circle-check'" aria-hidden="true"></i>
      {{ missing ? copy.freeShippingMissing(money(missing)) : copy.freeShippingDone }}
    </p>
    <div
      class="ship__track"
      role="progressbar"
      :aria-valuenow="Math.round(progress)"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <span class="ship__fill" :style="{ width: `${progress}%` }"></span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ship {
  @include flex(column, stretch, flex-start, 0.5rem);
  padding: 0.85rem 1rem;
  border-radius: $radius-sm;
  background: rgba($accent, 0.05);

  &__text {
    @include flex(row, center, flex-start, 0.5rem);
    font-size: $text-xs;
    font-weight: 600;
    color: $ink-soft;

    i {
      color: $accent;
    }
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

  &--done &__text i {
    color: $success;
  }

  &--done &__fill {
    background: $success;
  }
}
</style>
