<script setup lang="ts">
import type { ProductCard as ProductCardType } from '@/types'
import ProductCard from './ProductCard.vue'
import ProductCardSkeleton from './ProductCardSkeleton.vue'

/**
 * Grilla de productos con flex-wrap. En móvil puede ser un carril horizontal
 * con scroll-snap (`rail`), que deja ver que hay más a la derecha.
 */
withDefaults(
  defineProps<{
    items: ProductCardType[]
    loading?: boolean
    skeletons?: number
    rail?: boolean
  }>(),
  { loading: false, skeletons: 4, rail: false },
)
</script>

<template>
  <div class="grid" :class="{ 'grid--rail': rail }" :aria-busy="loading">
    <template v-if="loading">
      <ProductCardSkeleton v-for="n in skeletons" :key="n" class="grid__cell" />
    </template>
    <ProductCard v-for="product in items" v-else :key="product._id" :product="product" class="grid__cell" />
  </div>
</template>

<style scoped lang="scss">
.grid {
  @include flex-cards(150px, 0.85rem);

  @include from('md') {
    gap: 1.25rem;
  }

  // Columnas de ancho fijo para que la última fila no se estire.
  > .grid__cell {
    flex: 0 1 calc(50% - 0.425rem);

    @include from('md') {
      flex-basis: calc(33.333% - 0.834rem);
    }

    @include from('lg') {
      flex-basis: calc(25% - 0.9375rem);
    }
  }

  &--rail {
    @include until('md') {
      flex-wrap: nowrap;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      margin-inline: -1.25rem;
      padding-inline: 1.25rem;
      padding-bottom: 0.5rem;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }

      > .grid__cell {
        flex: 0 0 68%;
        scroll-snap-align: start;
      }
    }
  }
}
</style>
