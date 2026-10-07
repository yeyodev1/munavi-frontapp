import { formatMoney } from '@/utils/format'

/**
 * El API habla en centavos y Nathalie en dólares. Toda conversión pasa por acá
 * para que un "12,5" escrito a mano termine siendo 1250 y no 125 ni 12.
 */
export function parseDollars(raw: string): number | null {
  const clean = raw.replace(/[^\d.,]/g, '').replace(',', '.')
  if (!clean) return null
  const value = Number(clean)
  return Number.isFinite(value) ? value : null
}

export function toCents(dollars: number): number {
  return Math.round(dollars * 100)
}

export function centsToInput(cents: number | null | undefined): string {
  if (cents === null || cents === undefined) return ''
  return (cents / 100).toFixed(2)
}

export function money(cents: number | null | undefined): string {
  return formatMoney((cents ?? 0) / 100)
}
