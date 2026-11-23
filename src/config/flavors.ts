// Íconos de sabores que entregó Munavi (public/brand/sabores/<clave>.webp).
const ICONS = [
  'frutos-amarillos',
  'frutos-rojos',
  'fruit-punch',
  'blueberry',
  'cereza',
  'chocolate',
  'coco',
  'cookies',
  'fresa',
  'guanabana',
  'pina',
  'tamarindo',
  'vainilla',
]
const ALIASES: Record<string, string> = { oreo: 'cookies' }

/** Ícono del sabor por su slug ("pina-colada" → piña, "vainilla-francesa" → vainilla); null si no hay. */
export function flavorIcon(slug: string): string | null {
  const words = `-${slug}-`
  const key = ALIASES[slug] ?? ICONS.find((k) => words.includes(`-${k}-`))
  return key ? `/brand/sabores/${key}.webp` : null
}
