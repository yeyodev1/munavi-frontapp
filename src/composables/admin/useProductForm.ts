import { computed, ref, watch, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { adminProductsService, type ProductInput } from '@/services/adminProducts.service'
import { adminCategoriesService, type AdminCategory } from '@/services/adminCategories.service'
import { useToastStore } from '@/stores/toast'
import type { ApiError, Product } from '@/types'

function emptyDraft(): ProductInput {
  return {
    name: '',
    slug: '',
    category: '',
    shortDescription: '',
    description: '',
    presentation: '',
    usage: '',
    ingredients: '',
    nutritionInfo: '',
    warnings: '',
    benefits: [],
    images: [],
    variants: [],
    prices: { card: 0, transfer: 0, cashOnDelivery: 0 },
    compareAtPrice: null,
    volumeDiscounts: [],
    isFeatured: false,
    isBestSeller: false,
    isPublished: false,
    order: 0,
  }
}

function fromProduct(product: Product): ProductInput {
  const category =
    typeof product.category === 'string' ? product.category : (product.category._id ?? '')
  return {
    ...emptyDraft(),
    ...product,
    category,
    benefits: [...(product.benefits ?? [])],
    images: [...(product.images ?? [])],
    variants: (product.variants ?? []).map((v) => ({ ...v })),
    volumeDiscounts: (product.volumeDiscounts ?? []).map((t) => ({ ...t })),
  }
}

/** Solo los campos del formulario, sin filas vacías que quedaron al editar. */
function clean(draft: ProductInput): ProductInput {
  const base = emptyDraft()
  const picked = Object.fromEntries(
    (Object.keys(base) as Array<keyof ProductInput>).map((key) => [key, draft[key]]),
  ) as ProductInput
  return {
    ...picked,
    benefits: draft.benefits.map((b) => b.trim()).filter(Boolean),
    variants: draft.variants.filter((v) => v.name.trim() || v.image),
    volumeDiscounts: draft.volumeDiscounts.filter((t) => t.minQty > 0 && t.percent > 0),
  }
}

/** Antes de llamar al API: los errores más comunes, dichos en simple. */
function firstProblem(draft: ProductInput): string {
  if (!draft.name.trim()) return 'Escribe el nombre del producto'
  if (!draft.category) return 'Elige una categoría'
  if (!draft.prices.card || !draft.prices.transfer || !draft.prices.cashOnDelivery) {
    return 'Completa los tres precios (tarjeta, transferencia y contra entrega)'
  }
  if (draft.variants.some((v) => !v.name.trim() && v.image))
    return 'Hay un sabor con foto pero sin nombre'
  return ''
}

export function useProductForm(id: Ref<string | undefined>) {
  const router = useRouter()
  const toast = useToastStore()

  const form = ref<ProductInput>(emptyDraft())
  const categories = ref<AdminCategory[]>([])
  const loading = ref(false)
  const saving = ref(false)
  const notFound = ref(false)
  const isNew = computed(() => !id.value)

  async function load() {
    loading.value = true
    notFound.value = false
    try {
      const [cats, product] = await Promise.all([
        adminCategoriesService.list(),
        id.value ? adminProductsService.getOne(id.value) : Promise.resolve(null),
      ])
      categories.value = cats
      form.value = product ? fromProduct(product) : emptyDraft()
      if (!product && cats.length === 1) form.value.category = cats[0]!._id
    } catch (e) {
      const error = e as ApiError
      if (error.status === 404) notFound.value = true
      else toast.error(error.message)
    } finally {
      loading.value = false
    }
  }

  async function save() {
    const problem = firstProblem(form.value)
    if (problem) {
      toast.error(problem)
      return
    }

    saving.value = true
    try {
      const payload = clean(form.value)
      if (id.value) {
        form.value = fromProduct(await adminProductsService.update(id.value, payload))
        toast.success('Cambios guardados')
      } else {
        const created = await adminProductsService.create(payload)
        toast.success('Producto creado')
        router.replace({ name: 'AdminProductEdit', params: { id: created._id } })
      }
    } catch (e) {
      toast.error((e as ApiError).message)
    } finally {
      saving.value = false
    }
  }

  async function remove(): Promise<boolean> {
    if (!id.value) return false
    try {
      await adminProductsService.remove(id.value)
      toast.success('Producto eliminado')
      router.replace({ name: 'AdminProducts' })
      return true
    } catch (e) {
      toast.error((e as ApiError).message)
      return false
    }
  }

  // La misma vista sirve para "nuevo" y "editar": al pasar de una a otra se recarga.
  watch(id, load, { immediate: true })

  return { form, categories, loading, saving, notFound, isNew, save, remove }
}
