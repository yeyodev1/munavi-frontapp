<script setup lang="ts">
import { computed, ref } from 'vue'
import HeroShowcase from './HeroShowcase.vue'
import { useSettingsStore } from '@/stores/settings'
import { useCarousel } from '@/composables/useCarousel'
import { whatsappLink } from '@/config/site'
import { homeCopy } from '@/config/copy/home'

const copy = homeCopy.hero
const settings = useSettingsStore()
const slides = computed(() => settings.heroSlides.filter((s) => s.image?.url))
const { index, go, next, prev, start, stop } = useCarousel(computed(() => slides.value.length))

const showcase = ref(true)

const isExternal = (to: string) => /^https?:\/\//.test(to)
</script>

<template>
  <section
    v-if="slides.length"
    class="hero hero--slides"
    aria-roledescription="carrusel"
    @mouseenter="stop"
    @mouseleave="start"
    @focusin="stop"
  >
    <TransitionGroup name="fade" tag="div" class="hero__track">
      <article v-for="(slide, i) in slides" v-show="i === index" :key="slide.image!.url" class="hero__slide">
        <img :src="slide.image!.url" :alt="slide.title" class="hero__bg" :fetchpriority="i === 0 ? 'high' : 'low'" />
        <div class="hero__shade"></div>
        <div class="hero__content">
          <component :is="i === 0 ? 'h1' : 'h2'" class="hero__title hero__title--slide">{{ slide.title }}</component>
          <p v-if="slide.subtitle" class="hero__text hero__text--light">{{ slide.subtitle }}</p>
          <template v-if="slide.ctaLabel && slide.ctaTo">
            <a v-if="isExternal(slide.ctaTo)" :href="slide.ctaTo" class="btn btn--primary" target="_blank" rel="noopener">
              {{ slide.ctaLabel }}
            </a>
            <RouterLink v-else :to="slide.ctaTo" class="btn btn--primary">{{ slide.ctaLabel }}</RouterLink>
          </template>
        </div>
      </article>
    </TransitionGroup>

    <div v-if="slides.length > 1" class="hero__controls">
      <button class="hero__arrow" :aria-label="copy.prev" @click="prev"><i class="fa-solid fa-chevron-left"></i></button>
      <button
        v-for="(slide, i) in slides"
        :key="slide.image!.url"
        class="hero__dot"
        :class="{ 'hero__dot--active': i === index }"
        :aria-label="`${copy.goTo} ${i + 1}`"
        :aria-current="i === index"
        @click="go(i)"
      ></button>
      <button class="hero__arrow" :aria-label="copy.next" @click="next"><i class="fa-solid fa-chevron-right"></i></button>
    </div>
  </section>

  <section v-else class="hero hero--brand" :class="{ 'hero--split': showcase }">
    <span class="hero__blob hero__blob--a" aria-hidden="true"></span>
    <span class="hero__blob hero__blob--b" aria-hidden="true"></span>
    <div class="hero__content hero__content--brand">
      <p class="hero__eyebrow">{{ copy.eyebrow }}</p>
      <h1 class="hero__title">{{ copy.title }}</h1>
      <p class="hero__text">{{ copy.text }}</p>
      <div class="hero__actions">
        <RouterLink to="/tienda" class="btn btn--primary">
          {{ copy.primary }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
        </RouterLink>
        <a :href="whatsappLink(undefined, settings.whatsapp)" class="btn btn--ghost" target="_blank" rel="noopener">
          <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ copy.secondary }}
        </a>
      </div>
      <ul class="hero__chips">
        <li v-for="chip in copy.chips" :key="chip.label">
          <i :class="chip.icon" aria-hidden="true"></i>{{ chip.label }}
        </li>
      </ul>
    </div>
    <HeroShowcase v-if="showcase" @empty="showcase = false" />
  </section>
</template>

<style scoped lang="scss">
.hero {
  position: relative;
  overflow: hidden;
  margin: 0.75rem;
  border-radius: $radius-lg;

  @include from('md') {
    margin: 1rem 1.5rem 0;
  }

  &--brand {
    background:
      radial-gradient(circle at 85% 20%, rgba($rose, 0.28), transparent 42%),
      radial-gradient(circle at 10% 90%, rgba($accent, 0.22), transparent 45%),
      linear-gradient(140deg, #f4ecf8 0%, #fdf2f7 60%, #fff 100%);
    min-height: min(78vh, 640px);
    @include flex(row, center, center);
  }

  // Con destacados: texto arriba y envases abajo; en desktop, lado a lado.
  &--split {
    flex-direction: column;
    padding-bottom: $space-lg;

    @include from('md') {
      flex-direction: row;
      padding: 0 $space-lg 0 0;
    }
  }

  &--split &__content--brand {
    @include from('md') {
      flex: 1 1 54%;
      align-items: flex-start;
      text-align: left;
      padding-left: $space-xl;

      .hero__actions,
      .hero__chips {
        justify-content: flex-start;
      }
    }
  }

  &__blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(2px);
    animation: hero-float 12s ease-in-out infinite alternate;

    &--a {
      width: 220px;
      height: 220px;
      right: -60px;
      top: 12%;
      background: linear-gradient(135deg, rgba($rose, 0.45), rgba($accent, 0.25));
    }

    &--b {
      width: 140px;
      height: 140px;
      left: -40px;
      bottom: 8%;
      background: linear-gradient(135deg, rgba($accent, 0.3), rgba($rose, 0.15));
      animation-delay: -6s;
    }
  }

  &__content {
    position: relative;
    z-index: 1;
    @include flex(column, flex-start, center, 1.1rem);
    padding: $space-xl 1.5rem;
    max-width: 760px;

    &--brand {
      align-items: center;
      text-align: center;
    }
  }

  &__eyebrow {
    @include eyebrow;
    padding: 0.4rem 0.9rem;
    border-radius: $radius-pill;
    background: rgba($surface, 0.75);
  }

  &__title {
    @include display(clamp(3.2rem, 1.8rem + 7vw, 7.5rem), 500);
    color: $accent-deep;
    font-style: italic;
    letter-spacing: -0.035em;

    &--slide {
      @include display($display-lg, 500);
      color: $surface;
    }
  }

  &__text {
    font-size: $text-lg;
    color: $ink-soft;
    max-width: 48ch;

    &--light {
      color: rgba($surface, 0.9);
    }
  }

  &__actions {
    @include flex(row, center, center, 0.7rem);
    flex-wrap: wrap;
  }

  &__chips {
    list-style: none;
    @include flex(row, center, center, 0.5rem);
    flex-wrap: wrap;
    margin-top: 0.4rem;

    li {
      @include flex(row, center, center, 0.4rem);
      font-size: $text-xs;
      font-weight: 600;
      padding: 0.45rem 0.85rem;
      border-radius: $radius-pill;
      background: rgba($surface, 0.8);
      color: $accent-deep;
    }
  }

  &--slides {
    min-height: min(72vh, 600px);
    background: $ink;
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
    background: linear-gradient(0deg, rgba($ink, 0.7), transparent 65%);

    @include from('md') {
      background: linear-gradient(90deg, rgba($ink, 0.6), transparent 70%);
    }
  }

  &__slide &__content {
    padding-bottom: 4.5rem;

    @include from('md') {
      padding-left: $space-xl;
    }
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

@keyframes hero-float {
  to {
    transform: translate(-20px, 30px) scale(1.08);
  }
}
</style>
