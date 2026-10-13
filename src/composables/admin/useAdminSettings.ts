import { ref } from 'vue'
import { adminSettingsService } from '@/services/adminSettings.service'
import { useToastStore } from '@/stores/toast'
import type { AdminSettings, ApiError } from '@/types'

function emptySettings(): AdminSettings {
  return {
    shipping: { flatRate: 0, freeShippingThreshold: null, note: '' },
    whatsapp: '',
    instagram: '',
    facebook: '',
    tiktok: '',
    announcement: '',
    bankTransferInfo: '',
    heroSlides: [],
    volumePromo: { isActive: false, tiers: [] },
    communityPhotos: [],
    subscribeCouponCode: '',
    notifyEmail: '',
  }
}

/** Solo lo editable: el documento del API trae _id, key y fechas que no se mandan de vuelta. */
function pick(s: AdminSettings): AdminSettings {
  return {
    shipping: { ...s.shipping },
    whatsapp: s.whatsapp,
    instagram: s.instagram,
    facebook: s.facebook,
    tiktok: s.tiktok,
    announcement: s.announcement,
    bankTransferInfo: s.bankTransferInfo,
    heroSlides: s.heroSlides.map((slide) => ({ ...slide })),
    volumePromo: {
      isActive: Boolean(s.volumePromo?.isActive),
      tiers: (s.volumePromo?.tiers ?? []).map((t) => ({ ...t })),
    },
    communityPhotos: (s.communityPhotos ?? []).map((p) => ({ ...p })),
    subscribeCouponCode: s.subscribeCouponCode,
    notifyEmail: s.notifyEmail,
  }
}

export function useAdminSettings() {
  const toast = useToastStore()
  const form = ref<AdminSettings>(emptySettings())
  const loading = ref(true)
  const saving = ref(false)

  async function load() {
    loading.value = true
    try {
      form.value = pick(await adminSettingsService.load())
    } catch (e) {
      toast.error((e as ApiError).message)
    } finally {
      loading.value = false
    }
  }

  async function save() {
    saving.value = true
    try {
      const payload = pick(form.value)
      // wa.me solo entiende dígitos con código de país.
      payload.whatsapp = payload.whatsapp.replace(/\D/g, '').replace(/^0/, '593')
      // Niveles vacíos o a medio escribir no se mandan; el resto, de menor a mayor.
      payload.volumePromo.tiers = payload.volumePromo.tiers
        .filter((t) => t.minQty > 0 && t.percent > 0)
        .sort((a, b) => a.minQty - b.minQty)
      if (payload.volumePromo.isActive && !payload.volumePromo.tiers.length) {
        toast.error('Agrega al menos un nivel para activar Compra más, ahorra más')
        return
      }
      payload.communityPhotos = payload.communityPhotos
        .filter((p) => p.image)
        .map((p) => ({ ...p, link: p.link.trim() }))
      form.value = pick(await adminSettingsService.save(payload))
      toast.success('Ajustes guardados. La tienda ya muestra los cambios')
    } catch (e) {
      toast.error((e as ApiError).message)
    } finally {
      saving.value = false
    }
  }

  load()

  return { form, loading, saving, save }
}
