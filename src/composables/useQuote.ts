import { computed, onUnmounted, ref, watch, type Ref } from 'vue'
import type { ApiError, PaymentMethod, Quote } from '@/types'
import { useCartStore } from '@/stores/cart'
import { orderService } from '@/services/order.service'

export const PAYMENT_METHODS: PaymentMethod[] = ['card', 'transfer', 'cash_on_delivery']

const DEBOUNCE_MS = 350

/** El backend responde null cuando no hay umbral de envío gratis (los tipos dicen number). */
export function amountToFreeShipping(quote: Quote | null): number | null {
  if (!quote) return null
  return quote.amountToFreeShipping ?? null
}

/**
 * Cotización real del carrito contra POST /orders/quote. Se cotizan los métodos
 * en paralelo para mostrar el total de cada uno sin esperar al cambiar de método.
 * El cliente nunca calcula totales: solo pinta lo que responde el servidor.
 */
export function useQuote(method: Ref<PaymentMethod>, methods: PaymentMethod[] = PAYMENT_METHODS) {
  const cart = useCartStore()
  const quotes = ref<Partial<Record<PaymentMethod, Quote>>>({})
  const couponCode = ref('')
  const couponError = ref('')
  const loading = ref(false)
  const error = ref<ApiError | null>(null)

  const quote = computed(() => quotes.value[method.value] ?? null)

  // Cada petición lleva un número: si llega tarde una vieja, se descarta.
  let seq = 0
  let timer: ReturnType<typeof setTimeout> | null = null

  async function refresh(): Promise<void> {
    if (timer) clearTimeout(timer)
    timer = null
    if (cart.isEmpty) {
      quotes.value = {}
      loading.value = false
      return
    }

    const id = ++seq
    const code = couponCode.value || undefined
    const items = cart.lines
    loading.value = true

    try {
      const results = await Promise.all(
        methods.map((paymentMethod) => orderService.quote({ items, paymentMethod, couponCode: code })),
      )
      if (id !== seq) return
      quotes.value = Object.fromEntries(methods.map((m, i) => [m, results[i]]))
      error.value = null
    } catch (err) {
      if (id !== seq) return
      const apiError = err as ApiError
      // Un cupón inválido devuelve 404: se avisa en el campo y se cotiza sin él.
      if (code && apiError.status === 404) {
        couponError.value = apiError.message
        couponCode.value = ''
        return refresh()
      }
      error.value = apiError
    } finally {
      if (id === seq) loading.value = false
    }
  }

  function schedule() {
    if (timer) clearTimeout(timer)
    loading.value = !cart.isEmpty
    timer = setTimeout(refresh, DEBOUNCE_MS)
  }

  function applyCoupon(code: string) {
    couponError.value = ''
    couponCode.value = code.trim().toUpperCase()
    return refresh()
  }

  function removeCoupon() {
    couponError.value = ''
    couponCode.value = ''
    return refresh()
  }

  // Cantidades y líneas cambian desde el stepper: se espera a que el cliente termine.
  watch(() => JSON.stringify(cart.lines), schedule)

  onUnmounted(() => {
    if (timer) clearTimeout(timer)
    seq++
  })

  return { quotes, quote, couponCode, couponError, loading, error, refresh, applyCoupon, removeCoupon }
}
