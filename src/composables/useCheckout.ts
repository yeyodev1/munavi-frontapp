import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { ApiError, Order, PaymentMethod, PayphoneBox } from '@/types'
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'
import { orderService } from '@/services/order.service'
import { useQuote } from '@/composables/useQuote'
import { useCheckoutForm } from '@/composables/useCheckoutForm'
import { trackInitiateCheckout } from '@/composables/useTracking'
import { cartTrackItems, savePendingOrder, trackPurchaseOnce } from '@/composables/useOrderSession'
import { checkoutCopy as copy } from '@/config/copy/checkout'

export interface CardPayment {
  order: Order
  payphone: PayphoneBox
}

/** Todo el checkout de una página: datos, cotización, creación del pedido y pago. */
export function useCheckout() {
  const router = useRouter()
  const cart = useCartStore()
  const toast = useToastStore()

  const method = ref<PaymentMethod>('card')
  const quoting = useQuote(method)
  const checkoutForm = useCheckoutForm()

  const submitting = ref(false)
  const renewing = ref(false)
  const cardUnavailable = ref(false)
  const payment = ref<CardPayment | null>(null)

  const canSubmit = computed(
    () => !!quoting.quote.value && !quoting.loading.value && !submitting.value && !quoting.error.value,
  )

  onMounted(() => {
    if (cart.isEmpty) return
    trackInitiateCheckout(cartTrackItems(cart.items), cart.estimate('card'))
    quoting.refresh()
  })

  // Si el cliente vuelve a tarjeta después de un 503, se le recuerda la alternativa.
  watch(method, () => {
    if (method.value !== 'card') cardUnavailable.value = false
  })

  async function focusFirstError() {
    await nextTick()
    const field = document.querySelector<HTMLElement>('[aria-invalid="true"]')
    field?.focus()
    field?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  async function submit() {
    if (!checkoutForm.validate()) {
      toast.error(copy.errors.form)
      return focusFirstError()
    }
    if (!canSubmit.value) return

    submitting.value = true
    checkoutForm.remember()
    try {
      const res = await orderService.create({
        customer: checkoutForm.customer(),
        shippingAddress: checkoutForm.shippingAddress(),
        items: cart.lines,
        paymentMethod: method.value,
        couponCode: quoting.couponCode.value || undefined,
      })

      if (res.order.paymentMethod === 'card' && res.payphone) {
        // El carrito se vacía recién cuando Payphone aprueba el pago.
        savePendingOrder({ orderNumber: res.order.orderNumber, email: res.order.customer.email })
        payment.value = { order: res.order, payphone: res.payphone }
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }

      trackPurchaseOnce(res.order)
      cart.clear()
      router.push({ name: 'Order', params: { orderNumber: res.order.orderNumber }, query: { email: res.order.customer.email } })
    } catch (err) {
      const apiError = err as ApiError
      if (apiError.status === 503 && method.value === 'card') {
        cardUnavailable.value = true
        toast.error(`${apiError.message}. ${copy.errors.cardUnavailable}`)
      } else {
        toast.error(apiError.message)
      }
    } finally {
      submitting.value = false
    }
  }

  /** El formulario de Payphone expiró o falló: nuevo clientTransactionId. */
  async function renewPayment() {
    if (!payment.value) return
    renewing.value = true
    try {
      const { order } = payment.value
      payment.value = await orderService.retry(order.orderNumber, order.customer.email)
    } catch (err) {
      toast.error((err as ApiError).message)
    } finally {
      renewing.value = false
    }
  }

  return {
    method,
    ...quoting,
    ...checkoutForm,
    submitting,
    renewing,
    cardUnavailable,
    payment,
    canSubmit,
    submit,
    renewPayment,
  }
}
