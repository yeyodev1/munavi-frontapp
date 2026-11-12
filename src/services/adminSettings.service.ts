import APIBase from './httpBase'
import type { AdminSettings } from '@/types'

/** Payphone se manda distinto de como llega: token solo si es nuevo, nunca hasToken/tokenEnd. */
export type AdminSettingsInput = Partial<Omit<AdminSettings, 'payphone'>> & {
  payphone?: { storeId?: string; token?: string; clearToken?: true }
}

class AdminSettingsService extends APIBase {
  async load(): Promise<AdminSettings> {
    const { data } = await this.get<AdminSettings>('admin/settings')
    return data
  }

  /** El backend reemplaza solo los campos enviados. */
  async save(input: AdminSettingsInput): Promise<AdminSettings> {
    const { data } = await this.put<AdminSettings>('admin/settings', input)
    return data
  }
}

export const adminSettingsService = new AdminSettingsService()
