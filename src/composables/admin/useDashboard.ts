import { ref } from 'vue'
import { adminOrdersService } from '@/services/adminOrders.service'
import { useToastStore } from '@/stores/toast'
import type { AdminStats, ApiError, Order } from '@/types'

export function useDashboard() {
  const toast = useToastStore()
  const stats = ref<AdminStats | null>(null)
  const recent = ref<Order[]>([])
  const loading = ref(true)

  async function load() {
    loading.value = true
    try {
      const [s, orders] = await Promise.all([
        adminOrdersService.stats(),
        adminOrdersService.list({ limit: 6 }),
      ])
      stats.value = s
      recent.value = orders.items
    } catch (e) {
      toast.error((e as ApiError).message)
    } finally {
      loading.value = false
    }
  }

  load()

  return { stats, recent, loading, reload: load }
}
