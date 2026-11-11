import { formatMoney } from './format'
import type { BundlePrice, VolumeDiscount } from '@/types'

/** El API manda centavos; la UI siempre pinta dólares. */
export function money(cents: number): string {
  return formatMoney(cents / 100)
}

/** % de ahorro del precio con tarjeta frente al tachado; 0 si no hay promoción real. */
export function savingsPercent(compareAt: number | null, price: number): number {
  if (!compareAt || compareAt <= price) return 0
  return Math.round(((compareAt - price) / compareAt) * 100)
}

/** Tramos ordenados de menor a mayor cantidad, sin los que no descuentan nada. */
export function sortedTiers(tiers: VolumeDiscount[] = []): VolumeDiscount[] {
  return tiers.filter((t) => t.percent > 0 && t.minQty > 1).sort((a, b) => a.minQty - b.minQty)
}

/** El tramo que aplica a una cantidad: el de mayor minQty <= quantity. */
export function tierFor(tiers: VolumeDiscount[] = [], quantity: number): VolumeDiscount | null {
  return (
    sortedTiers(tiers)
      .filter((t) => t.minQty <= quantity)
      .pop() ?? null
  )
}

/** Hay productos publicados antes de tener precio: se muestran pero no se venden. */
export function hasPrice(prices?: { card: number } | null): boolean {
  return !!prices && prices.card > 0
}

/** Packs válidos de "Compra más, ahorra más", de menor a mayor cantidad. */
export function sortedBundles(bundles: BundlePrice[] = []): BundlePrice[] {
  return bundles.filter((b) => b.qty > 1 && b.total > 0).sort((a, b) => a.qty - b.qty)
}

/** El pack más grande que entra en la cantidad (igual que el servidor). */
export function bundleFor(bundles: BundlePrice[] = [], quantity: number): BundlePrice | null {
  return (
    sortedBundles(bundles)
      .filter((b) => b.qty <= quantity)
      .pop() ?? null
  )
}

/** Precio de N unidades con el pack: su precio unitario por las unidades. */
export function bundleLineTotal(bundle: BundlePrice, quantity: number): number {
  return Math.round((bundle.total * quantity) / bundle.qty)
}

export interface BundleOffer {
  qty: number
  /** Total a P.V.P. regular. */
  normal: number
  /** Lo que paga el cliente. */
  promo: number
  save: number
  /** Con un decimal, como en la tabla de Munavi (30,3 %). */
  percent: number
  unit: number
}

/** Cada pack con su precio normal, ahorro y precio por unidad; solo los que de verdad ahorran. */
export function bundleOffers(bundles: BundlePrice[] = [], unitPrice: number): BundleOffer[] {
  return sortedBundles(bundles)
    .map((b) => {
      const normal = unitPrice * b.qty
      const save = normal - b.total
      return {
        qty: b.qty,
        normal,
        promo: b.total,
        save,
        percent: normal ? Math.round((save / normal) * 1000) / 10 : 0,
        unit: Math.round(b.total / b.qty),
      }
    })
    .filter((o) => o.save > 0)
}
