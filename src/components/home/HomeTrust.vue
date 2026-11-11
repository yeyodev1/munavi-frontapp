<script setup lang="ts">
// "Confianza en Munavi": la pieza completa de la diseñadora (pedido de Nathalie,
// 5 nov 2026) y, debajo, lo que el banner no dice.
import { homeCopy } from '@/config/copy/home'

const copy = homeCopy.trust
</script>

<template>
  <section class="trust">
    <RouterLink :to="copy.to" class="trust__banner">
      <picture>
        <source media="(max-width: 767px)" srcset="/brand/banner-confianza-mobile.webp" />
        <img src="/brand/banner-confianza-desktop.webp" :alt="copy.bannerAlt" loading="lazy" />
      </picture>
    </RouterLink>

    <ul class="trust__list">
      <li v-for="item in copy.items" :key="item.title" class="trust__item">
        <span class="trust__icon"><i :class="item.icon" aria-hidden="true"></i></span>
        <div>
          <h3 class="trust__title">{{ item.title }}</h3>
          <p class="trust__text">{{ item.text }}</p>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
// Verde oliva y crema de la pieza de la diseñadora.
$olive-brand: #5b6640;
$cream: #f4efe4;

.trust {
  @include container;
  padding-top: $space-section;

  &__banner {
    display: block;
    overflow: hidden;
    border-radius: $radius-lg $radius-lg 0 0;

    img {
      display: block;
      width: 100%;
      height: auto;
      aspect-ratio: 2 / 3;
      object-fit: cover;

      @include from('md') {
        aspect-ratio: 12 / 5;
      }
    }
  }

  &__list {
    list-style: none;
    @include flex-cards(240px, 0);
    border-radius: 0 0 $radius-lg $radius-lg;
    background: $olive-brand;
    overflow: hidden;
  }

  &__item {
    @include flex(row, center, flex-start, 1rem);
    padding: 1.4rem 1.5rem;
    color: $cream;

    & + & {
      border-left: 1px solid rgba($cream, 0.18);
    }
  }

  &__icon {
    @include flex(row, center, center);
    flex: 0 0 3.2rem;
    height: 3.2rem;
    border-radius: 50%;
    background: $cream;
    color: $olive-brand;
    font-size: 1.25rem;
  }

  &__title {
    font-family: $font-principal;
    font-size: $text-base;
    font-weight: 700;
    color: $surface;
  }

  &__text {
    font-size: $text-sm;
    line-height: 1.45;
    opacity: 0.9;
  }
}
</style>
