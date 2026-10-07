<script setup lang="ts">
// Hero de marca: el lenguaje de la web anterior (firma de pincel, hojas y la
// curva salvia abajo) con los destacados flotando a la derecha.
import { ref } from 'vue'
import HeroShowcase from './HeroShowcase.vue'
import LeafDecor from '@/components/decor/LeafDecor.vue'
import { useSettingsStore } from '@/stores/settings'
import { whatsappLink } from '@/config/site'
import { homeCopy } from '@/config/copy/home'

const copy = homeCopy.hero
const settings = useSettingsStore()
const showcase = ref(true)
</script>

<template>
  <section class="brand" :class="{ 'brand--split': showcase }">
    <LeafDecor variant="monstera" class="brand__leaf brand__leaf--a" />
    <LeafDecor variant="frond" tone="fresh" class="brand__leaf brand__leaf--b" />
    <LeafDecor variant="monstera" tone="fresh" class="brand__leaf brand__leaf--c" />

    <div class="brand__inner">
      <div class="brand__copy">
        <h1 class="brand__title">{{ copy.title }}</h1>
        <p class="brand__text">{{ copy.text }}</p>
        <div class="brand__actions">
          <RouterLink to="/tienda" class="btn btn--primary btn--caps">{{
            copy.primary
          }}</RouterLink>
          <a
            :href="whatsappLink(undefined, settings.whatsapp)"
            class="btn btn--ghost"
            target="_blank"
            rel="noopener"
          >
            <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ copy.secondary }}
          </a>
        </div>
      </div>
      <HeroShowcase v-if="showcase" class="brand__showcase" @empty="showcase = false" />
    </div>

    <span class="brand__curve" aria-hidden="true"></span>
  </section>
</template>

<style scoped lang="scss">
.brand {
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at 88% 40%, rgba($sage, 0.45), transparent 42%),
    linear-gradient(180deg, $surface 0%, $sage-soft 100%);
  padding: $space-lg 0 calc(#{$space-xl} + 3rem);

  @include from('md') {
    padding-top: $space-xl;
  }

  &__inner {
    @include container;
    position: relative;
    z-index: 1;
    @include flex(column, stretch, center, $space-lg);

    @include from('md') {
      flex-direction: row;
      align-items: center;
      min-height: min(68vh, 560px);
    }
  }

  &__copy {
    @include flex(column, flex-start, center, 1.3rem);
    max-width: 560px;

    @include from('md') {
      flex: 1 1 50%;
    }
  }

  &:not(.brand--split) &__copy {
    margin-inline: auto;
    align-items: center;
    text-align: center;
  }

  &:not(.brand--split) &__actions {
    justify-content: center;
  }

  &__title {
    @include script(clamp(4.6rem, 2.6rem + 8vw, 8.8rem));
    max-width: 3.4em;
    margin-bottom: -0.2rem;
    // Water Brush es más fina que el pincel de la web anterior: un trazo
    // del mismo color la engruesa sin perder la textura.
    -webkit-text-stroke: 0.012em currentColor;
  }

  &__text {
    font-size: $text-lg;
    font-weight: 300;
    line-height: 1.6;
    color: $ink-soft;
    max-width: 36ch;
  }

  &__actions {
    @include flex(row, center, flex-start, 0.7rem);
    flex-wrap: wrap;
    margin-top: 0.3rem;
  }

  &__showcase {
    @include from('md') {
      flex: 1 1 46%;
    }
  }

  &__leaf {
    position: absolute;
    z-index: 0;

    &--a {
      width: clamp(120px, 26vw, 330px);
      top: -70px;
      right: -50px;

      @include from('md') {
        top: -40px;
      }
      transform: rotate(-140deg);
      opacity: 0.95;
    }

    &--b {
      width: clamp(110px, 16vw, 220px);
      top: -30px;
      left: -40px;
      transform: rotate(150deg);
      opacity: 0.5;
    }

    &--c {
      width: clamp(90px, 12vw, 170px);
      bottom: -10px;
      left: -50px;
      transform: rotate(30deg);
      opacity: 0.35;
      display: none;

      @include from('md') {
        display: block;
      }
    }
  }

  // Curva salvia de transición, como el borde inferior de la web anterior.
  &__curve {
    position: absolute;
    left: -10%;
    right: -10%;
    bottom: -1px;
    height: clamp(48px, 7vw, 96px);
    background: $sage;
    border-radius: 50% 50% 0 0 / 100% 100% 0 0;
  }
}
</style>
