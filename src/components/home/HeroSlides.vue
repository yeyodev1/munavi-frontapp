<script setup lang="ts">
// Carrusel de banners que Nathalie carga desde el panel.
import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useCarousel } from '@/composables/useCarousel'
import { homeCopy } from '@/config/copy/home'

const copy = homeCopy.hero
const settings = useSettingsStore()
const slides = computed(() => settings.heroSlides.filter((s) => s.image?.url))
const { index, go, next, prev, start, stop } = useCarousel(computed(() => slides.value.length))

const isExternal = (to: string) => /^https?:\/\//.test(to)
</script>

<template>
  <section
    class="hero"
    aria-roledescription="carrusel"
    @mouseenter="stop"
    @mouseleave="start"
    @focusin="stop"
  >
    <TransitionGroup name="fade" tag="div" class="hero__track">
      <article
        v-for="(slide, i) in slides"
        v-show="i === index"
        :key="slide.image!.url"
        class="hero__slide"
      >
        <img
          :src="slide.image!.url"
          :alt="slide.title"
          class="hero__bg"
          :fetchpriority="i === 0 ? 'high' : 'low'"
        />
        <div class="hero__shade"></div>
        <div class="hero__content">
          <component :is="i === 0 ? 'h1' : 'h2'" class="hero__title">{{ slide.title }}</component>
          <p v-if="slide.subtitle" class="hero__text">{{ slide.subtitle }}</p>
          <template v-if="slide.ctaLabel && slide.ctaTo">
            <a
              v-if="isExternal(slide.ctaTo)"
              :href="slide.ctaTo"
              class="btn btn--primary btn--caps"
              target="_blank"
              rel="noopener"
            >
              {{ slide.ctaLabel }}
            </a>
            <RouterLink v-else :to="slide.ctaTo" class="btn btn--primary btn--caps">{{
              slide.ctaLabel
            }}</RouterLink>
          </template>
        </div>
      </article>
    </TransitionGroup>

    <div v-if="slides.length > 1" class="hero__controls">
      <button class="hero__arrow" :aria-label="copy.prev" @click="prev">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      <button
        v-for="(slide, i) in slides"
        :key="slide.image!.url"
        class="hero__dot"
        :class="{ 'hero__dot--active': i === index }"
        :aria-label="`${copy.goTo} ${i + 1}`"
        :aria-current="i === index"
        @click="go(i)"
      ></button>
      <button class="hero__arrow" :aria-label="copy.next" @click="next">
        <i class="fa-solid fa-chevron-right"></i>
      </button>
    </div>
  </section>
</template>

<style scoped lang="scss">
.hero {
  position: relative;
  overflow: hidden;
  margin: 0.75rem;
  border-radius: $radius-lg;
  min-height: min(72vh, 600px);
  background: $ink-brand;

  @include from('md') {
    margin: 1rem 1.5rem 0;
  }

  &__track,
  &__slide {
    position: absolute;
    inset: 0;
  }

  &__slide {
    @include flex(row, flex-end, flex-start);

    @include from('md') {
      align-items: center;
    }
  }

  &__bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__shade {
    position: absolute;
    inset: 0;
    background: linear-gradient(0deg, rgba($ink-brand, 0.75), transparent 65%);

    @include from('md') {
      background: linear-gradient(90deg, rgba($ink-brand, 0.65), transparent 70%);
    }
  }

  &__content {
    position: relative;
    z-index: 1;
    @include flex(column, flex-start, center, 1.1rem);
    padding: $space-xl 1.5rem 4.5rem;
    max-width: 760px;

    @include from('md') {
      padding-left: $space-xl;
    }
  }

  &__title {
    @include display($display-lg);
    color: $surface;
  }

  &__text {
    font-size: $text-lg;
    color: rgba($surface, 0.9);
    max-width: 48ch;
  }

  &__controls {
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    @include flex(row, center, center, 0.5rem);
  }

  &__arrow {
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 50%;
    background: rgba($surface, 0.2);
    color: $surface;
    font-size: 0.75rem;
  }

  &__dot {
    width: 0.55rem;
    height: 0.55rem;
    border-radius: $radius-pill;
    background: rgba($surface, 0.5);
    @include transition;

    &--active {
      width: 1.6rem;
      background: $surface;
    }
  }
}
</style>
