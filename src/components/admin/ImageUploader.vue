<script setup lang="ts">
import { ref } from 'vue'
import { useImageUpload } from '@/composables/admin/useImageUpload'
import type { ImageRef } from '@/types'

/**
 * Una imagen: subirla desde el equipo o, si la subida no está disponible,
 * pegar el enlace. Con `addMode` no muestra vista previa: sirve como "agregar"
 * en galerías (el padre recibe la imagen y la suma a su lista).
 */
withDefaults(defineProps<{ label?: string; compact?: boolean; addMode?: boolean }>(), {
  label: 'Subir foto',
})
const model = defineModel<ImageRef | null>({ default: null })

const { uploading, upload, fromUrl } = useImageUpload()
const fileInput = ref<HTMLInputElement | null>(null)
const pasting = ref(false)
const pasted = ref('')

async function onFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  const image = await upload(file)
  if (image) model.value = image
}

function usePasted() {
  const image = fromUrl(pasted.value)
  if (!image) return
  model.value = image
  pasted.value = ''
  pasting.value = false
}
</script>

<template>
  <div class="uploader" :class="{ 'uploader--compact': compact }">
    <div v-if="!addMode" class="uploader__preview">
      <img v-if="model" :src="model.url" alt="" loading="lazy" />
      <i v-else class="fa-regular fa-image"></i>
    </div>

    <div class="uploader__controls">
      <div class="uploader__buttons">
        <button
          class="uploader__btn uploader__btn--main"
          type="button"
          :disabled="uploading"
          @click="fileInput?.click()"
        >
          <i
            :class="uploading ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-arrow-up-from-bracket'"
          ></i>
          {{ uploading ? 'Subiendo…' : model && !addMode ? 'Cambiar' : label }}
        </button>
        <button class="uploader__btn" type="button" @click="pasting = !pasting">
          <i class="fa-solid fa-link"></i> Pegar enlace
        </button>
        <button
          v-if="model && !addMode"
          class="uploader__btn uploader__btn--danger"
          type="button"
          @click="model = null"
        >
          <i class="fa-solid fa-trash-can"></i> Quitar
        </button>
      </div>

      <form v-if="pasting" class="uploader__paste" @submit.prevent="usePasted">
        <input
          v-model="pasted"
          type="url"
          placeholder="https://…/foto.jpg"
          aria-label="Enlace de la imagen"
        />
        <button class="uploader__btn uploader__btn--main" type="submit">Usar</button>
      </form>
    </div>

    <input ref="fileInput" class="visually-hidden" type="file" accept="image/*" @change="onFile" />
  </div>
</template>

<style scoped lang="scss">
.uploader {
  @include flex(row, center, flex-start, 0.9rem);
  flex-wrap: wrap;

  &__preview {
    flex: none;
    @include flex(row, center, center);
    width: 96px;
    height: 96px;
    border-radius: $radius-sm;
    border: 1px solid $line;
    background: $sand;
    overflow: hidden;
    color: $ink-muted;
    font-size: 1.6rem;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &--compact &__preview {
    width: 64px;
    height: 64px;
    font-size: 1.2rem;
  }

  &__controls {
    @include flex(column, stretch, flex-start, 0.5rem);
    flex: 1 1 200px;
    min-width: 0;
  }

  &__buttons {
    @include flex(row, center, flex-start, 0.4rem);
    flex-wrap: wrap;
  }

  &__btn {
    @include flex(row, center, center, 0.4rem);
    padding: 0.5rem 0.85rem;
    border: 1px solid $line;
    border-radius: $radius-pill;
    background: $surface;
    font-size: 0.8rem;
    font-weight: 600;
    white-space: nowrap;

    &:hover:not(:disabled) {
      border-color: $accent;
      color: $accent;
    }

    &--main {
      background: $accent-soft;
      border-color: transparent;
      color: $accent-deep;
    }

    &--danger:hover:not(:disabled) {
      border-color: $danger;
      color: $danger;
    }

    &:disabled {
      opacity: 0.6;
    }
  }

  &__paste {
    @include flex(row, center, flex-start, 0.4rem);

    input {
      flex: 1;
      min-width: 0;
      padding-block: 0.5rem;
    }
  }
}
</style>
