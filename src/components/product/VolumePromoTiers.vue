<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { sortedTiers } from '@/utils/price'
import { productCopy as copy } from '@/config/copy/product'

/**
 * Niveles de "Compra más, ahorra más" (todo el pedido, combinando productos).
 * Distinto de VolumeTiers, que muestra el descuento propio de un producto.
 */
const props = defineProps<{ participates: boolean }>()

const settings = useSettingsStore()

const tiers = computed(() => {
  const promo = settings.volumePromo
  if (!props.participates || !promo.isActive) return []
  return sortedTiers(promo.tiers)
})

onMounted(() => settings.load())
</script>

<template>
  <div v-if="tiers.length" class="vpromo">
    <p class="vpromo__title">
      <i class="fa-solid fa-layer-group" aria-hidden="true"></i>
      {{ copy.promoTitle }}
      <span class="vpromo__hint">· {{ copy.promoHint }}</span>
    </p>
    <ul class="vpromo__list">
      <li v-for="(tier, index) in tiers" :key="tier.minQty" class="vpromo__item">
        {{ copy.promoTier(tier.minQty, tier.percent, index === tiers.length - 1) }}
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.vpromo {
  @include flex(column, stretch, flex-start, 0.5rem);
  padding: 0.8rem 0.95rem;
  border-radius: $radius-sm;
  border: 1px dashed rgba($accent, 0.45);
  background: $sage-soft;

  &__title {
    @include flex(row, baseline, flex-start, 0.4rem);
    flex-wrap: wrap;
    font-size: $text-sm;
    font-weight: 700;
    color: $accent-deep;
  }

  &__hint {
    font-weight: 500;
    color: $ink-soft;
  }

  &__list {
    list-style: none;
    @include flex(row, center, flex-start, 0.4rem);
    flex-wrap: wrap;
  }

  &__item {
    font-size: $text-xs;
    font-weight: 600;
    padding: 0.32rem 0.7rem;
    border-radius: $radius-pill;
    background: $surface;
    color: $accent-deep;
    border: 1px solid rgba($accent, 0.25);
  }
}
</style>
