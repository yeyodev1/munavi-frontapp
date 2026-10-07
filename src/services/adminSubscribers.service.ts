import APIBase from './httpBase'
import type { Paginated, Subscriber } from '@/types'

class AdminSubscribersService extends APIBase {
  async list(page = 1, q = ''): Promise<Paginated<Subscriber>> {
    const params = new URLSearchParams({ page: String(page), limit: '50' })
    if (q) params.set('q', q)
    const { data } = await this.get<Paginated<Subscriber>>(`admin/subscribers?${params}`)
    return data
  }

  /** El CSV se pide con el Bearer y llega como blob: un enlace directo no llevaría la sesión. */
  async csv(): Promise<Blob> {
    const { data } = await this.get<Blob>('admin/subscribers?format=csv', undefined, {
      responseType: 'blob',
    })
    return data
  }

  async remove(id: string): Promise<void> {
    await this.delete(`admin/subscribers/${id}`)
  }
}

export const adminSubscribersService = new AdminSubscribersService()
