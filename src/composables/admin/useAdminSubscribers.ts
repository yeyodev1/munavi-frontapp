import { ref, watch } from 'vue'
import { adminSubscribersService } from '@/services/adminSubscribers.service'
import { useToastStore } from '@/stores/toast'
import type { ApiError, Subscriber } from '@/types'

export const sourceLabel: Record<Subscriber['source'], string> = {
  home: 'Inicio',
  footer: 'Pie de página',
  checkout: 'Al comprar',
}

export function useAdminSubscribers() {
  const toast = useToastStore()
  const items = ref<Subscriber[]>([])
  const q = ref('')
  const page = ref(1)
  const pages = ref(1)
  const total = ref(0)
  const loading = ref(false)
  const downloading = ref(false)

  async function load() {
    loading.value = true
    try {
      const data = await adminSubscribersService.list(page.value, q.value.trim())
      items.value = data.items
      pages.value = data.pages
      total.value = data.total
    } catch (e) {
      toast.error((e as ApiError).message)
    } finally {
      loading.value = false
    }
  }

  /** Se baja con la sesión (Bearer) y se guarda desde un blob local. */
  async function downloadCsv() {
    downloading.value = true
    try {
      const blob = await adminSubscribersService.csv()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `suscriptores-munavi-${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(link)
      link.click()
      link.remove()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (e) {
      toast.error((e as ApiError).message || 'No se pudo descargar el archivo')
    } finally {
      downloading.value = false
    }
  }

  async function remove(subscriber: Subscriber) {
    try {
      await adminSubscribersService.remove(subscriber._id)
      toast.success('Suscriptor eliminado')
      await load()
    } catch (e) {
      toast.error((e as ApiError).message)
    }
  }

  let timer: ReturnType<typeof setTimeout> | undefined
  watch(q, () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      if (page.value !== 1) page.value = 1
      else load()
    }, 350)
  })
  watch(page, load)

  load()

  return { items, q, page, pages, total, loading, downloading, downloadCsv, remove }
}
