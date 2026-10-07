import { useCartStore, type CartItemInput } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'
import { trackAddToCart } from '@/composables/useTracking'
import { productCopy } from '@/config/copy/product'
import { hasPrice } from '@/utils/price'

/**
 * Un solo camino para agregar al carrito (tarjeta, ficha, "comprar ahora"):
 * guarda la línea, mide el evento y abre el drawer para que el cliente vea
 * que funcionó.
 */
export function useAddToCart() {
  const cart = useCartStore()
  const toast = useToastStore()

  function addToCart(input: CartItemInput, quantity = 1, options: { openDrawer?: boolean } = {}) {
    // Sin precio no se vende por la web; la UI ya ofrece WhatsApp en su lugar.
    if (!hasPrice(input.snapshot.prices)) return
    cart.add(input, quantity)
    trackAddToCart({
      id: input.productId,
      name: input.snapshot.name,
      variant: input.snapshot.variantName,
      price: input.snapshot.prices.card,
      quantity,
    })
    if (options.openDrawer === false) return
    toast.success(`${productCopy.added}: ${input.snapshot.name}`)
    cart.open()
  }

  return { addToCart }
}
