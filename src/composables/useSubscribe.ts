import { ref } from 'vue'
import type { ApiError, Subscriber } from '@/types'
import { subscriberService } from '@/services/subscriber.service'
import { useToastStore } from '@/stores/toast'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Estado del formulario de suscripción; el cupón se muestra al terminar. */
export function useSubscribe(source: Subscriber['source']) {
  const email = ref('')
  const loading = ref(false)
  const error = ref('')
  const coupon = ref<{ code: string; percent: number } | null>(null)
  const toast = useToastStore()

  async function submit() {
    error.value = ''
    const value = email.value.trim().toLowerCase()
    if (!EMAIL_RE.test(value)) {
      error.value = 'Escribe un correo válido'
      return
    }
    loading.value = true
    try {
      const data = await subscriberService.subscribe(value, source)
      coupon.value = { code: data.couponCode, percent: data.percent }
      toast.success(data.message || 'Listo, ya eres parte de Munavi')
    } catch (err) {
      error.value = (err as ApiError).message
    } finally {
      loading.value = false
    }
  }

  async function copyCode() {
    if (!coupon.value) return
    try {
      await navigator.clipboard.writeText(coupon.value.code)
      toast.success('Cupón copiado')
    } catch {
      toast.info(`Tu cupón: ${coupon.value.code}`)
    }
  }

  return { email, loading, error, coupon, submit, copyCode }
}
