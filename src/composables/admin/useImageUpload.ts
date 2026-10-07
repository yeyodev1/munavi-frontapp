import { ref } from 'vue'
import { adminUploadsService } from '@/services/adminUploads.service'
import { useToastStore } from '@/stores/toast'
import type { ApiError, ImageRef } from '@/types'

const MAX_MB = 8

/** Sube una imagen y avisa en un toast si algo falla (incluido Cloudinary sin configurar). */
export function useImageUpload() {
  const toast = useToastStore()
  const uploading = ref(false)

  async function upload(file: File): Promise<ImageRef | null> {
    if (!file.type.startsWith('image/')) {
      toast.error('El archivo tiene que ser una imagen (JPG, PNG o WebP)')
      return null
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      toast.error(`La imagen pesa más de ${MAX_MB} MB. Prueba con una más liviana`)
      return null
    }

    uploading.value = true
    try {
      return await adminUploadsService.image(file)
    } catch (e) {
      const { status, message } = e as ApiError
      toast.error(status === 503 ? `${message}. Puedes pegar el enlace de la imagen` : message)
      return null
    } finally {
      uploading.value = false
    }
  }

  /** Alternativa sin Cloudinary: una URL pública pegada a mano. */
  function fromUrl(raw: string): ImageRef | null {
    const url = raw.trim()
    if (!/^https?:\/\/\S+$/i.test(url)) {
      toast.error('El enlace debe empezar con http:// o https://')
      return null
    }
    return { url, publicId: '' }
  }

  return { uploading, upload, fromUrl }
}
