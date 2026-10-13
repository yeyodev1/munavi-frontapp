/** Forma con la que httpBase rechaza cualquier error del API. */
export interface ApiError {
  status: number
  message: string
  data?: unknown
}

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pages: number
}

/** Lo que devuelve el backapp en /auth/login y /auth/me. */
export interface SessionUser {
  id: string
  email: string
  name: string
  phone: string
  accountType: 'customer' | 'admin' | string
}

// ─── Tienda (contrato con el backapp) ───────────────────────────────
// Todos los montos son enteros en centavos.

export type PaymentMethod = 'card' | 'transfer' | 'cash_on_delivery'

export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'awaiting_transfer'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'canceled'
  | 'payment_failed'

export interface ImageRef {
  url: string
  publicId: string
}

export interface Category {
  _id: string
  name: string
  slug: string
  description: string
  image: ImageRef | null
  order: number
  isActive: boolean
}

export interface Prices {
  card: number
  transfer: number
  cashOnDelivery: number
}

export interface VolumeDiscount {
  minQty: number
  percent: number
}

export interface Variant {
  name: string
  slug: string
  image: ImageRef | null
  stock: number | null
  isActive: boolean
  inStock?: boolean
}

export interface Product {
  _id: string
  name: string
  slug: string
  category: { _id?: string; name: string; slug: string } | string
  shortDescription: string
  description: string
  presentation: string
  usage: string
  ingredients: string
  nutritionInfo: string
  warnings: string
  benefits: string[]
  images: ImageRef[]
  variants: Variant[]
  prices: Prices
  compareAtPrice: number | null
  volumeDiscounts: VolumeDiscount[]
  isFeatured: boolean
  isBestSeller: boolean
  /** Sale en "Novedades del mes" del inicio. */
  isNewArrival: boolean
  /** Cuenta para "Compra más, ahorra más". */
  inVolumePromo: boolean
  isPublished: boolean
  order: number
  createdAt?: string
  updatedAt?: string
}

export interface ProductCard {
  _id: string
  name: string
  slug: string
  shortDescription: string
  presentation: string
  category: { name: string; slug: string }
  image: string
  variants: Array<Pick<Variant, 'name' | 'slug' | 'image' | 'isActive'> & { inStock: boolean }>
  prices: Prices
  compareAtPrice: number | null
  volumeDiscounts: VolumeDiscount[]
  isFeatured: boolean
  isBestSeller: boolean
  isNewArrival: boolean
  inVolumePromo: boolean
}

export interface HeroSlide {
  title: string
  subtitle: string
  image: ImageRef | null
  mobileImage?: ImageRef | null
  ctaLabel: string
  ctaTo: string
}

/** "Compra más, ahorra más": niveles por unidades de todo el pedido, combinando productos. */
export interface VolumePromo {
  isActive: boolean
  tiers: VolumeDiscount[]
}

export interface CommunityPhoto {
  image: ImageRef | null
  link: string
}

export interface PublicSettings {
  shipping: { flatRate: number; freeShippingThreshold: number | null; note: string }
  whatsapp: string
  instagram: string
  facebook: string
  tiktok: string
  announcement: string
  bankTransferInfo: string
  heroSlides: HeroSlide[]
  volumePromo: VolumePromo
  communityPhotos: CommunityPhoto[]
}

export interface AdminSettings extends PublicSettings {
  subscribeCouponCode: string
  notifyEmail: string
}

export interface CartLine {
  productId: string
  variantSlug: string
  quantity: number
}

export interface QuoteItem {
  productId: string
  productName: string
  variantSlug: string
  variantName: string
  image: string
  quantity: number
  unitPrice: number
  lineSubtotal: number
  volumeDiscountPercent: number
  lineDiscount: number
  lineTotal: number
}

export interface VolumePromoStatus {
  isActive: boolean
  /** Unidades del pedido que cuentan para la promo. */
  units: number
  /** Porcentaje alcanzado (0 si aún no llega al primer nivel). */
  percent: number
  /** Siguiente nivel y unidades que faltan; null si ya está en el más alto o la promo está apagada. */
  next: { minQty: number; percent: number; unitsMissing: number } | null
}

export interface Quote {
  items: QuoteItem[]
  volumePromo: VolumePromoStatus
  subtotal: number
  volumeDiscount: number
  couponDiscount: number
  coupon: { code: string; percent: number } | null
  shipping: number
  total: number
  freeShippingThreshold: number | null
  amountToFreeShipping: number | null
}

export interface Customer {
  name: string
  email: string
  phone: string
  documentId: string
}

export interface ShippingAddress {
  province: string
  city: string
  address: string
  reference: string
}

export interface OrderItem extends Omit<QuoteItem, 'productId'> {
  product: string
}

export interface Order {
  _id: string
  orderNumber: string
  customer: Customer
  shippingAddress: ShippingAddress
  items: OrderItem[]
  paymentMethod: PaymentMethod
  couponCode: string | null
  subtotal: number
  volumeDiscount: number
  couponDiscount: number
  shipping: number
  total: number
  status: OrderStatus
  clientTransactionId: string
  payphone?: {
    transactionId: number | null
    statusCode: number | null
    authorizationCode: string | null
    response?: unknown
  }
  trackingUrl: string | null
  adminNotes?: string
  createdAt: string
  updatedAt: string
}

export interface PayphoneBox {
  token: string
  storeId: string
  clientTransactionId: string
  amount: number
  amountWithoutTax: number
  amountWithTax: number
  tax: number
  currency: 'USD'
  reference: string
  email: string
  phoneNumber: string
  documentId: string
}

export interface CreateOrderResponse {
  order: Order
  payphone: PayphoneBox | null
  bankTransferInfo: string | null
}

export interface Coupon {
  _id: string
  code: string
  percent: number
  isActive: boolean
  usageCount: number
  expiresAt: string | null
}

export interface Subscriber {
  _id: string
  email: string
  source: 'home' | 'footer' | 'checkout'
  createdAt: string
}

export interface AdminStats {
  ordersToday: number
  revenueMonth: number
  pendingTransfers: number
  toShip: number
  productsPublished: number
}
