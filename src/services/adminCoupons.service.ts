import APIBase from './httpBase'
import type { Coupon, Paginated } from '@/types'

export type CouponInput = Pick<Coupon, 'code' | 'percent' | 'isActive' | 'expiresAt'>

class AdminCouponsService extends APIBase {
  async list(): Promise<Coupon[]> {
    // Son pocos: una página grande basta para verlos todos.
    const { data } = await this.get<Paginated<Coupon>>('admin/coupons?limit=200')
    return data.items
  }

  async create(input: CouponInput): Promise<Coupon> {
    const { data } = await this.post<Coupon>('admin/coupons', input)
    return data
  }

  async update(id: string, input: Partial<CouponInput>): Promise<Coupon> {
    const { data } = await this.put<Coupon>(`admin/coupons/${id}`, input)
    return data
  }

  async remove(id: string): Promise<void> {
    await this.delete(`admin/coupons/${id}`)
  }
}

export const adminCouponsService = new AdminCouponsService()
