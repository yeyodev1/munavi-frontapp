<script setup lang="ts">
import { ref, watch } from 'vue'
import SectionHead from './SectionHead.vue'
import ProductGrid from '@/components/product/ProductGrid.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { useProducts } from '@/composables/useCatalog'
import { useSettingsStore } from '@/stores/settings'
import type { ProductQuery } from '@/services/catalog.service'
import { whatsappLink } from '@/config/site'
import { homeCopy } from '@/config/copy/home'

const props = withDefaults(
  defineProps<{
    eyebrow: string
    title: string
    link?: string
    linkLabel?: string
    query: ProductQuery
    // Si el filtro no trae nada se muestran los más recientes y, si tampoco
    // hay, un estado vacío. Si es false, la sección simplemente no aparece.
    primary?: boolean
  }>(),
  { link: '/tienda', linkLabel: '', primary: false },
)

const settings = useSettingsStore()
const empty = homeCopy.emptyProducts
const query = ref<ProductQuery>({ limit: 8, ...props.query })
const { items, loading, error } = useProducts(query)

watch(loading, (isLoading) => {
  const filtered = query.value.featured || query.value.bestSeller
  if (!isLoading && props.primary && filtered && !items.value.length && !error.value) {
    query.value = { limit: 8 }
  }
})
</script>

<template>
  <section v-if="loading || items.length || primary" class="hprod">
    <SectionHead :eyebrow="eyebrow" :title="title" :link="link" :link-label="items.length ? linkLabel : ''" />

    <EmptyState v-if="!loading && !items.length" :title="empty.title" :text="empty.text" icon="fa-solid fa-seedling">
      <a :href="whatsappLink(undefined, settings.whatsapp)" class="btn btn--primary" target="_blank" rel="noopener">
        <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ empty.cta }}
      </a>
    </EmptyState>
    <ProductGrid v-else :items="items" :loading="loading" rail />
  </section>
</template>

<style scoped lang="scss">
.hprod {
  @include container;
  padding-top: $space-section;
}
</style>
