import { nextTick, onUnmounted, ref } from 'vue'
import type { PayphoneBox } from '@/types'

/**
 * Cajita de Pagos de Payphone v2.0. Los assets se insertan una sola vez por
 * carga de la app; cada render monta el formulario sobre un contenedor vacío.
 */

const BASE = 'https://cdn.payphonetodoesposible.com/box/v2.0/payphone-payment-box'
const LOAD_TIMEOUT_MS = 15000
const POLL_MS = 100
/** Payphone invalida el formulario a los 10 minutos. */
export const PAYPHONE_EXPIRES_MS = 10 * 60 * 1000

interface PPaymentButtonBoxInstance {
  render: (containerId: string) => void
}

declare global {
  interface Window {
    PPaymentButtonBox?: new (config: Record<string, unknown>) => PPaymentButtonBoxInstance
  }
}

let assetsInjected = false

function injectAssets() {
  if (assetsInjected) return
  assetsInjected = true

  if (!document.querySelector(`link[href="${BASE}.css"]`)) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = `${BASE}.css`
    document.head.appendChild(link)
  }
  if (!document.querySelector(`script[src="${BASE}.js"]`)) {
    const script = document.createElement('script')
    script.type = 'module'
    script.src = `${BASE}.js`
    document.head.appendChild(script)
  }
}

/** Espera a que el módulo de Payphone registre la clase global. */
function waitForBox(): Promise<void> {
  return new Promise((resolve, reject) => {
    const started = Date.now()
    const tick = () => {
      if (window.PPaymentButtonBox) return resolve()
      if (Date.now() - started > LOAD_TIMEOUT_MS) return reject(new Error('timeout'))
      setTimeout(tick, POLL_MS)
    }
    tick()
  })
}

export type PayphoneStatus = 'loading' | 'ready' | 'error'

export function usePayphoneBox(containerId = 'pp-button') {
  const status = ref<PayphoneStatus>('loading')
  const expired = ref(false)
  let expiryTimer: ReturnType<typeof setTimeout> | null = null
  let alive = true

  async function mount(config: PayphoneBox) {
    status.value = 'loading'
    expired.value = false
    if (expiryTimer) clearTimeout(expiryTimer)

    try {
      injectAssets()
      await waitForBox()
      await nextTick()
      if (!alive) return
      const container = document.getElementById(containerId)
      if (!container || !window.PPaymentButtonBox) throw new Error('sin contenedor')
      container.innerHTML = ''
      new window.PPaymentButtonBox({ ...config, lang: 'es', defaultMethod: 'card', timeZone: -5 }).render(containerId)
      status.value = 'ready'
      expiryTimer = setTimeout(() => {
        expired.value = true
      }, PAYPHONE_EXPIRES_MS)
    } catch {
      // Si el script no llegó (red caída), el siguiente intento lo vuelve a insertar.
      if (!window.PPaymentButtonBox) {
        document.querySelector(`script[src="${BASE}.js"]`)?.remove()
        assetsInjected = false
      }
      if (alive) status.value = 'error'
    }
  }

  onUnmounted(() => {
    alive = false
    if (expiryTimer) clearTimeout(expiryTimer)
  })

  return { status, expired, mount }
}
