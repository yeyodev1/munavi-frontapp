import APIBase from './httpBase'
import type { AdminSettings } from '@/types'

class AdminSettingsService extends APIBase {
  async load(): Promise<AdminSettings> {
    const { data } = await this.get<AdminSettings>('admin/settings')
    return data
  }

  /** El backend reemplaza solo los campos enviados. */
  async save(input: Partial<AdminSettings>): Promise<AdminSettings> {
    const { data } = await this.put<AdminSettings>('admin/settings', input)
    return data
  }
}

export const adminSettingsService = new AdminSettingsService()
