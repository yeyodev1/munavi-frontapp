import { site } from '@/config/site'
import type { OrderStatus, PaymentMethod } from '@/types'

export type StatusTone = 'warning' | 'info' | 'success' | 'accent' | 'danger' | 'muted'

/** Color de cada estado: amarillo = espera algo, verde = cobrado, morado = en camino. */
export const statusTone: Record<OrderStatus, StatusTone> = {
  pending_payment: 'warning',
  awaiting_transfer: 'warning',
  paid: 'success',
  confirmed: 'info',
  shipped: 'accent',
  delivered: 'success',
  canceled: 'muted',
  payment_failed: 'danger',
}

export const statusOptions = (Object.keys(site.orderStatus) as OrderStatus[]).map((value) => ({
  value,
  label: site.orderStatus[value],
}))

export const paymentOptions = (Object.keys(site.paymentMethods) as PaymentMethod[]).map(
  (value) => ({
    value,
    label: site.paymentMethods[value].label,
    icon: site.paymentMethods[value].icon,
  }),
)

/** Etiquetas cortas para listados donde el texto completo no cabe. */
export const paymentShort: Record<PaymentMethod, string> = {
  card: 'Tarjeta',
  transfer: 'Transferencia',
  cash_on_delivery: 'Contra entrega',
}

export function statusLabel(status: OrderStatus): string {
  return site.orderStatus[status] ?? status
}

const dateTime = new Intl.DateTimeFormat('es-EC', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

export function formatDateTime(value: string): string {
  return dateTime.format(new Date(value))
}
