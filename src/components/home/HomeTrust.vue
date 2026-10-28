<script setup lang="ts">
import SectionHead from './SectionHead.vue'
import { homeCopy } from '@/config/copy/home'

const copy = homeCopy.trust
</script>

<template>
  <section class="trust">
    <div class="trust__band">
      <!-- Fondo "Confianza Munavi" de la diseñadora: 1920×800 y 1080×1620 -->
      <picture class="trust__bg" aria-hidden="true">
        <source media="(max-width: 767px)" srcset="/brand/confianza-mobile.webp" />
        <img src="/brand/confianza-desktop.webp" alt="" loading="lazy" />
      </picture>

      <div class="trust__inner">
        <SectionHead :eyebrow="copy.eyebrow" :title="copy.title" />

        <ul class="trust__list">
          <li v-for="item in copy.items" :key="item.title" class="trust__item">
            <span class="trust__icon"><i :class="item.icon" aria-hidden="true"></i></span>
            <div>
              <h3 class="trust__title">{{ item.title }}</h3>
              <p class="trust__text">{{ item.text }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.trust {
  @include container;
  padding-top: $space-section;

  &__band {
    position: relative;
    overflow: hidden;
    border-radius: $radius-lg;
    background: #f4efe4;
  }

  &__bg {
    position: absolute;
    inset: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__inner {
    position: relative;
    z-index: 1;
    padding: $space-lg 1.25rem;

    @include from('md') {
      padding: $space-xl 2.5rem;
    }
  }

  &__list {
    list-style: none;
    @include flex-cards(260px, 1rem);

    @include from('lg') {
      @include flex-cards(180px, 1rem);
    }
  }

  &__item {
    @include flex(row, flex-start, flex-start, 0.9rem);
    padding: 1.1rem 1.2rem;
    border-radius: $radius-md;
    background: rgba($surface, 0.86);
    border: 1px solid rgba($surface, 0.9);
    backdrop-filter: blur(6px);

    @include from('lg') {
      flex-direction: column;
      gap: 0.8rem;
      padding: 1.4rem 1.2rem;
    }
  }

  &__icon {
    @include flex(row, center, center);
    flex: 0 0 2.6rem;
    width: 2.6rem;
    height: 2.6rem;
    border-radius: 50%;
    background: rgba($accent, 0.1);
    color: $accent;
  }

  // Cada punto toma un secundario del manual, siempre en tinte suave.
  &__item:nth-child(2) &__icon {
    background: rgba($red, 0.12);
    color: $sale;
  }

  &__item:nth-child(3) &__icon {
    background: rgba($olive, 0.16);
    color: darken($olive, 14%);
  }

  &__item:nth-child(4) &__icon {
    background: rgba($orange, 0.14);
    color: darken($orange, 14%);
  }

  &__item:nth-child(5) &__icon {
    background: rgba($whatsapp, 0.14);
    color: #128c4a;
  }

  &__title {
    font-family: $font-principal;
    font-size: $text-sm;
    font-weight: 700;
    margin-bottom: 0.2rem;
  }

  &__text {
    font-size: $text-xs;
    color: $ink-soft;
    line-height: 1.5;
  }
}
</style>
