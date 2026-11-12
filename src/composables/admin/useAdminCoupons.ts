import { ref } from 'vue'
import { adminCouponsService, type CouponInput } from '@/services/adminCoupons.service'
import { adminSettingsService } from '@/services/adminSettings.service'
import { useToastStore } from '@/stores/toast'
import type { ApiError, Coupon } from '@/types'

function emptyDraft(): CouponInput {
  return {
    code: '',
    percent: 10,
    isActive: true,
    expiresAt: null,
    firstPurchaseOnly: false,
    regularPriceOnly: false,
    minSubtotal: null,
  }
}

export function useAdminCoupons() {
  const toast = useToastStore()
  const items = ref<Coupon[]>([])
  const subscribeCode = ref('')
  const draft = ref<CouponInput>(emptyDraft())
  /** Cupón que se está editando; null = el formulario crea uno nuevo. */
  const editing = ref<Coupon | null>(null)
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

  function startEdit(coupon: Coupon) {
    const { code, percent, isActive, expiresAt, firstPurchaseOnly, regularPriceOnly, minSubtotal } =
      coupon
    editing.value = coupon
    draft.value = {
      code,
      percent,
      isActive,
      // El input date pide "AAAA-MM-DD" del día de vencimiento en Ecuador.
      expiresAt: expiresAt
        ? new Date(expiresAt).toLocaleDateString('en-CA', { timeZone: 'America/Guayaquil' })
        : null,
      firstPurchaseOnly,
      regularPriceOnly,
      minSubtotal,
    }
  }

  function cancelEdit() {
    editing.value = null
    draft.value = emptyDraft()
  }

  async function submit() {
    busy.value = true
    try {
      const { code, percent, isActive, expiresAt, ...restrictions } = draft.value
      // La fecha del input es "AAAA-MM-DD": vence al final de ese día en Ecuador.
      const input = {
        ...restrictions,
        code: code.trim().toUpperCase(),
        percent: Number(percent),
        expiresAt: expiresAt ? `${expiresAt}T23:59:59-05:00` : null,
      }
      // Al editar no se manda isActive: lo maneja el switch de la lista.
      if (editing.value) await adminCouponsService.update(editing.value._id, input)
      else await adminCouponsService.create({ ...input, isActive })
      toast.success(editing.value ? 'Cupón actualizado' : 'Cupón creado')
      cancelEdit()
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
      if (editing.value?._id === coupon._id) cancelEdit()
    } catch (e) {
      toast.error((e as ApiError).message)
    }
  }

  function isExpired(coupon: Coupon): boolean {
    return Boolean(coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now())
  }

  load()

  return {
    items,
    subscribeCode,
    draft,
    editing,
    loading,
    busy,
    submit,
    startEdit,
    cancelEdit,
    toggle,
    remove,
    isExpired,
  }
}
