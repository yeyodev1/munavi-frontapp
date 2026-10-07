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
  bestSellers: {
    eyebrow: 'Más vendidos',
    title: 'Lo que más se llevan',
    link: 'Ver más',
  },
  emptyProducts: {
    title: 'Estamos preparando el catálogo',
    text: 'Muy pronto encontrarás aquí nuestros colágenos, vitaminas y más. Mientras tanto, escríbenos y te asesoramos.',
    cta: 'Preguntar por WhatsApp',
  },
  promos: {
    eyebrow: 'Promociones',
    title: 'Más vida, mejor precio',
    items: [
      {
        icon: 'fa-solid fa-credit-card',
        title: 'El mejor precio con tarjeta',
        text: 'Paga con tarjeta de crédito o débito y obtén el precio más bajo de cada producto.',
        cta: 'Comprar ahora',
        to: '/tienda',
      },
      {
        icon: 'fa-solid fa-layer-group',
        title: 'Lleva más, ahorra más',
        text: 'Descuentos por volumen en productos seleccionados. Mientras más llevas, menos pagas.',
        cta: 'Ver productos',
        to: '/tienda',
      },
      {
        icon: 'fa-solid fa-gift',
        title: '20% en tu primera compra',
        text: 'Suscríbete y recibe al instante un cupón para tu primer pedido.',
        cta: 'Quiero mi cupón',
        to: '/#suscribete',
      },
    ],
    freeShipping: 'Envío gratis desde',
  },
  flavors: {
    eyebrow: 'Variedad de sabores',
    title: 'Cuidarte también sabe rico',
    text: 'Elige tu sabor favorito y conviértelo en tu ritual de cada día.',
    items: [
      { name: 'Colágenos', detail: 'En muchos sabores', tags: ['Fresa', 'Vainilla', 'Frutos rojos', 'Y más'], q: 'colágeno' },
      { name: 'Calostro infantil', detail: '4 sabores para los peques', tags: ['Para niños', '4 sabores'], q: 'calostro' },
      { name: 'Creatina', detail: '3 opciones', tags: ['Sin sabor', 'Blueberry', 'Fruit punch'], q: 'creatina' },
    ],
    cta: 'Ver sabores',
  },
  subscribe: {
    eyebrow: 'Únete a la familia Munavi',
    title: '20% de descuento en tu primera compra',
    text: 'Déjanos tu correo y recibe tu cupón al instante. Te contamos primero de lanzamientos, sabores nuevos y promociones.',
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
