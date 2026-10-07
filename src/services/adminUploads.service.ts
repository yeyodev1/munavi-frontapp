import APIBase from './httpBase'
import type { ImageRef } from '@/types'

class AdminUploadsService extends APIBase {
  async image(file: File): Promise<ImageRef> {
    const form = new FormData()
    form.append('file', file)
    // Una foto pesada desde el celular puede tardar: más margen que el resto.
    const { data } = await this.post<ImageRef>('admin/uploads', form, undefined, { timeout: 60000 })
    return data
  }
}

export const adminUploadsService = new AdminUploadsService()
