import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCategories, useProducts } from '@/composables/useCatalog'
import { findNeed } from '@/config/needs'

const PAGE_SIZE = 12

/**
 * La URL es la fuente de verdad del filtro (/tienda/:category?necesidad=&q=&page=):
 * se puede compartir por WhatsApp y "atrás" funciona como se espera.
 */
export function useShop() {
  const route = useRoute()
  const router = useRouter()
  const { categories, loading: categoriesLoading } = useCategories()

  const category = computed(() => String(route.params.category ?? ''))
  const q = computed(() => String(route.query.q ?? '').trim())
  const page = computed(() => Math.max(1, Number(route.query.page) || 1))

  const current = computed(() => categories.value.find((c) => c.slug === category.value) ?? null)

  // "Necesidad" del inicio (belleza, huesos…): una lista fija de productos.
  const need = computed(() => findNeed(String(route.query.necesidad ?? '')))

  const { items, total, pages, loading, error, reload } = useProducts(() => ({
    category: category.value || undefined,
    slugs: need.value?.products,
    q: q.value || undefined,
    page: page.value,
    limit: PAGE_SIZE,
  }))

  // Buscador con debounce: escribe en la URL cuando el usuario deja de teclear.
  const search = ref(q.value)
  let timer: ReturnType<typeof setTimeout> | undefined
  watch(q, (value) => {
    if (value !== search.value.trim()) search.value = value
  })
  watch(search, (value) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      const next = value.trim()
      if (next === q.value) return
      router.replace({ query: { ...route.query, q: next || undefined, page: undefined } })
    }, 350)
  })

  function clearSearch() {
    search.value = ''
  }

  function goToPage(next: number) {
    router.push({ query: { ...route.query, page: next > 1 ? String(next) : undefined } })
  }

  // Elegir una categoría suelta la necesidad: son dos formas de filtrar, no se suman.
  function categoryLink(slug: string) {
    return { path: slug ? `/tienda/${slug}` : '/tienda', query: q.value ? { q: q.value } : {} }
  }

  return {
    categories,
    categoriesLoading,
    category,
    current,
    need,
    q,
    page,
    pages,
    items,
    total,
    loading,
    error,
    reload,
    search,
    clearSearch,
    goToPage,
    categoryLink,
  }
}
