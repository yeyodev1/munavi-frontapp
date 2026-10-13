<script setup lang="ts">
import { computed } from 'vue'
import ImageUploader from './ImageUploader.vue'
import type { CommunityPhoto, ImageRef } from '@/types'

/** Más de 12 fotos ya no entran bien en la franja del inicio en celular. */
const MAX_PHOTOS = 12

const photos = defineModel<CommunityPhoto[]>({ required: true })
const full = computed(() => photos.value.length >= MAX_PHOTOS)

function patch(index: number, changes: Partial<CommunityPhoto>) {
  photos.value = photos.value.map((p, i) => (i === index ? { ...p, ...changes } : p))
}

function move(index: number, delta: number) {
  const next = [...photos.value]
  const target = index + delta
  if (target < 0 || target >= next.length) return
  ;[next[index], next[target]] = [next[target]!, next[index]!]
  photos.value = next
}

function add() {
  if (full.value) return
  photos.value = [...photos.value, { image: null, link: '' }]
}

function remove(index: number) {
  photos.value = photos.value.filter((_, i) => i !== index)
}

function field(event: Event): string {
  return (event.target as HTMLInputElement).value
}
</script>

<template>
  <div class="photos">
    <p class="photos__tip">
      <i class="fa-solid fa-circle-info"></i>
      Usa fotos cuadradas de 1080 × 1080. Las que queden sin imagen no se guardan.
    </p>
    <p v-if="!photos.length" class="photos__empty">
      Sin fotos: la sección Comunidad Munavi no se muestra en el inicio.
    </p>

    <article v-for="(photo, index) in photos" :key="index" class="photos__item">
      <header class="photos__head">
        <span class="photos__num">Foto {{ index + 1 }}</span>
        <div class="photos__tools">
          <button type="button" :disabled="index === 0" aria-label="Subir" @click="move(index, -1)">
            <i class="fa-solid fa-arrow-up"></i>
          </button>
          <button
            type="button"
            :disabled="index === photos.length - 1"
            aria-label="Bajar"
            @click="move(index, 1)"
          >
            <i class="fa-solid fa-arrow-down"></i>
          </button>
          <button
            type="button"
            class="photos__remove"
            aria-label="Quitar foto"
            @click="remove(index)"
          >
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </header>

      <ImageUploader
        compact
        label="Subir foto"
        :model-value="photo.image"
        @update:model-value="patch(index, { image: $event as ImageRef | null })"
      />

      <div class="photos__field">
        <label :for="`photo-link-${index}`">Enlace al tocarla (opcional)</label>
        <input
          :id="`photo-link-${index}`"
          :value="photo.link"
          type="url"
          placeholder="https://instagram.com/p/…"
          @input="patch(index, { link: field($event) })"
        />
      </div>
    </article>

    <button class="photos__add" type="button" :disabled="full" @click="add">
      <i class="fa-solid fa-plus"></i>
      {{ full ? `Máximo ${MAX_PHOTOS} fotos` : 'Agregar foto' }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.photos {
  @include flex(column, stretch, flex-start, 0.8rem);

  &__tip,
  &__empty {
    font-size: $text-sm;
    color: $ink-muted;
  }

  &__tip {
    @include flex(row, baseline, flex-start, 0.4rem);
    color: $ink-soft;
  }

  &__item {
    @include flex(column, stretch, flex-start, 0.8rem);
    padding: 1rem;
    border: 1px solid $line;
    border-radius: $radius-sm;
    background: $paper;
  }

  &__head {
    @include flex(row, center, space-between, 0.5rem);
  }

  &__num {
    font-weight: 700;
    font-size: 0.9rem;
  }

  &__tools {
    @include flex(row, center, flex-start, 0.15rem);

    button {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      color: $ink-soft;

      &:hover:not(:disabled) {
        background: $sand;
      }

      &:disabled {
        opacity: 0.3;
      }
    }
  }

  &__remove {
    color: $danger !important;
  }

  &__field {
    min-width: 0;
  }

  &__add {
    @include flex(row, center, center, 0.4rem);
    align-self: flex-start;
    padding: 0.55rem 1rem;
    border: 1px dashed $accent;
    border-radius: $radius-pill;
    color: $accent;
    font-size: 0.85rem;
    font-weight: 600;

    &:disabled {
      opacity: 0.5;
    }
  }
}
</style>
