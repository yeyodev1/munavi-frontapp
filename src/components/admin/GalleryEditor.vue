<script setup lang="ts">
import ImageUploader from './ImageUploader.vue'
import type { ImageRef } from '@/types'

/** Galería del producto. La primera foto es la portada que se ve en la tienda. */
const images = defineModel<ImageRef[]>({ required: true })

function add(image: ImageRef | null) {
  if (image) images.value = [...images.value, image]
}

function move(index: number, delta: number) {
  const next = [...images.value]
  const target = index + delta
  if (target < 0 || target >= next.length) return
  ;[next[index], next[target]] = [next[target]!, next[index]!]
  images.value = next
}

function remove(index: number) {
  images.value = images.value.filter((_, i) => i !== index)
}
</script>

<template>
  <div class="gallery">
    <ul v-if="images.length" class="gallery__list">
      <li v-for="(image, index) in images" :key="image.url + index" class="gallery__item">
        <img :src="image.url" alt="" loading="lazy" />
        <span v-if="index === 0" class="gallery__badge">Portada</span>
        <div class="gallery__tools">
          <button
            type="button"
            :disabled="index === 0"
            aria-label="Mover a la izquierda"
            @click="move(index, -1)"
          >
            <i class="fa-solid fa-arrow-left"></i>
          </button>
          <button
            type="button"
            :disabled="index === images.length - 1"
            aria-label="Mover a la derecha"
            @click="move(index, 1)"
          >
            <i class="fa-solid fa-arrow-right"></i>
          </button>
          <button
            type="button"
            class="gallery__remove"
            aria-label="Eliminar foto"
            @click="remove(index)"
          >
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </li>
    </ul>
    <p v-else class="gallery__empty">
      Todavía no hay fotos. La primera que agregues será la portada.
    </p>

    <ImageUploader add-mode label="Agregar foto" :model-value="null" @update:model-value="add" />
  </div>
</template>

<style scoped lang="scss">
.gallery {
  @include flex(column, stretch, flex-start, 1rem);

  &__list {
    list-style: none;
    @include flex-cards(130px, 0.75rem);

    > * {
      max-width: 180px;
    }
  }

  &__item {
    position: relative;
    aspect-ratio: 1;
    border-radius: $radius-sm;
    overflow: hidden;
    border: 1px solid $line;
    background: $sand;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__badge {
    position: absolute;
    top: 0.4rem;
    left: 0.4rem;
    padding: 0.15rem 0.55rem;
    border-radius: $radius-pill;
    background: $accent;
    color: $surface;
    font-size: 0.68rem;
    font-weight: 700;
  }

  &__tools {
    position: absolute;
    inset: auto 0 0 0;
    @include flex(row, center, center, 0.3rem);
    padding: 0.35rem;
    background: linear-gradient(transparent, rgba($ink, 0.6));

    button {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      background: rgba($surface, 0.92);
      font-size: 0.78rem;

      &:disabled {
        opacity: 0.35;
      }
    }
  }

  &__remove {
    color: $danger;
  }

  &__empty {
    font-size: $text-sm;
    color: $ink-muted;
  }
}
</style>
