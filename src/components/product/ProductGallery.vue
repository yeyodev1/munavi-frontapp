<script setup lang="ts">
import { productCopy, productDetailCopy as copy } from '@/config/copy/product'

defineProps<{ images: string[]; alt: string }>()
const active = defineModel<number>({ default: 0 })
</script>

<template>
  <div class="gallery">
    <div class="gallery__main">
      <Transition name="fade" mode="out-in">
        <img v-if="images[active]" :key="images[active]" :src="images[active]" :alt="alt" class="gallery__img" />
        <span v-else class="gallery__placeholder">
          <i class="fa-solid fa-leaf" aria-hidden="true"></i>
          {{ productCopy.noImage }}
        </span>
      </Transition>
    </div>

    <div v-if="images.length > 1" class="gallery__thumbs">
      <button
        v-for="(src, index) in images"
        :key="src"
        type="button"
        class="gallery__thumb"
        :class="{ 'gallery__thumb--active': index === active }"
        :aria-label="`${copy.gallery} ${index + 1}`"
        :aria-pressed="index === active"
        @click="active = index"
      >
        <img :src="src" alt="" loading="lazy" />
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.gallery {
  @include flex(column, stretch, flex-start, 0.75rem);

  &__main {
    aspect-ratio: 1;
    border-radius: $radius-lg;
    overflow: hidden;
    background: linear-gradient(160deg, #f6eefa, #fdf1f6);
    @include flex(row, center, center);
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 7%;
    filter: drop-shadow(0 18px 22px rgba($ink, 0.12));
  }

  &__placeholder {
    @include flex(column, center, center, 0.6rem);
    color: rgba($accent, 0.45);
    font-size: $text-sm;

    i {
      font-size: 3rem;
    }
  }

  &__thumbs {
    @include flex(row, center, flex-start, 0.5rem);
    overflow-x: auto;
    scrollbar-width: none;
  }

  &__thumb {
    flex: 0 0 4.2rem;
    height: 4.2rem;
    border-radius: $radius-sm;
    overflow: hidden;
    border: 2px solid transparent;
    opacity: 0.7;
    @include transition;

    background: #f6eefa;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: 0.25rem;
    }

    &--active,
    &:hover {
      border-color: $accent;
      opacity: 1;
    }
  }
}
</style>
