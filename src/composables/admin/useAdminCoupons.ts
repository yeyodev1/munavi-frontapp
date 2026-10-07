import { ref } from 'vue'
import { adminCouponsService, type CouponInput } from '@/services/adminCoupons.service'
import { adminSettingsService } from '@/services/adminSettings.service'
import { useToastStore } from '@/stores/toast'
import type { ApiError, Coupon } from '@/types'

function emptyDraft(): CouponInput {
  return { code: '', percent: 10, isActive: true, expiresAt: null }
}

export function useAdminCoupons() {
  const toast = useToastStore()
  const items = ref<Coupon[]>([])
  const subscribeCode = ref('')
  const draft = ref<CouponInput>(emptyDraft())
  const loading = ref(false)
  const busy = ref(false)

  async function load() {
    loading.value = true
    try {
      const [coupons, settings] = await Promise.all([
        adminCouponsService.list(),
        adminSettingsService.load().catch(() => null),
      ])
      items.value = coupons
      subscribeCode.value = settings?.subscribeCouponCode ?? ''
    } catch (e) {
      toast.error((e as ApiError).message)
    } finally {
      loading.value = false
    }
  }

  async function create() {
    busy.value = true
    try {
      const { code, percent, isActive, expiresAt } = draft.value
      // La fecha del input es "AAAA-MM-DD": vence al final de ese día en Ecuador.
      await adminCouponsService.create({
        code: code.trim().toUpperCase(),
        percent: Number(percent),
        isActive,
        expiresAt: expiresAt ? `${expiresAt}T23:59:59-05:00` : null,
      })
      toast.success('Cupón creado')
      draft.value = emptyDraft()
      await load()
    } catch (e) {
      toast.error((e as ApiError).message)
    } finally {
      busy.value = false
    }
  }

  async function toggle(coupon: Coupon) {
    const next = !coupon.isActive
    coupon.isActive = next
    try {
      await adminCouponsService.update(coupon._id, { isActive: next })
      toast.success(next ? 'Cupón activado' : 'Cupón pausado')
    } catch (e) {
      coupon.isActive = !next
      toast.error((e as ApiError).message)
    }
  }

  async function remove(coupon: Coupon) {
    try {
      await adminCouponsService.remove(coupon._id)
      toast.success('Cupón eliminado')
      items.value = items.value.filter((c) => c._id !== coupon._id)
    } catch (e) {
      toast.error((e as ApiError).message)
    }
  }

  function isExpired(coupon: Coupon): boolean {
    return Boolean(coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now())
  }

  load()

  return { items, subscribeCode, draft, loading, busy, create, toggle, remove, isExpired }
}
