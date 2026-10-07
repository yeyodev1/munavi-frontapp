<script setup lang="ts">
import { homeCopy } from '@/config/copy/home'

const copy = homeCopy.family
</script>

<template>
  <section class="family">
    <RouterLink :to="copy.to" class="family__link">
      <img
        src="/brand/familia-munavi.webp"
        :alt="copy.alt"
        width="1025"
        height="537"
        loading="lazy"
        decoding="async"
        class="family__img"
      />
    </RouterLink>
  </section>
</template>

<style scoped lang="scss">
.family {
  @include container;
  padding-top: $space-section;

  &__link {
    display: block;
    overflow: hidden;
    border-radius: $radius-lg;
    box-shadow: $shadow-sm;
    @include transition;

    &:hover {
      box-shadow: $shadow-md;
      transform: translateY(-2px);
    }
  }

  &__img {
    width: 100%;
    height: auto;
  }
}
</style>
