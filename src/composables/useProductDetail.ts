import { computed, ref, shallowRef, watch, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import type { ApiError, Product } from '@/types'
import { site } from '@/config/site'
import { hasPrice } from '@/utils/price'
import { catalogService } from '@/services/catalog.service'
import { useAddToCart } from '@/composables/useAddToCart'
import { trackViewContent } from '@/composables/useTracking'

/** Estado de la ficha: producto, sabor elegido, galería, cantidad y compra. */
export function useProductDetail(slug: Ref<string>) {
  const router = useRouter()
  const { addToCart } = useAddToCart()

  const product = shallowRef<Product | null>(null)
  const loading = ref(true)
  const error = ref<ApiError | null>(null)
  const variantSlug = ref('')
  const quantity = ref(1)
  const activeImage = ref(0)

  const variants = computed(() => product.value?.variants.filter((v) => v.isActive) ?? [])
  const variant = computed(() => variants.value.find((v) => v.slug === variantSlug.value) ?? null)
  const hasFlavors = computed(() => variants.value.length > 1)
  const inStock = computed(() => {
    const v = variant.value
    return !!v && v.inStock !== false && (v.stock == null || v.stock > 0)
  })
  const priced = computed(() => hasPrice(product.value?.prices))
  const maxQty = computed(() => Math.min(50, variant.value?.stock ?? 50))
  const categorySlug = computed(() => {
    const c = product.value?.category
    return c && typeof c === 'object' ? c.slug : ''
  })
  const categoryName = computed(() => {
    const c = product.value?.category
    return c && typeof c === 'object' ? c.name : ''
  })

  // La galería empieza por la foto del sabor elegido; las generales van después.
  const images = computed(() => {
    const general = product.value?.images.map((i) => i.url) ?? []
    const own = variant.value?.image?.url
    return own ? [own, ...general.filter((url) => url !== own)] : general
  })

  watch(variantSlug, () => {
    activeImage.value = 0
    if (quantity.value > maxQty.value) quantity.value = Math.max(1, maxQty.value)
  })

  async function load() {
    loading.value = true
    error.value = null
    try {
      const data = await catalogService.getProduct(slug.value)
      product.value = data
      const active = data.variants.filter((v) => v.isActive)
      const first = active.find((v) => v.inStock !== false && (v.stock == null || v.stock > 0)) ?? active[0]
      variantSlug.value = first?.slug ?? ''
      quantity.value = 1
      activeImage.value = 0
      document.title = `${data.name} — ${site.name}`
      trackViewContent({ id: data._id, name: data.name, price: data.prices.card, quantity: 1 })
    } catch (err) {
      product.value = null
      error.value = err as ApiError
    } finally {
      loading.value = false
    }
  }

  watch(slug, load, { immediate: true })

  function add(openDrawer = true) {
    const p = product.value
    const v = variant.value
    if (!p || !v || !inStock.value || !priced.value) return
    addToCart(
      {
        productId: p._id,
        slug: p.slug,
        variantSlug: v.slug,
        snapshot: {
          name: p.name,
          variantName: v.name,
          image: v.image?.url || p.images[0]?.url || '',
          prices: p.prices,
          volumeDiscounts: p.volumeDiscounts,
        },
      },
      quantity.value,
      { openDrawer },
    )
  }

  function buyNow() {
    if (!inStock.value || !priced.value) return
    add(false)
    router.push({ name: 'Checkout' })
  }

  return {
    product,
    loading,
    error,
    variants,
    variant,
    variantSlug,
    hasFlavors,
    inStock,
    priced,
    maxQty,
    quantity,
    images,
    activeImage,
    categorySlug,
    categoryName,
    load,
    add: () => add(true),
    buyNow,
  }
}
