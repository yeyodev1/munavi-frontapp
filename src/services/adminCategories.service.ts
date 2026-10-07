import APIBase from './httpBase'
import type { Category } from '@/types'

/** El listado de administración trae cuántos productos cuelgan de cada categoría. */
export type AdminCategory = Category & { productCount: number }

export type CategoryInput = Pick<
  Category,
  'name' | 'description' | 'image' | 'order' | 'isActive'
> & {
  slug?: string
}

class AdminCategoriesService extends APIBase {
  async list(): Promise<AdminCategory[]> {
    const { data } = await this.get<AdminCategory[]>('admin/categories')
    return data
  }

  async create(input: CategoryInput): Promise<Category> {
    const { data } = await this.post<Category>('admin/categories', input)
    return data
  }

  async update(id: string, input: Partial<CategoryInput>): Promise<Category> {
    const { data } = await this.put<Category>(`admin/categories/${id}`, input)
    return data
  }

  async remove(id: string): Promise<void> {
    await this.delete(`admin/categories/${id}`)
  }
}

export const adminCategoriesService = new AdminCategoriesService()
