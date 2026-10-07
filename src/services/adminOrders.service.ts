import APIBase from './httpBase'
import type { AdminStats, Order, OrderStatus, Paginated, PaymentMethod } from '@/types'

export interface OrderListQuery {
  q?: string
  status?: OrderStatus | ''
  paymentMethod?: PaymentMethod | ''
  page?: number
  limit?: number
}

export interface OrderPatch {
  status?: OrderStatus
  trackingUrl?: string
  adminNotes?: string
}

class AdminOrdersService extends APIBase {
  async stats(): Promise<AdminStats> {
    const { data } = await this.get<AdminStats>('admin/stats')
    return data
  }

  async list(query: OrderListQuery = {}): Promise<Paginated<Order>> {
    const params = new URLSearchParams()
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== '') params.set(key, String(value))
    })
    const { data } = await this.get<Paginated<Order>>(`admin/orders?${params}`)
    return data
  }

  async getOne(id: string): Promise<Order> {
    const { data } = await this.get<Order>(`admin/orders/${id}`)
    return data
  }

  async update(id: string, patch: OrderPatch): Promise<Order> {
    const { data } = await this.patch<Order>(`admin/orders/${id}`, patch)
    return data
  }
}

export const adminOrdersService = new AdminOrdersService()
