import { defineStore } from 'pinia'
import type { CartLine, PaymentMethod, Prices, VolumeDiscount } from '@/types'
import { tierFor } from '@/utils/price'

const STORAGE_KEY = 'munavi_cart'
export const MAX_QTY = 50

/** Lo necesario para pintar la línea sin pedir el producto otra vez. */
export interface CartSnapshot {
  name: string
  variantName: string
  image: string
  prices: Prices
  volumeDiscounts: VolumeDiscount[]
}

export interface CartItem extends CartLine {
  slug: string
  snapshot: CartSnapshot
}

export type CartItemInput = Omit<CartItem, 'quantity'>

const priceKey: Record<PaymentMethod, keyof Prices> = {
  card: 'card',
  transfer: 'transfer',
  cash_on_delivery: 'cashOnDelivery',
}

function clampQty(quantity: number): number {
  if (!Number.isFinite(quantity)) return 1
  return Math.min(MAX_QTY, Math.max(1, Math.round(quantity)))
}

// localStorage puede no existir o lanzar (modo privado, cuota llena): el carrito
// sigue funcionando en memoria aunque no se pueda guardar.
function load(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item): item is CartItem =>
        !!item && typeof item.productId === 'string' && typeof item.variantSlug === 'string' && !!item.snapshot,
    )
  } catch {
    return []
  }
}

function save(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // sin persistencia; no es motivo para romper la compra
  }
}

const sameLine = (a: CartLine, productId: string, variantSlug: string) =>
  a.productId === productId && a.variantSlug === variantSlug

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: load(),
    drawerOpen: false,
  }),

  getters: {
    /** Unidades totales (lo que muestra el contador del header). */
    count: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    isEmpty: (state) => state.items.length === 0,
    /** Lo que esperan POST /orders/quote y POST /orders. */
    lines: (state): CartLine[] =>
      state.items.map(({ productId, variantSlug, quantity }) => ({ productId, variantSlug, quantity })),
  },

  actions: {
    add(input: CartItemInput, quantity = 1) {
      const existing = this.items.find((item) => sameLine(item, input.productId, input.variantSlug))
      if (existing) {
        existing.quantity = clampQty(existing.quantity + quantity)
        existing.snapshot = input.snapshot
      } else {
        this.items.push({ ...input, quantity: clampQty(quantity) })
      }
      save(this.items)
    },

    remove(productId: string, variantSlug: string) {
      this.items = this.items.filter((item) => !sameLine(item, productId, variantSlug))
      save(this.items)
    },

    setQty(productId: string, variantSlug: string, quantity: number) {
      if (quantity <= 0) return this.remove(productId, variantSlug)
      const item = this.items.find((line) => sameLine(line, productId, variantSlug))
      if (!item) return
      item.quantity = clampQty(quantity)
      save(this.items)
    },

    clear() {
      this.items = []
      save(this.items)
    },

    open() {
      this.drawerOpen = true
    },

    close() {
      this.drawerOpen = false
    },

    toggle() {
      this.drawerOpen = !this.drawerOpen
    },

    /**
     * Estimado local para pintar mientras llega la cotización. El total real
     * siempre sale de POST /orders/quote.
     */
    estimate(method: PaymentMethod = 'card'): number {
      return this.items.reduce((sum, item) => {
        const subtotal = item.snapshot.prices[priceKey[method]] * item.quantity
        const tier = tierFor(item.snapshot.volumeDiscounts, item.quantity)
        return sum + subtotal - (tier ? Math.round((subtotal * tier.percent) / 100) : 0)
      }, 0)
    },
  },
})
