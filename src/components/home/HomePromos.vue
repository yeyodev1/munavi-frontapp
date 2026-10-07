<script setup lang="ts">
import { computed } from 'vue'
import SectionHead from './SectionHead.vue'
import { useSettingsStore } from '@/stores/settings'
import { money } from '@/utils/price'
import { homeCopy } from '@/config/copy/home'

const copy = homeCopy.promos
const settings = useSettingsStore()

const freeShipping = computed(() => {
  const threshold = settings.shipping?.freeShippingThreshold
  return threshold ? `${copy.freeShipping} ${money(threshold)}` : ''
})
</script>

<template>
  <section class="promos">
    <SectionHead :eyebrow="copy.eyebrow" :title="copy.title" />

    <p v-if="freeShipping" class="promos__ribbon">
      <i class="fa-solid fa-truck-fast" aria-hidden="true"></i>
      {{ freeShipping }}
      <span v-if="settings.shipping?.note" class="promos__note">· {{ settings.shipping.note }}</span>
    </p>

    <div class="promos__list">
      <article v-for="(promo, i) in copy.items" :key="promo.title" class="promo" :class="`promo--${i}`">
        <span class="promo__icon"><i :class="promo.icon" aria-hidden="true"></i></span>
        <h3 class="promo__title">{{ promo.title }}</h3>
        <p class="promo__text">{{ promo.text }}</p>
        <RouterLink :to="promo.to" class="promo__cta">
          {{ promo.cta }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
        </RouterLink>
      </article>
    </div>
  </section>
</template>

<style scoped lang="scss">
.promos {
  @include container;
  padding-top: $space-section;

  &__ribbon {
    @include flex(row, center, flex-start, 0.6rem);
    flex-wrap: wrap;
    font-weight: 600;
    font-size: $text-sm;
    color: $accent-deep;
    background: rgba($accent, 0.07);
    padding: 0.8rem 1.1rem;
    border-radius: $radius-pill;
    margin-bottom: 1rem;
  }

  &__note {
    font-weight: 400;
    color: $ink-soft;
  }

  &__list {
    @include flex-cards(260px, 1rem);
  }
}

.promo {
  @include flex(column, flex-start, flex-start, 0.6rem);
  padding: 1.6rem 1.5rem;
  border-radius: $radius-lg;
  @include transition;

  &:hover {
    transform: translateY(-3px);
  }

  &--0 {
    background: $accent;
    color: $surface;
  }

  &--1 {
    background: $sage-soft;
  }

  &--2 {
    background: $sand;
  }

  &__icon {
    @include flex(row, center, center);
    width: 2.8rem;
    height: 2.8rem;
    border-radius: 50%;
    background: rgba($surface, 0.85);
    color: $accent;
    margin-bottom: 0.3rem;
  }

  &__title {
    @include display($text-xl, 700);
  }

  &__text {
    font-size: $text-sm;
    opacity: 0.85;
  }

  &__cta {
    @include flex(row, center, flex-start, 0.4rem);
    margin-top: auto;
    padding-top: 0.6rem;
    font-size: $text-sm;
    font-weight: 700;
  }

  &--1 &__cta,
  &--2 &__cta {
    color: $accent;
  }
}
</style>
