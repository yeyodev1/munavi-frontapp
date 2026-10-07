<script setup lang="ts">
import SubscribeForm from '@/components/SubscribeForm.vue'
import { homeCopy } from '@/config/copy/home'

const copy = homeCopy.subscribe
</script>

<template>
  <section id="suscribete" class="hsub">
    <div class="hsub__card">
      <span class="hsub__badge" aria-hidden="true">20%</span>
      <div class="hsub__copy">
        <p class="hsub__eyebrow">{{ copy.eyebrow }}</p>
        <h2 class="hsub__title">{{ copy.title }}</h2>
        <p class="hsub__text">{{ copy.text }}</p>
      </div>
      <SubscribeForm source="home" tone="dark" class="hsub__form" />
    </div>
  </section>
</template>

<style scoped lang="scss">
.hsub {
  @include container;
  padding-top: $space-section;
  scroll-margin-top: 5rem;

  &__card {
    position: relative;
    overflow: hidden;
    @include flex(column, flex-start, flex-start, 1.4rem);
    padding: $space-lg 1.5rem;
    border-radius: $radius-lg;
    color: $surface;
    background:
      radial-gradient(circle at 100% 0%, rgba(#e2589b, 0.55), transparent 50%),
      linear-gradient(135deg, $accent-deep, $accent);

    @include from('md') {
      flex-direction: row;
      align-items: center;
      padding: $space-xl;
      gap: $space-lg;
    }
  }

  &__badge {
    position: absolute;
    right: -0.5rem;
    top: -1.5rem;
    font-family: $font-display;
    font-size: clamp(6rem, 4rem + 10vw, 12rem);
    font-style: italic;
    line-height: 1;
    color: rgba($surface, 0.08);
    pointer-events: none;
  }

  &__copy {
    position: relative;
    @include flex(column, flex-start, flex-start, 0.6rem);

    @include from('md') {
      flex: 1 1 55%;
    }
  }

  &__eyebrow {
    @include eyebrow;
    color: #fbd3e6;
  }

  &__title {
    @include display($display-sm);
  }

  &__text {
    color: rgba($surface, 0.85);
    max-width: 46ch;
  }

  &__form {
    position: relative;

    @include from('md') {
      flex: 1 1 45%;
    }
  }
}
</style>
