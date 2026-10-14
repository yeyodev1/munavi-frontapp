import { defineStore } from 'pinia'
import type { PublicSettings } from '@/types'
import { site } from '@/config/site'
import { settingsService } from '@/services/settings.service'
import { configureTracking } from '@/composables/useTracking'

// Una sola petición por carga, aunque la pidan header, footer y home a la vez.
let pending: Promise<void> | null = null

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    settings: null as PublicSettings | null,
    loaded: false,
  }),

  getters: {
    whatsapp: (state) => state.settings?.whatsapp || site.whatsapp,
    announcement: (state) => state.settings?.announcement || '',
    heroSlides: (state) => state.settings?.heroSlides ?? [],
    volumePromo: (state) => state.settings?.volumePromo ?? { isActive: false, tiers: [] },
    communityPhotos: (state) => state.settings?.communityPhotos ?? [],
    shipping: (state) => state.settings?.shipping ?? null,
    social: (state) => ({
      instagram: state.settings?.instagram || site.social.instagram,
      facebook: state.settings?.facebook || site.social.facebook,
      tiktok: state.settings?.tiktok || site.social.tiktok,
    }),
  },

  actions: {
    load(): Promise<void> {
      if (this.loaded) return Promise.resolve()
      if (!pending) {
        pending = settingsService
          .getPublic()
          .then((data) => {
            this.settings = data
          })
          .catch(() => {
            // Sin ajustes se usa lo de site.ts; la tienda sigue vendiendo.
          })
          .finally(() => {
            // Con o sin ajustes: libera los eventos en cola (sin IDs del panel usa los de .env).
            configureTracking(this.settings?.tracking)
            this.loaded = true
            pending = null
          })
      }
      return pending
    },
  },
})
