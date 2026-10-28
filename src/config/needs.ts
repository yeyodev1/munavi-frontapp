/**
 * "Encuentra lo que tu cuerpo pide": las nueve necesidades del catálogo 2026
 * con los íconos de la diseñadora de Munavi (Drive "WEB MUNAVI" → íconos).
 * Cada necesidad es una lista fija de productos, porque un mismo producto
 * puede responder a varias (el propóleo sirve a inmunidad y respiración).
 */
export interface Need {
  slug: string
  name: string
  description: string
  icon: string
  products: string[]
}

const icon = (name: string) => `/brand/necesidades/${name}.svg`

export const needs: Need[] = [
  {
    slug: 'belleza',
    name: 'Belleza',
    description: 'Colágenos para una piel firme, cabello sano y uñas fuertes.',
    icon: icon('belleza'),
    products: ['collagen-advanced', 'collagen-power', 'colageno-magnesio'],
  },
  {
    slug: 'inmunidad',
    name: 'Inmunidad',
    description: 'Calostro, propóleo y vitaminas para reforzar tus defensas.',
    icon: icon('inmunidad'),
    products: ['calostrovit-advanced', 'calostrovit-polvo', 'defensevit', 'propoleo', 'multivitaminico'],
  },
  {
    slug: 'salud-femenina',
    name: 'Salud femenina',
    description: 'Apoyo para el equilibrio hormonal y el ciclo menstrual.',
    icon: icon('salud-femenina'),
    products: ['myo-d-chiro-inositol', 'colageno-magnesio'],
  },
  {
    slug: 'huesos',
    name: 'Huesos',
    description: 'Calcio bien dirigido: vitamina D3 + K2, magnesio y colágeno.',
    icon: icon('huesos'),
    products: [
      'vitamina-d3-k2',
      'colageno-magnesio',
      'citrato-de-magnesio-capsulas',
      'citrato-de-magnesio-polvo',
      'colartrim',
    ],
  },
  {
    slug: 'manejo-del-estres',
    name: 'Manejo del estrés',
    description: 'Magnesio y vitaminas del complejo B para descansar y rendir mejor.',
    icon: icon('manejo-del-estres'),
    products: ['citrato-de-magnesio-capsulas', 'citrato-de-magnesio-polvo', 'multivitaminico'],
  },
  {
    slug: 'digestion',
    name: 'Digestión',
    description: 'Fibra y superalimentos para una digestión ligera.',
    icon: icon('digestion'),
    products: ['detox-fiber', 'hepapharm'],
  },
  {
    slug: 'rendimiento-deportivo',
    name: 'Rendimiento deportivo',
    description: 'Energía, fuerza y recuperación para tus entrenamientos.',
    icon: icon('rendimiento-deportivo'),
    products: ['creatina', 'colartrim', 'fit-sculptor', 'gel-sculptor'],
  },
  {
    slug: 'higado',
    name: 'Hígado',
    description: 'Cardo mariano, colina y coenzima Q10 para cuidar tu hígado.',
    icon: icon('higado'),
    products: ['hepapharm', 'detox-fiber'],
  },
  {
    slug: 'respiracion',
    name: 'Respiración',
    description: 'Propóleo y vitamina C para las vías respiratorias.',
    icon: icon('respiracion'),
    products: ['propoleo', 'defensevit'],
  },
]

export function findNeed(slug: string): Need | null {
  return needs.find((need) => need.slug === slug) ?? null
}
