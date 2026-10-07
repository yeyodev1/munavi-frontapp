<script setup lang="ts">
import { notFoundCopy as copy } from '@/config/copy/about'
</script>

<template>
  <section class="notfound">
    <p class="notfound__code" aria-hidden="true">{{ copy.code }}</p>
    <h1 class="notfound__title">{{ copy.title }}</h1>
    <p class="notfound__text">{{ copy.text }}</p>
    <div class="notfound__actions">
      <RouterLink to="/" class="btn btn--ghost">{{ copy.home }}</RouterLink>
      <RouterLink to="/tienda" class="btn btn--primary">{{ copy.shop }}</RouterLink>
    </div>
  </section>
</template>

<style scoped lang="scss">
.notfound {
  @include container(720px);
  @include flex(column, center, center, 1rem);
  flex: 1;
  text-align: center;
  padding-block: $space-section;

  &__code {
    @include display(clamp(5rem, 3rem + 10vw, 9rem), 500);
    font-style: italic;
    background: linear-gradient(135deg, $accent, $rose);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  &__title {
    @include display($display-sm);
  }

  &__text {
    color: $ink-soft;
    max-width: 44ch;
  }

  &__actions {
    @include flex(row, center, center, 0.7rem);
    flex-wrap: wrap;
    margin-top: 0.6rem;
  }
}
</style>
