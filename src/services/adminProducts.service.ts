import APIBase from './httpBase'
import type { Paginated, Product } from '@/types'

export interface ProductListQuery {
  q?: string
  category?: string
  page?: number
  limit?: number
}

/** Lo que se manda al guardar: la categoría va como id, nunca poblada. */
export type ProductInput = Omit<Product, '_id' | 'category' | 'createdAt' | 'updatedAt'> & {
  category: string
}

class AdminProductsService extends APIBase {
  async list(query: ProductListQuery = {}): Promise<Paginated<Product>> {
    const params = new URLSearchParams()
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== '') params.set(key, String(value))
    })
    const { data } = await this.get<Paginated<Product>>(`admin/products?${params}`)
    return data
  }

  async getOne(id: string): Promise<Product> {
    const { data } = await this.get<Product>(`admin/products/${id}`)
    return data
  }

  async create(input: ProductInput): Promise<Product> {
    const { data } = await this.post<Product>('admin/products', input)
    return data
  }

  /** PUT parcial: el backend solo toca los campos que llegan. */
  async update(id: string, input: Partial<ProductInput>): Promise<Product> {
    const { data } = await this.put<Product>(`admin/products/${id}`, input)
    return data
  }

  async remove(id: string): Promise<void> {
    await this.delete(`admin/products/${id}`)
  }
}

export const adminProductsService = new AdminProductsService()
