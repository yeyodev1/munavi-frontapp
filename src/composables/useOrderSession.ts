import type { Order } from '@/types'
import type { CartItem } from '@/stores/cart'
import { trackPurchase, type TrackItem } from '@/composables/useTracking'

/**
 * Lo que sobrevive entre el checkout y la página de respuesta de Payphone
 * (que llega con una redirección completa), y la idempotencia de Purchase.
 */

const PENDING_KEY = 'munavi_pending_order'
const PURCHASE_PREFIX = 'munavi_purchase_'

export interface PendingOrder {
  orderNumber: string
  email: string
}

export function savePendingOrder(pending: PendingOrder) {
  try {
    sessionStorage.setItem(PENDING_KEY, JSON.stringify(pending))
  } catch {
    // sin sessionStorage la respuesta igual funciona con lo que devuelve /confirm
  }
}

export function readPendingOrder(): PendingOrder | null {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(PENDING_KEY) || 'null')
    return parsed?.orderNumber && parsed?.email ? parsed : null
  } catch {
    return null
  }
}

export function clearPendingOrder() {
  try {
    sessionStorage.removeItem(PENDING_KEY)
  } catch {
    // nada que limpiar
  }
}

export function cartTrackItems(items: CartItem[]): TrackItem[] {
  return items.map((item) => ({
    id: item.productId,
    name: item.snapshot.name,
    variant: item.snapshot.variantName,
    price: item.snapshot.prices.card,
    quantity: item.quantity,
  }))
}

/**
 * Purchase una sola vez por pedido, aunque recargue la página o abra el enlace
 * otra vez. Se marca en localStorage para que tampoco se repita en otra pestaña.
 */
export function trackPurchaseOnce(order: Order) {
  const key = PURCHASE_PREFIX + order.orderNumber
  try {
    if (localStorage.getItem(key)) return
    localStorage.setItem(key, '1')
  } catch {
    // sin storage se mide igual: preferimos un duplicado improbable a perder la venta
  }
  trackPurchase(
    order.orderNumber,
    order.total,
    order.items.map((item) => ({
      id: item.product,
      name: item.productName,
      variant: item.variantName,
      price: item.unitPrice,
      quantity: item.quantity,
    })),
  )
}
