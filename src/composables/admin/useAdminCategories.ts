import { ref } from 'vue'
import {
  adminCategoriesService,
  type AdminCategory,
  type CategoryInput,
} from '@/services/adminCategories.service'
import { useToastStore } from '@/stores/toast'
import type { ApiError } from '@/types'

export function useAdminCategories() {
  const toast = useToastStore()
  const items = ref<AdminCategory[]>([])
  const loading = ref(false)
  const busyId = ref('')

  async function load() {
    loading.value = true
    try {
      items.value = await adminCategoriesService.list()
    } catch (e) {
      toast.error((e as ApiError).message)
    } finally {
      loading.value = false
    }
  }

  async function create(name: string): Promise<boolean> {
    if (!name.trim()) {
      toast.error('Escribe el nombre de la categoría')
      return false
    }
    busyId.value = 'new'
    try {
      // Las nuevas van al final: así no desordenan lo que ya está acomodado.
      const order = items.value.reduce((max, c) => Math.max(max, c.order), 0) + 1
      await adminCategoriesService.create({
        name: name.trim(),
        description: '',
        image: null,
        order,
        isActive: true,
      })
      toast.success('Categoría creada')
      await load()
      return true
    } catch (e) {
      toast.error((e as ApiError).message)
      return false
    } finally {
      busyId.value = ''
    }
  }

  async function save(id: string, input: Partial<CategoryInput>): Promise<boolean> {
    busyId.value = id
    try {
      await adminCategoriesService.update(id, input)
      toast.success('Categoría guardada')
      await load()
      return true
    } catch (e) {
      toast.error((e as ApiError).message)
      return false
    } finally {
      busyId.value = ''
    }
  }

  async function remove(category: AdminCategory) {
    busyId.value = category._id
    try {
      await adminCategoriesService.remove(category._id)
      toast.success('Categoría eliminada')
      await load()
    } catch (e) {
      const error = e as ApiError
      toast.error(
        error.status === 409
          ? 'Esta categoría tiene productos. Muévelos a otra categoría o elimínalos primero; si solo quieres ocultarla, apaga "Visible".'
          : error.message,
      )
    } finally {
      busyId.value = ''
    }
  }

  load()

  return { items, loading, busyId, create, save, remove }
}
