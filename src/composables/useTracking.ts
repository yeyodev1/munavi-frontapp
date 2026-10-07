/**
 * Meta Pixel y GA4. Con VITE_META_PIXEL_ID / VITE_GA_ID vacíos no se carga
 * ningún script y cada función es un no-op: en desarrollo no se ensucian datos.
 * Los montos llegan en centavos y se envían en dólares.
 */

type Fbq = ((...args: unknown[]) => void) & { queue?: unknown[]; loaded?: boolean; version?: string; callMethod?: (...a: unknown[]) => void; push?: unknown }
type Gtag = (...args: unknown[]) => void

declare global {
  interface Window {
    fbq?: Fbq
    _fbq?: Fbq
    dataLayer?: unknown[]
    gtag?: Gtag
  }
}

export interface TrackItem {
  id: string
  name: string
  variant?: string
  /** centavos por unidad */
  price: number
  quantity: number
}

const pixelId = (import.meta.env.VITE_META_PIXEL_ID as string) || ''
const gaId = (import.meta.env.VITE_GA_ID as string) || ''
let started = false

function injectScript(src: string) {
  const script = document.createElement('script')
  script.async = true
  script.src = src
  document.head.appendChild(script)
}

function init() {
  if (started || typeof window === 'undefined') return
  started = true

  if (pixelId) {
    // Stub oficial: encola llamadas hasta que fbevents.js termina de cargar.
    const fbq: Fbq = function (...args: unknown[]) {
      if (fbq.callMethod) fbq.callMethod(...args)
      else fbq.queue!.push(args)
    } as Fbq
    fbq.queue = []
    fbq.loaded = true
    fbq.version = '2.0'
    fbq.push = fbq
    window.fbq = fbq
    window._fbq = fbq
    injectScript('https://connect.facebook.net/en_US/fbevents.js')
    window.fbq('init', pixelId)
  }

  if (gaId) {
    window.dataLayer = window.dataLayer || []
    window.gtag = function gtag() {
      // gtag exige el objeto arguments, no un array
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments)
    }
    injectScript(`https://www.googletagmanager.com/gtag/js?id=${gaId}`)
    window.gtag('js', new Date())
    // Las vistas de página las mandamos a mano en cada cambio de ruta.
    window.gtag('config', gaId, { send_page_view: false })
  }
}

const dollars = (cents: number) => Math.round(cents) / 100
const valueOf = (items: TrackItem[]) => dollars(items.reduce((s, i) => s + i.price * i.quantity, 0))

function fb(event: string, data?: Record<string, unknown>) {
  if (pixelId && window.fbq) window.fbq('track', event, data)
}

function ga(event: string, data?: Record<string, unknown>) {
  if (gaId && window.gtag) window.gtag('event', event, data)
}

function gaItems(items: TrackItem[]) {
  return items.map((i) => ({
    item_id: i.id,
    item_name: i.name,
    item_variant: i.variant,
    price: dollars(i.price),
    quantity: i.quantity,
  }))
}

function fbPayload(items: TrackItem[], value: number) {
  return {
    content_ids: items.map((i) => i.id),
    content_type: 'product',
    contents: items.map((i) => ({ id: i.id, quantity: i.quantity })),
    num_items: items.reduce((s, i) => s + i.quantity, 0),
    value,
    currency: 'USD',
  }
}

export function trackPageView(path = window.location.pathname) {
  init()
  fb('PageView')
  ga('page_view', { page_path: path, page_location: window.location.href, page_title: document.title })
}

export function trackViewContent(item: TrackItem) {
  init()
  const value = dollars(item.price)
  fb('ViewContent', { ...fbPayload([item], value), content_name: item.name })
  ga('view_item', { currency: 'USD', value, items: gaItems([item]) })
}

export function trackAddToCart(item: TrackItem) {
  init()
  const value = valueOf([item])
  fb('AddToCart', { ...fbPayload([item], value), content_name: item.name })
  ga('add_to_cart', { currency: 'USD', value, items: gaItems([item]) })
}

/** `total` en centavos; si no viene se calcula con los ítems. */
export function trackInitiateCheckout(items: TrackItem[], total?: number) {
  init()
  const value = total != null ? dollars(total) : valueOf(items)
  fb('InitiateCheckout', fbPayload(items, value))
  ga('begin_checkout', { currency: 'USD', value, items: gaItems(items) })
}

/** `total` en centavos. Llamar una sola vez por pedido (el que llama controla la idempotencia). */
export function trackPurchase(orderNumber: string, total: number, items: TrackItem[]) {
  init()
  const value = dollars(total)
  fb('Purchase', fbPayload(items, value))
  ga('purchase', { transaction_id: orderNumber, currency: 'USD', value, items: gaItems(items) })
}

export function useTracking() {
  return { trackPageView, trackViewContent, trackAddToCart, trackInitiateCheckout, trackPurchase }
}
