<script setup lang="ts">
import ImageUploader from './ImageUploader.vue'
import type { HeroSlide, ImageRef } from '@/types'

const slides = defineModel<HeroSlide[]>({ required: true })

function patch(index: number, changes: Partial<HeroSlide>) {
  slides.value = slides.value.map((s, i) => (i === index ? { ...s, ...changes } : s))
}

function move(index: number, delta: number) {
  const next = [...slides.value]
  const target = index + delta
  if (target < 0 || target >= next.length) return
  ;[next[index], next[target]] = [next[target]!, next[index]!]
  slides.value = next
}

function add() {
  slides.value = [
    ...slides.value,
    { title: '', subtitle: '', image: null, ctaLabel: 'Comprar ahora', ctaTo: '/tienda' },
  ]
}

function remove(index: number) {
  slides.value = slides.value.filter((_, i) => i !== index)
}

function field(event: Event): string {
  return (event.target as HTMLInputElement).value
}
</script>

<template>
  <div class="slides">
    <p v-if="!slides.length" class="slides__empty">
      Sin banners propios: la portada usa el diseño por defecto.
    </p>

    <article v-for="(slide, index) in slides" :key="index" class="slides__item">
      <header class="slides__head">
        <span class="slides__num">Banner {{ index + 1 }}</span>
        <div class="slides__tools">
          <button type="button" :disabled="index === 0" aria-label="Subir" @click="move(index, -1)">
            <i class="fa-solid fa-arrow-up"></i>
          </button>
          <button
            type="button"
            :disabled="index === slides.length - 1"
            aria-label="Bajar"
            @click="move(index, 1)"
          >
            <i class="fa-solid fa-arrow-down"></i>
          </button>
          <button
            type="button"
            class="slides__remove"
            aria-label="Quitar banner"
            @click="remove(index)"
          >
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </header>

      <ImageUploader
        label="Imagen del banner"
        :model-value="slide.image"
        @update:model-value="patch(index, { image: $event as ImageRef | null })"
      />

      <div class="slides__fields">
        <div class="slides__field slides__field--wide">
          <label :for="`slide-title-${index}`">Título</label>
          <input
            :id="`slide-title-${index}`"
            :value="slide.title"
            @input="patch(index, { title: field($event) })"
          />
        </div>
        <div class="slides__field slides__field--wide">
          <label :for="`slide-sub-${index}`">Texto debajo del título</label>
          <input
            :id="`slide-sub-${index}`"
            :value="slide.subtitle"
            @input="patch(index, { subtitle: field($event) })"
          />
        </div>
        <div class="slides__field">
          <label :for="`slide-cta-${index}`">Texto del botón</label>
          <input
            :id="`slide-cta-${index}`"
            :value="slide.ctaLabel"
            @input="patch(index, { ctaLabel: field($event) })"
          />
        </div>
        <div class="slides__field">
          <label :for="`slide-to-${index}`">El botón lleva a</label>
          <input
            :id="`slide-to-${index}`"
            :value="slide.ctaTo"
            placeholder="/tienda o /producto/…"
            @input="patch(index, { ctaTo: field($event) })"
          />
        </div>
      </div>
    </article>

    <button class="slides__add" type="button" @click="add">
      <i class="fa-solid fa-plus"></i> Agregar banner
    </button>
  </div>
</template>

<style scoped lang="scss">
.slides {
  @include flex(column, stretch, flex-start, 0.8rem);

  &__empty {
    font-size: $text-sm;
    color: $ink-muted;
  }

  &__item {
    @include flex(column, stretch, flex-start, 0.9rem);
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

  &__fields {
    @include flex(row, flex-start, flex-start, 0.8rem);
    flex-wrap: wrap;
  }

  &__field {
    flex: 1 1 180px;
    min-width: 0;

    &--wide {
      flex-basis: 100%;
    }
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
  }
}
</style>
