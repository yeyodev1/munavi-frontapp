import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { ApiError, Order } from '@/types'
import { orderService } from '@/services/order.service'
import { useCartStore } from '@/stores/cart'
import { useSettingsStore } from '@/stores/settings'
import { clearPendingOrder, readPendingOrder, trackPurchaseOnce } from '@/composables/useOrderSession'
import { whatsappLink } from '@/config/site'
import { paymentResultCopy } from '@/config/copy/checkout'

export type ConfirmState = 'missing' | 'confirming' | 'approved' | 'failed' | 'pending' | 'error'

// Estados que ya son un pago cobrado (el admin puede haberlo despachado después).
const APPROVED = ['paid', 'shipped', 'delivered']

/**
 * Respuesta de Payphone. Se confirma apenas monta, sin esperar un clic: si
 * nadie confirma en 5 minutos, Payphone reversa el cobro.
 */
export function usePaymentConfirm() {
  const route = useRoute()
  const cart = useCartStore()
  const settings = useSettingsStore()

  const id = Number(route.query.id)
  const clientTransactionId = String(route.query.clientTransactionId ?? '')
  const pending = readPendingOrder()

  const state = ref<ConfirmState>('confirming')
  const order = ref<Order | null>(null)
  const error = ref<ApiError | null>(null)

  const orderNumber = computed(() => order.value?.orderNumber ?? pending?.orderNumber ?? '')
  const email = computed(() => order.value?.customer.email ?? pending?.email ?? '')
  const retryLink = computed(() => ({ path: '/pago/reintentar', query: { pedido: orderNumber.value, email: email.value } }))
  const orderLink = computed(() => ({ path: `/pedido/${orderNumber.value}`, query: { email: email.value } }))
  const whatsapp = computed(() =>
    whatsappLink(paymentResultCopy.whatsappMessage(orderNumber.value), settings.whatsapp),
  )

  async function confirm() {
    if (!Number.isInteger(id) || id <= 0 || !clientTransactionId) {
      // Payphone vuelve sin id cuando el cliente cancela: si sabemos qué pedido era, se ofrece reintentar.
      state.value = clientTransactionId && pending ? 'failed' : 'missing'
      return
    }
    state.value = 'confirming'
    error.value = null
    try {
      const res = await orderService.confirm(id, clientTransactionId)
      order.value = res.order
      if (APPROVED.includes(res.order.status)) {
        state.value = 'approved'
        cart.clear()
        clearPendingOrder()
        trackPurchaseOnce(res.order)
      } else if (res.order.status === 'payment_failed' || res.order.status === 'canceled') {
        state.value = 'failed'
      } else {
        state.value = 'pending'
      }
    } catch (err) {
      error.value = err as ApiError
      state.value = 'error'
    }
  }

  onMounted(() => {
    settings.load()
    confirm()
  })

  return { state, order, error, orderNumber, email, retryLink, orderLink, whatsapp, confirm }
}
