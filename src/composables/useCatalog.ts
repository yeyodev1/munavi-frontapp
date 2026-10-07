import { ref, shallowRef, watch, type Ref } from 'vue'
import type { ApiError, Category, ProductCard } from '@/types'
import { catalogService, type ProductQuery } from '@/services/catalog.service'

// Las categorías cambian poco: se piden una vez por carga y se comparten.
const categories = shallowRef<Category[]>([])
const categoriesLoading = ref(false)
const categoriesError = ref('')
let categoriesRequest: Promise<void> | null = null

function loadCategories(force = false): Promise<void> {
  if (categoriesRequest && !force) return categoriesRequest
  categoriesLoading.value = true
  categoriesError.value = ''
  categoriesRequest = catalogService
    .getCategories()
    .then((data) => {
      categories.value = data
    })
    .catch((error: ApiError) => {
      categoriesError.value = error.message
      categoriesRequest = null
    })
    .finally(() => {
      categoriesLoading.value = false
    })
  return categoriesRequest
}

export function useCategories() {
  loadCategories()
  return {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    reload: () => loadCategories(true),
  }
}

/**
 * Lista de productos que se vuelve a pedir cada vez que cambia la consulta.
 * Las respuestas viejas se descartan para que un filtro lento no pise a uno nuevo.
 */
export function useProducts(query: Ref<ProductQuery> | (() => ProductQuery)) {
  const items = shallowRef<ProductCard[]>([])
  const total = ref(0)
  const pages = ref(1)
  const loading = ref(true)
  const error = ref('')
  let ticket = 0

  async function fetch() {
    const current = ++ticket
    loading.value = true
    error.value = ''
    try {
      const params = typeof query === 'function' ? query() : query.value
      const data = await catalogService.getProducts(params)
      if (current !== ticket) return
      items.value = data.items
      total.value = data.total
      pages.value = data.pages
    } catch (err) {
      if (current !== ticket) return
      items.value = []
      error.value = (err as ApiError).message
    } finally {
      if (current === ticket) loading.value = false
    }
  }

  watch(query, fetch, { immediate: true, deep: true })

  return { items, total, pages, loading, error, reload: fetch }
}
