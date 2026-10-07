/**
 * El copy es configuración: todos los textos y datos de la marca viven acá.
 * Los componentes solo consumen y pintan. Lo que Nathalie edita desde el panel
 * (WhatsApp, redes, envío, banners) llega por /settings/public y pisa estos valores.
 */
export const site = {
  name: 'Munavi',
  tagline: 'Te quiero vida',
  description:
    'Suplementos Munavi: colágenos, vitaminas y bienestar para toda la familia. Hechos en Ecuador con materias primas importadas. Envíos a todo el país.',
  url: 'https://munavi.ec',
  email: 'hola@munavi.ec',
  // Solo dígitos con código de país. Provisional: confirmar con Nathalie el número de ventas.
  whatsapp: '593992658166',
  social: {
    instagram: '',
    facebook: '',
    tiktok: '',
  },
  nav: [
    { label: 'Tienda', to: '/tienda' },
    { label: 'Colágenos', to: '/tienda/colagenos' },
    { label: 'Nosotros', to: '/nosotros' },
    { label: 'Mi pedido', to: '/mi-pedido' },
  ],
  brand: {
    concept: 'Te quiero vida',
    promise: 'Disfrutar la vida, amar la vida, cuidarte con alegría.',
    origin: 'Hecho en Ecuador con materias primas importadas',
    years: 7,
    pillars: [
      {
        icon: 'fa-solid fa-flask',
        title: 'Materia prima importada',
        text: 'Seleccionamos ingredientes de origen internacional y los formulamos en Ecuador.',
      },
      {
        icon: 'fa-solid fa-heart',
        title: 'Sabores que se disfrutan',
        text: 'Colágenos, creatinas y calostro en sabores pensados para tomarlos todos los días.',
      },
      {
        icon: 'fa-solid fa-truck-fast',
        title: 'Envíos a todo Ecuador',
        text: 'Compra en línea y recibe en la puerta de tu casa.',
      },
    ],
  },
  paymentMethods: {
    card: {
      label: 'Tarjeta de crédito o débito',
      hint: 'El mejor precio. Pago seguro con Payphone y confirmación inmediata.',
      icon: 'fa-solid fa-credit-card',
    },
    transfer: {
      label: 'Transferencia bancaria',
      hint: 'Tu pedido se despacha cuando validamos el comprobante.',
      icon: 'fa-solid fa-building-columns',
    },
    cash_on_delivery: {
      label: 'Pago contra entrega',
      hint: 'Pagas al recibir. Disponible según la cobertura de envío.',
      icon: 'fa-solid fa-hand-holding-dollar',
    },
  },
  orderStatus: {
    pending_payment: 'Pago pendiente',
    paid: 'Pagado',
    awaiting_transfer: 'Esperando transferencia',
    confirmed: 'Confirmado',
    shipped: 'Enviado',
    delivered: 'Entregado',
    canceled: 'Cancelado',
    payment_failed: 'Pago rechazado',
  },
  provinces: [
    'Azuay', 'Bolívar', 'Cañar', 'Carchi', 'Chimborazo', 'Cotopaxi', 'El Oro', 'Esmeraldas',
    'Galápagos', 'Guayas', 'Imbabura', 'Loja', 'Los Ríos', 'Manabí', 'Morona Santiago', 'Napo',
    'Orellana', 'Pastaza', 'Pichincha', 'Santa Elena', 'Santo Domingo de los Tsáchilas',
    'Sucumbíos', 'Tungurahua', 'Zamora Chinchipe',
  ],
} as const

export function whatsappLink(message = 'Hola Munavi, quiero más información', phone: string = site.whatsapp): string {
  if (!phone) return '#'
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}
