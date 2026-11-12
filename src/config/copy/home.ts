// Textos del home. Lo que Nathalie edita (banners, anuncio) llega por settings.
export const homeCopy = {
  hero: {
    // Firma de marca en script de pincel, como en la web anterior.
    title: 'Te quiero vida',
    text: 'Somos especializados en desarrollo y producción de suplementos alimenticios enfocados en la línea de belleza, nutrición y salud.',
    primary: 'Compra ahora',
    secondary: 'Asesoría por WhatsApp',
    prev: 'Banner anterior',
    next: 'Banner siguiente',
    goTo: 'Ir al banner',
    showcaseLabel: 'Productos destacados',
  },
  somos: {
    script: 'Somos',
    name: 'Munavi',
    text: 'En Munavi desarrollamos y producimos suplementos alimenticios en Ecuador, con materias primas importadas y sabores que da gusto tomar todos los días. Buscamos lo que exactamente necesitas para cuidarte y disfrutar la vida.',
    cta: 'Conócenos más',
    to: '/nosotros',
  },
  categories: {
    eyebrow: 'Categorías',
    title: 'Encuentra lo que tu cuerpo pide',
    all: 'Ver todo',
    empty: 'Muy pronto verás aquí nuestras categorías.',
  },
  featured: {
    eyebrow: 'Destacados',
    title: 'Los favoritos de la casa',
    link: 'Ver toda la tienda',
  },
  emptyProducts: {
    title: 'Estamos preparando el catálogo',
    text: 'Muy pronto encontrarás aquí nuestros colágenos, vitaminas y más. Mientras tanto, escríbenos y te asesoramos.',
    cta: 'Preguntar por WhatsApp',
  },
  // Banner de la diseñadora + los packs de cada producto. Solo aparece si hay
  // productos con packs cargados: no se promete un descuento que el checkout no aplica.
  volumePromo: {
    bannerAlt: 'Compra más, ahorra más: más unidades de tu favorito, mejor precio. Ver descuentos',
    title: 'Elige tu producto y ahorra por cantidad',
    text: 'Lleva de 2 a 6 unidades del mismo producto (puedes combinar sabores). IVA incluido y envío gratis.',
    perUnit: 'Por unidad:',
    taking: (n: number) => `Llevando ${n} unidades`,
    see: 'Ver precios',
  },
  // Solo hechos confirmados por la clienta: nada de certificaciones ni cifras extra.
  // El banner de la diseñadora ya dice trayectoria, elaboración ecuatoriana y
  // notificación sanitaria; las tarjetas suman solo lo que el banner no dice.
  trust: {
    bannerAlt:
      'Confianza en Munavi. Tu bienestar merece confianza: desde 2019 acompañamos tu cuidado diario. Trayectoria desde 2019, elaboración ecuatoriana con materias primas importadas y productos con notificación sanitaria. Conoce nuestra historia',
    to: '/nosotros',
    items: [
      {
        icon: 'fa-solid fa-lock',
        title: 'Pago seguro',
        text: 'Tarjeta de crédito o débito con Payphone, o transferencia bancaria.',
      },
      {
        icon: 'fa-solid fa-truck-fast',
        title: 'Envío gratis a todo Ecuador',
        text: 'Tu pedido llega en hasta 48 horas.',
      },
      {
        icon: 'fa-brands fa-whatsapp',
        title: 'Asesoría personalizada',
        text: 'Te ayudamos a elegir tu suplemento por WhatsApp.',
      },
    ],
  },
  newArrivals: {
    eyebrow: 'Recién llegados',
    title: 'Novedades del mes',
    link: 'Ver toda la tienda',
  },
  flavors: {
    eyebrow: 'Sabores y líneas especiales',
    title: 'Deliciosos sabores para tu rutina diaria',
    text: 'Elige tu sabor favorito y encuentra los productos que lo tienen.',
    // image: ruta en /brand/sabores/<slug>.webp cuando la diseñadora entregue
    // los archivos. Mientras sea null se pinta el círculo de color, sin 404.
    items: [
      { name: 'Vainilla', slug: 'vainilla', color: '#f4e4b8', ink: '#6b5313', image: null },
      { name: 'Chocolate', slug: 'chocolate', color: '#7a4a2f', ink: '#ffffff', image: null },
      { name: 'Frutos rojos', slug: 'frutos-rojos', color: '#b4324b', ink: '#ffffff', image: null },
      { name: 'Guanábana', slug: 'guanabana', color: '#d6e8bf', ink: '#3d5a1f', image: null },
      { name: 'Fresa', slug: 'fresa', color: '#f6c2c9', ink: '#a32a3d', image: null },
      { name: 'Piña', slug: 'pina', color: '#fbd76a', ink: '#6e5200', image: null },
      { name: 'Coco', slug: 'coco', color: '#efe8dc', ink: '#5e4b35', image: null },
      { name: 'Blueberry', slug: 'blueberry', color: '#4c5199', ink: '#ffffff', image: null },
    ] as { name: string; slug: string; color: string; ink: string; image: string | null }[],
    linesTitle: 'Líneas especiales',
    // La tienda filtra por categoría en la ruta: /tienda/<slug>.
    lines: [
      {
        name: 'Niños',
        slug: 'ninos',
        icon: 'fa-solid fa-children',
        text: 'Nutrición pensada para los peques.',
      },
      {
        name: 'Deporte',
        slug: 'deporte',
        icon: 'fa-solid fa-dumbbell',
        text: 'Para acompañar tus entrenamientos.',
      },
      {
        name: 'Salud hormonal',
        slug: 'salud-hormonal',
        icon: 'fa-solid fa-spa',
        text: 'Bienestar en cada etapa de tu vida.',
      },
    ],
  },
  community: {
    eyebrow: 'Somos familia',
    title: 'Comunidad Munavi',
    text: 'Así se cuidan quienes ya forman parte de la familia Munavi.',
    follow: 'Síguenos y entérate primero de lanzamientos, sabores nuevos y promociones.',
    photoAlt: 'Foto de la comunidad Munavi',
    social: [
      { key: 'instagram', label: 'Instagram', icon: 'fa-brands fa-instagram' },
      { key: 'facebook', label: 'Facebook', icon: 'fa-brands fa-facebook-f' },
      { key: 'tiktok', label: 'TikTok', icon: 'fa-brands fa-tiktok' },
    ] as { key: 'instagram' | 'facebook' | 'tiktok'; label: string; icon: string }[],
  },
  // Banner del cupón del inicio (reemplaza la suscripción, pedido del 11 nov 2026).
  // Código, % y mínimo salen del cupón configurado en el panel.
  promoCoupon: {
    eyebrow: 'Beneficio especial',
    brand: 'Munavi',
    title: (percent: number) => `${percent}% de descuento en tu compra`,
    text: 'Usa el código y obtén tu descuento en productos a precio regular.',
    textAny: 'Usa el código y obtén tu descuento en tu compra.',
    codeLabel: 'Código:',
    copy: 'Copiar código',
    copied: 'Código copiado',
    copiedToast: (code: string) => `Copiaste ${code}. Pégalo en el checkout.`,
    min: (amount: string) => `En compras desde ${amount}`,
    regular: 'Válido en productos a precio regular',
    combine: 'Puedes combinar diferentes productos',
    noStack: 'No acumulable con promociones por cantidad ni otros descuentos',
  },
  help: {
    title: '¿No sabes cuál elegir?',
    text: 'Cuéntanos qué buscas y te recomendamos el suplemento ideal para ti o tu familia.',
    cta: 'Hablar por WhatsApp',
    message: 'Hola Munavi, quiero que me recomienden un producto',
  },
} as const

export const subscribeCopy = {
  placeholder: 'tu@correo.com',
  label: 'Tu correo electrónico',
  submit: 'Quiero mi 20%',
  loading: 'Enviando…',
  successTitle: 'Tu cupón está listo',
  successText: 'Escríbelo al finalizar tu compra y el descuento se aplica al instante.',
  copy: 'Copiar',
  off: 'de descuento',
  shop: 'Ir a la tienda',
} as const
