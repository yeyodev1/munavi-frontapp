<script setup lang="ts">
defineProps<{ eyebrow: string; title: string; text?: string; link?: string; linkLabel?: string }>()
</script>

<template>
  <header class="shead">
    <div class="shead__copy">
      <p class="shead__eyebrow">{{ eyebrow }}</p>
      <h2 class="shead__title">{{ title }}</h2>
      <p v-if="text" class="shead__text">{{ text }}</p>
    </div>
    <RouterLink v-if="link && linkLabel" :to="link" class="shead__link">
      {{ linkLabel }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
    </RouterLink>
  </header>
</template>

<style scoped lang="scss">
.shead {
  @include flex(row, flex-end, space-between, 1rem);
  flex-wrap: wrap;
  margin-bottom: $space-md;

  &__copy {
    @include flex(column, flex-start, flex-start, 0.45rem);
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-sm);
  }

  &__text {
    color: $ink-soft;
    max-width: 52ch;
  }

  &__link {
    @include flex(row, center, flex-start, 0.4rem);
    font-size: $text-sm;
    font-weight: 600;
    color: $accent;

    i {
      font-size: 0.75rem;
      @include transition(transform);
    }

    &:hover i {
      transform: translateX(3px);
    }
  }
}
</style>
