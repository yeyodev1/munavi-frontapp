<script setup lang="ts">
import { site } from '@/config/site'
</script>

<template>
  <section class="trust" :aria-label="site.brand.origin">
    <article v-for="pillar in site.brand.pillars" :key="pillar.title" class="trust__item">
      <span class="trust__icon"><i :class="pillar.icon" aria-hidden="true"></i></span>
      <div>
        <h3 class="trust__title">{{ pillar.title }}</h3>
        <p class="trust__text">{{ pillar.text }}</p>
      </div>
    </article>
  </section>
</template>

<style scoped lang="scss">
.trust {
  @include container;
  @include flex-cards(260px, 1rem);
  padding-block: $space-lg 0;

  &__item {
    @include flex(row, flex-start, flex-start, 0.9rem);
    padding: 1.1rem 1.2rem;
    border-radius: $radius-md;
    background: $surface;
    border: 1px solid rgba($line, 0.7);
  }

  &__icon {
    @include flex(row, center, center);
    flex: 0 0 2.6rem;
    height: 2.6rem;
    border-radius: 50%;
    background: rgba($accent, 0.09);
    color: $accent;
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
