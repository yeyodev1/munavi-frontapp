<script setup lang="ts">
import { computed } from 'vue'
import ProductGrid from './ProductGrid.vue'
import { useProducts } from '@/composables/useCatalog'
import { productDetailCopy as copy } from '@/config/copy/product'

const props = defineProps<{ category: string; excludeId: string }>()

const { items, loading } = useProducts(() => ({ category: props.category, limit: 5 }))
const related = computed(() => items.value.filter((p) => p._id !== props.excludeId).slice(0, 4))
</script>

<template>
  <section v-if="loading || related.length" class="related">
    <h2 class="related__title">{{ copy.related }}</h2>
    <ProductGrid :items="related" :loading="loading" rail />
  </section>
</template>

<style scoped lang="scss">
.related {
  padding-top: $space-xl;

  &__title {
    @include display($display-sm);
    margin-bottom: $space-md;
  }
}
</style>
