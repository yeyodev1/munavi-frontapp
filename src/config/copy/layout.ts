// Textos del header, footer y botón flotante de WhatsApp.
export const layoutCopy = {
  header: {
    searchPlaceholder: 'Busca colágeno, vitaminas, creatina…',
    searchLabel: 'Buscar productos',
    openSearch: 'Abrir buscador',
    closeSearch: 'Cerrar buscador',
    cart: 'Abrir carrito',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    menuHelp: '¿Necesitas ayuda para elegir?',
    menuWhatsapp: 'Escríbenos por WhatsApp',
  },
  footer: {
    subscribeTitle: '20% de descuento en tu primera compra',
    subscribeText: 'Suscríbete y recibe tu cupón al instante. Solo novedades y promociones, nada de spam.',
    categories: 'Categorías',
    help: 'Ayuda',
    payments: 'Pagos seguros',
    paymentsNote: 'Tarjetas procesadas con Payphone.',
    follow: 'Síguenos',
    links: [
      { label: 'Consultar mi pedido', to: '/mi-pedido', icon: 'fa-solid fa-box' },
      { label: 'Nosotros', to: '/nosotros', icon: 'fa-solid fa-heart' },
      { label: 'Toda la tienda', to: '/tienda', icon: 'fa-solid fa-store' },
    ],
    whatsapp: 'Dudas por WhatsApp',
    admin: 'Administración',
    credit: 'Hecho por',
  },
  whatsapp: {
    label: '¿Dudas? Escríbenos',
    aria: 'Escribir a Munavi por WhatsApp',
    message: 'Hola Munavi, tengo una duda sobre sus productos',
  },
} as const
