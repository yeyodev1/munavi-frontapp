import { ref, watch } from 'vue'
import { adminProductsService } from '@/services/adminProducts.service'
import { adminCategoriesService, type AdminCategory } from '@/services/adminCategories.service'
import { useToastStore } from '@/stores/toast'
import type { ApiError, Product } from '@/types'

export type ProductFlag = 'isPublished' | 'isFeatured' | 'isBestSeller'

const flagMessages: Record<ProductFlag, [string, string]> = {
  isPublished: ['Publicado en la tienda', 'Oculto de la tienda'],
  isFeatured: ['Marcado como destacado', 'Ya no es destacado'],
  isBestSeller: ['Marcado como más vendido', 'Ya no es más vendido'],
}

export function useAdminProducts() {
  const toast = useToastStore()

  const items = ref<Product[]>([])
  const categories = ref<AdminCategory[]>([])
  const q = ref('')
  const category = ref('')
  const page = ref(1)
  const pages = ref(1)
  const total = ref(0)
  const loading = ref(false)

  async function load() {
    loading.value = true
    try {
      const data = await adminProductsService.list({
        q: q.value.trim(),
        category: category.value,
        page: page.value,
        limit: 30,
      })
      items.value = data.items
      pages.value = data.pages
      total.value = data.total
    } catch (e) {
      toast.error((e as ApiError).message)
    } finally {
      loading.value = false
    }
  }

  async function loadCategories() {
    try {
      categories.value = await adminCategoriesService.list()
    } catch {
      // Sin categorías el filtro simplemente no aparece.
    }
  }

  /** Cambio rápido desde el listado: se ve al instante y se revierte si falla. */
  async function toggle(product: Product, flag: ProductFlag) {
    const next = !product[flag]
    product[flag] = next
    try {
      await adminProductsService.update(product._id, { [flag]: next })
      toast.success(flagMessages[flag][next ? 0 : 1])
    } catch (e) {
      product[flag] = !next
      toast.error((e as ApiError).message)
    }
  }

  // Escribir en el buscador no dispara una llamada por cada letra.
  let timer: ReturnType<typeof setTimeout> | undefined
  watch(q, () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      if (page.value !== 1) page.value = 1
      else load()
    }, 350)
  })
  watch(category, () => {
    if (page.value !== 1) page.value = 1
    else load()
  })
  watch(page, load)

  load()
  loadCategories()

  return { items, categories, q, category, page, pages, total, loading, toggle }
}
