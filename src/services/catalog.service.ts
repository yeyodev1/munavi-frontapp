import APIBase from './httpBase'
import type { Category, Paginated, Product, ProductCard } from '@/types'

export interface ProductQuery {
  category?: string
  featured?: boolean
  bestSeller?: boolean
  q?: string
  page?: number
  limit?: number
}

class CatalogService extends APIBase {
  async getCategories(): Promise<Category[]> {
    const { data } = await this.get<Category[]>('catalog/categories')
    return data
  }

  async getProducts(query: ProductQuery = {}): Promise<Paginated<ProductCard>> {
    const params: Record<string, string | number> = {}
    if (query.category) params.category = query.category
    if (query.featured) params.featured = 1
    if (query.bestSeller) params.bestSeller = 1
    if (query.q) params.q = query.q
    if (query.page) params.page = query.page
    if (query.limit) params.limit = query.limit

    const { data } = await this.get<Paginated<ProductCard>>('catalog/products', undefined, { params })
    return data
  }

  async getProduct(slug: string): Promise<Product> {
    const { data } = await this.get<Product>(`catalog/products/${encodeURIComponent(slug)}`)
    return data
  }
}

export const catalogService = new CatalogService()
