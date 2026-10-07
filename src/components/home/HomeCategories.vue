<script setup lang="ts">
import SectionHead from './SectionHead.vue'
import { useCategories } from '@/composables/useCatalog'
import { homeCopy } from '@/config/copy/home'

const copy = homeCopy.categories
const { categories, loading } = useCategories()

// Sin foto, cada categoría toma un tono de la paleta para no verse vacía.
const tones = ['#efe4f5', '#fbe3ef', '#f1ece6', '#e9e1f7', '#fde9df']
const icons: Record<string, string> = {
  colagenos: 'fa-solid fa-spa',
  vitaminas: 'fa-solid fa-capsules',
  digestivos: 'fa-solid fa-leaf',
  ninos: 'fa-solid fa-children',
  'salud-hormonal': 'fa-solid fa-venus',
}
</script>

<template>
  <section v-if="loading || categories.length" class="cats">
    <SectionHead :eyebrow="copy.eyebrow" :title="copy.title" link="/tienda" :link-label="copy.all" />

    <div class="cats__list">
      <template v-if="loading">
        <span v-for="n in 5" :key="n" class="cats__item cats__item--loading" aria-hidden="true"></span>
      </template>
      <RouterLink
        v-for="(cat, i) in categories"
        v-else
        :key="cat._id"
        :to="`/tienda/${cat.slug}`"
        class="cats__item"
        :style="{ background: tones[i % tones.length] }"
      >
        <img v-if="cat.image" :src="cat.image.url" :alt="cat.name" loading="lazy" class="cats__img" />
        <i v-else :class="icons[cat.slug] || 'fa-solid fa-heart'" class="cats__icon" aria-hidden="true"></i>
        <span class="cats__name">{{ cat.name }}</span>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped lang="scss">
.cats {
  @include container;
  padding-top: $space-section;

  &__list {
    @include flex(row, stretch, flex-start, 0.75rem);
    overflow-x: auto;
    margin-inline: -1.25rem;
    padding: 0 1.25rem 0.5rem;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;

    @include from('md') {
      @include flex-cards(150px, 1rem);
      margin-inline: 0;
      padding: 0;
      overflow: visible;
    }
  }

  &__item {
    position: relative;
    flex: 0 0 42%;
    aspect-ratio: 4 / 5;

    @include from('md') {
      flex: 1 1 150px;
      aspect-ratio: 1;
    }
    border-radius: $radius-md;
    overflow: hidden;
    scroll-snap-align: start;
    @include flex(column, center, center, 0.8rem);
    @include transition;

    &:hover {
      transform: translateY(-4px);
      box-shadow: $shadow-md;
    }

    &--loading {
      background: linear-gradient(90deg, #f3edf6 25%, #faf6fb 50%, #f3edf6 75%);
      background-size: 200% 100%;
      animation: shimmer 1.6s linear infinite;
    }
  }

  // Las fotos son envases sin fondo: se contienen sobre el tono para no recortarlos.
  &__img {
    position: absolute;
    top: 0.9rem;
    left: 0.9rem;
    width: calc(100% - 1.8rem);
    height: calc(100% - 4.4rem);
    object-fit: contain;
    filter: drop-shadow(0 10px 14px rgba($ink, 0.14));
    transition: transform 0.5s $ease;
  }

  &__item:hover &__img {
    transform: scale(1.05) translateY(-2px);
  }

  &__img + &__name {
    position: absolute;
    bottom: 0.7rem;
    left: 0.7rem;
    right: 0.7rem;
    background: rgba($surface, 0.92);
    padding: 0.5rem;
    border-radius: $radius-pill;
  }

  &__icon {
    font-size: 2rem;
    color: $accent;
  }

  &__name {
    font-family: $font-display;
    font-size: $text-lg;
    font-weight: 500;
    text-align: center;
    color: $ink;
    padding-inline: 0.6rem;
  }
}

</style>
