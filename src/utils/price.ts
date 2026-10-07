import { formatMoney } from './format'
import type { VolumeDiscount } from '@/types'

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
  return sortedTiers(tiers).filter((t) => t.minQty <= quantity).pop() ?? null
}
