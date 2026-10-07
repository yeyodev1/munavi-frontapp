<script setup lang="ts">
defineProps<{ icon?: string; title: string; text?: string }>()
</script>

<template>
  <div class="aempty">
    <i :class="icon ?? 'fa-solid fa-inbox'" class="aempty__icon"></i>
    <p class="aempty__title">{{ title }}</p>
    <p v-if="text" class="aempty__text">{{ text }}</p>
    <slot />
  </div>
</template>

<style scoped lang="scss">
.aempty {
  @include flex(column, center, center, 0.5rem);
  text-align: center;
  padding: 2.5rem 1rem;
  border: 1px dashed $line;
  border-radius: 14px;
  background: $surface;

  &__icon {
    font-size: 1.8rem;
    color: $ink-muted;
  }

  &__title {
    font-weight: 700;
  }

  &__text {
    font-size: $text-sm;
    color: $ink-soft;
    max-width: 40ch;
  }
}
</style>
