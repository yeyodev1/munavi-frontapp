import { computed, ref, watch, type Ref } from 'vue'
import type { ApiError, Order } from '@/types'
import { orderService } from '@/services/order.service'
import { useSettingsStore } from '@/stores/settings'
import { whatsappLink } from '@/config/site'
import { orderCopy } from '@/config/copy/checkout'

/** Pedido público por número + correo (GET /orders/lookup). */
export function useOrderLookup(orderNumber: Ref<string>, email: Ref<string>) {
  const settings = useSettingsStore()
  const order = ref<Order | null>(null)
  const loading = ref(false)
  const error = ref<ApiError | null>(null)

  async function load() {
    if (!orderNumber.value || !email.value) {
      order.value = null
      return
    }
    loading.value = true
    error.value = null
    try {
      order.value = await orderService.lookup(orderNumber.value, email.value)
    } catch (err) {
      order.value = null
      error.value = err as ApiError
    } finally {
      loading.value = false
    }
  }

  watch([orderNumber, email], load, { immediate: true })
  settings.load()

  const bankInfo = computed(() => settings.settings?.bankTransferInfo ?? '')
  const helpLink = computed(() =>
    whatsappLink(orderCopy.helpMessage(order.value?.orderNumber ?? orderNumber.value), settings.whatsapp),
  )
  const placedAt = computed(() =>
    order.value
      ? new Intl.DateTimeFormat('es-EC', { dateStyle: 'long', timeStyle: 'short', timeZone: 'America/Guayaquil' }).format(
          new Date(order.value.createdAt),
        )
      : '',
  )
  /** Tarjeta sin cobrar: se ofrece reintentar el pago. */
  const canRetryPayment = computed(
    () => order.value?.paymentMethod === 'card' && ['pending_payment', 'payment_failed'].includes(order.value.status),
  )

  return { order, loading, error, load, bankInfo, helpLink, placedAt, canRetryPayment }
}
