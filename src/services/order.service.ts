import APIBase from './httpBase'
import type { CartLine, CreateOrderResponse, Customer, Order, PaymentMethod, PayphoneBox, Quote, ShippingAddress } from '@/types'

export interface QuoteInput {
  items: CartLine[]
  paymentMethod: PaymentMethod
  couponCode?: string
}

export interface CreateOrderInput extends QuoteInput {
  customer: Customer
  shippingAddress: ShippingAddress
}

export interface RetryResponse {
  order: Order
  payphone: PayphoneBox
}

// Las rutas de pedidos son públicas: no se manda el token del admin aunque exista.
const publicHeaders = { 'Content-Type': 'application/json' }

class OrderService extends APIBase {
  async quote(input: QuoteInput): Promise<Quote> {
    const { data } = await this.post<Quote>('orders/quote', input, publicHeaders)
    return data
  }

  async create(input: CreateOrderInput): Promise<CreateOrderResponse> {
    const { data } = await this.post<CreateOrderResponse>('orders', input, publicHeaders)
    return data
  }

  async confirm(id: number, clientTransactionId: string): Promise<{ order: Order }> {
    const { data } = await this.post<{ order: Order }>('orders/confirm', { id, clientTransactionId }, publicHeaders, {
      // Payphone puede tardar en contestar al backend.
      timeout: 30000,
    })
    return data
  }

  async lookup(orderNumber: string, email: string): Promise<Order> {
    const { data } = await this.get<Order>('orders/lookup', publicHeaders, { params: { orderNumber, email } })
    return data
  }

  async retry(orderNumber: string, email: string): Promise<RetryResponse> {
    const { data } = await this.post<RetryResponse>(
      `orders/${encodeURIComponent(orderNumber)}/retry`,
      { email },
      publicHeaders,
    )
    return data
  }
}

export const orderService = new OrderService()
