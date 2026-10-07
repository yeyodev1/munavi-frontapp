import { reactive } from 'vue'
import type { Customer, ShippingAddress } from '@/types'
import { checkoutCopy } from '@/config/copy/checkout'

export type CheckoutForm = Customer & ShippingAddress
export type CheckoutField = keyof CheckoutForm
export type CheckoutErrors = Partial<Record<CheckoutField, string>>

const STORAGE_KEY = 'munavi_checkout_contact'
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const msg = checkoutCopy.errors

/** Mismas reglas que el backend (normalizeEcuadorPhone): acepta +593 y espacios. */
export function isValidPhone(raw: string): boolean {
  let digits = raw.replace(/\D/g, '')
  if (digits.startsWith('593')) digits = digits.slice(3)
  if (digits.length === 9) digits = `0${digits}`
  return /^0\d{9}$/.test(digits)
}

export function isValidEmail(raw: string): boolean {
  return EMAIL.test(raw.trim())
}

const rules: Record<CheckoutField, (v: string) => string> = {
  name: (v) => (v.trim().length >= 3 ? '' : msg.name),
  email: (v) => (isValidEmail(v) ? '' : msg.email),
  phone: (v) => (isValidPhone(v) ? '' : msg.phone),
  documentId: (v) => ([10, 13].includes(v.replace(/\D/g, '').length) ? '' : msg.documentId),
  province: (v) => (v ? '' : msg.province),
  city: (v) => (v.trim() ? '' : msg.city),
  address: (v) => (v.trim().length >= 5 ? '' : msg.address),
  reference: () => '',
}

const empty = (): CheckoutForm => ({
  name: '', email: '', phone: '', documentId: '', province: '', city: '', address: '', reference: '',
})

// Si vuelve a comprar en el mismo navegador no tiene que escribir todo otra vez.
function load(): CheckoutForm {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    return { ...empty(), ...(saved && typeof saved === 'object' ? saved : {}) }
  } catch {
    return empty()
  }
}

export function useCheckoutForm() {
  const form = reactive<CheckoutForm>(load())
  const errors = reactive<CheckoutErrors>({})

  function check(field: CheckoutField) {
    errors[field] = rules[field](form[field])
  }

  /** Revalida solo si ya mostraba error: no regaña mientras escribe por primera vez. */
  function recheck(field: CheckoutField) {
    if (errors[field]) check(field)
  }

  function validate(): boolean {
    ;(Object.keys(rules) as CheckoutField[]).forEach(check)
    return !Object.values(errors).some(Boolean)
  }

  function remember() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form))
    } catch {
      // sin persistencia no pasa nada
    }
  }

  function customer(): Customer {
    return { name: form.name.trim(), email: form.email.trim().toLowerCase(), phone: form.phone.trim(), documentId: form.documentId.trim() }
  }

  function shippingAddress(): ShippingAddress {
    return { province: form.province, city: form.city.trim(), address: form.address.trim(), reference: form.reference.trim() }
  }

  return { form, errors, check, recheck, validate, remember, customer, shippingAddress }
}
