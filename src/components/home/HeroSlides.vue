<script setup lang="ts">
// Carrusel de banners que Nathalie carga desde el panel.
import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useCarousel } from '@/composables/useCarousel'
import { homeCopy } from '@/config/copy/home'
import { site } from '@/config/site'

const copy = homeCopy.hero
// Solo la firma "Te quiero vida" va en manuscrita; cualquier otro título, en la serif.
const isTagline = (title: string) => title.trim().toLowerCase() === site.tagline.toLowerCase()
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
        <picture>
          <source
            v-if="slide.mobileImage?.url"
            media="(max-width: 767px)"
            :srcset="slide.mobileImage.url"
          />
          <img
            :src="slide.image!.url"
            :alt="slide.title || slide.ctaLabel || 'Munavi'"
            class="hero__bg"
            :fetchpriority="i === 0 ? 'high' : 'low'"
          />
        </picture>
        <!-- Sin título: el banner trae el texto diseñado y todo el slide es el enlace -->
        <template v-if="!slide.title">
          <a
            v-if="slide.ctaTo && isExternal(slide.ctaTo)"
            :href="slide.ctaTo"
            class="hero__hit"
            target="_blank"
            rel="noopener"
            :aria-label="slide.ctaLabel || copy.goTo"
          ></a>
          <RouterLink
            v-else-if="slide.ctaTo"
            :to="slide.ctaTo"
            class="hero__hit"
            :aria-label="slide.ctaLabel || copy.goTo"
          />
        </template>
        <div v-if="slide.title" class="hero__shade"></div>
        <div v-if="slide.title" class="hero__content">
          <component
            :is="i === 0 ? 'h1' : 'h2'"
            class="hero__title"
            :class="{ 'hero__title--script': isTagline(slide.title) }"
            >{{ slide.title }}</component
          >
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
  background: $ink-brand;
  // Proporción de las piezas de la diseñadora: 1080×1620 en celular y
  // 1920×800 en computador. Así el banner se ve completo, sin recortes.
  aspect-ratio: 2 / 3;
  max-height: 86vh;

  @include from('md') {
    margin: 1rem 1.5rem 0;
    aspect-ratio: 12 / 5;
    max-height: none;
  }

  &__track,
  &__slide {
    position: absolute;
    inset: 0;
  }

  // Los banners vienen sin texto y con la parte superior libre (en celular la
  // mitad de arriba, en computador la franja alta): el texto va siempre arriba.
  &__slide {
    @include flex(row, flex-start, center);
  }

  &__bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__hit {
    position: absolute;
    inset: 0;
    z-index: 1;
  }

  &__shade {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 60% 45% at 50% 22%, rgba($surface, 0.7), transparent 70%);

    @include from('md') {
      background: radial-gradient(ellipse 36% 60% at 50% 18%, rgba($surface, 0.62), transparent 75%);
    }
  }

  &__content {
    position: relative;
    z-index: 1;
    @include flex(column, center, flex-start, 0.9rem);
    padding: $space-lg 1.5rem 4.5rem;
    max-width: 760px;
    text-align: center;

    @include from('md') {
      padding-top: clamp(1.5rem, 4vw, 3.5rem);
      gap: 0.7rem;
    }
  }

  &__title {
    @include display(clamp(2rem, 1.4rem + 3vw, 3.6rem));
    color: $accent-deep;

    &--script {
      @include script(clamp(2.6rem, 1.8rem + 4vw, 4.6rem), $accent-deep);
    }
  }

  &__text {
    font-size: $text-lg;
    color: $ink;
    max-width: 36ch;
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
    background: rgba($surface, 0.85);
    color: $accent-deep;
    box-shadow: $shadow-sm;
    font-size: 0.75rem;
  }

  &__dot {
    width: 0.55rem;
    height: 0.55rem;
    border-radius: $radius-pill;
    background: rgba($accent, 0.35);
    @include transition;

    &--active {
      width: 1.6rem;
      background: $accent;
    }
  }
}
</style>
