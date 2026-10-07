import { computed, ref, watch, type Ref } from 'vue'
import { adminOrdersService, type OrderPatch } from '@/services/adminOrders.service'
import { useToastStore } from '@/stores/toast'
import { whatsappLink } from '@/config/site'
import type { ApiError, Order } from '@/types'

/** Celular ecuatoriano "0991234567" → "593991234567", que es lo que pide wa.me. */
export function toWhatsappNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('593')) return digits
  if (digits.startsWith('0')) return `593${digits.slice(1)}`
  return digits.length === 9 ? `593${digits}` : digits
}

/** Lo que significa el código de Payphone, en palabras de la tienda. */
export function payphoneLabel(code: number | null | undefined): string {
  if (code === 3) return 'Aprobado'
  if (code === 2) return 'Cancelado o rechazado'
  if (code === null || code === undefined) return 'Sin respuesta todavía'
  return `Código ${code}`
}

export function useOrderDetail(id: Ref<string>) {
  const toast = useToastStore()
  const order = ref<Order | null>(null)
  const loading = ref(false)
  const saving = ref(false)
  const notFound = ref(false)
  const notes = ref('')

  const whatsapp = computed(() => {
    if (!order.value) return '#'
    const { customer, orderNumber } = order.value
    const firstName = customer.name.split(' ')[0] ?? ''
    return whatsappLink(
      `Hola ${firstName}, te escribimos de Munavi por tu pedido ${orderNumber}.`,
      toWhatsappNumber(customer.phone),
    )
  })

  async function load() {
    loading.value = true
    notFound.value = false
    try {
      order.value = await adminOrdersService.getOne(id.value)
      notes.value = order.value.adminNotes ?? ''
    } catch (e) {
      const error = e as ApiError
      if (error.status === 404 || error.status === 400) notFound.value = true
      else toast.error(error.message)
    } finally {
      loading.value = false
    }
  }

  async function update(patch: OrderPatch, success: string): Promise<boolean> {
    if (!order.value) return false
    saving.value = true
    try {
      order.value = await adminOrdersService.update(order.value._id, patch)
      toast.success(success)
      return true
    } catch (e) {
      toast.error((e as ApiError).message)
      return false
    } finally {
      saving.value = false
    }
  }

  function saveNotes() {
    return update({ adminNotes: notes.value }, 'Notas guardadas')
  }

  watch(id, load, { immediate: true })

  return { order, loading, saving, notFound, notes, whatsapp, update, saveNotes }
}
