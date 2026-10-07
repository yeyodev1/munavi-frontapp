import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { adminOrdersService } from '@/services/adminOrders.service'
import { useToastStore } from '@/stores/toast'
import type { ApiError, Order, OrderStatus, PaymentMethod } from '@/types'

function queryString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

export function useAdminOrders() {
  const route = useRoute()
  const router = useRouter()
  const toast = useToastStore()

  // Los filtros viven en la URL: el panel puede enlazar a "transferencias pendientes"
  // y "atrás" desde un pedido vuelve a la misma lista.
  const q = ref(queryString(route.query.q))
  const status = ref(queryString(route.query.status) as OrderStatus | '')
  const paymentMethod = ref(queryString(route.query.paymentMethod) as PaymentMethod | '')
  const page = ref(Number(route.query.page) || 1)

  const items = ref<Order[]>([])
  const pages = ref(1)
  const total = ref(0)
  const loading = ref(false)

  async function load() {
    loading.value = true
    router.replace({
      query: {
        ...(q.value ? { q: q.value } : {}),
        ...(status.value ? { status: status.value } : {}),
        ...(paymentMethod.value ? { paymentMethod: paymentMethod.value } : {}),
        ...(page.value > 1 ? { page: String(page.value) } : {}),
      },
    })
    try {
      const data = await adminOrdersService.list({
        q: q.value.trim(),
        status: status.value,
        paymentMethod: paymentMethod.value,
        page: page.value,
        limit: 25,
      })
      items.value = data.items
      pages.value = data.pages
      total.value = data.total
    } catch (e) {
      toast.error((e as ApiError).message)
    } finally {
      loading.value = false
    }
  }

  function resetPageAndLoad() {
    if (page.value !== 1) page.value = 1
    else load()
  }

  let timer: ReturnType<typeof setTimeout> | undefined
  watch(q, () => {
    clearTimeout(timer)
    timer = setTimeout(resetPageAndLoad, 350)
  })
  watch([status, paymentMethod], resetPageAndLoad)
  watch(page, load)

  load()

  return { items, q, status, paymentMethod, page, pages, total, loading }
}
