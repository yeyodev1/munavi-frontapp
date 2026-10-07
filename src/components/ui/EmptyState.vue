<script setup lang="ts">
withDefaults(
  defineProps<{
    icon?: string
    title: string
    text?: string
    tone?: 'brand' | 'error'
  }>(),
  { icon: 'fa-solid fa-leaf', text: '', tone: 'brand' },
)
</script>

<template>
  <div class="empty" :class="`empty--${tone}`" role="status">
    <span class="empty__icon"><i :class="icon" aria-hidden="true"></i></span>
    <h3 class="empty__title">{{ title }}</h3>
    <p v-if="text" class="empty__text">{{ text }}</p>
    <div v-if="$slots.default" class="empty__actions">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.empty {
  @include flex(column, center, center, 0.75rem);
  text-align: center;
  padding: $space-lg $space-md;
  border-radius: $radius-lg;
  background: linear-gradient(160deg, rgba($accent, 0.06), rgba($rose, 0.06));
  border: 1px dashed rgba($accent, 0.25);

  &__icon {
    @include flex(row, center, center);
    width: 3.4rem;
    height: 3.4rem;
    border-radius: 50%;
    background: $surface;
    color: $accent;
    font-size: 1.3rem;
    box-shadow: $shadow-sm;
  }

  &--error &__icon {
    color: $danger;
  }

  &__title {
    @include display($text-xl, 500);
  }

  &__text {
    color: $ink-soft;
    font-size: $text-sm;
    max-width: 46ch;
  }

  &__actions {
    @include flex(row, center, center, 0.6rem);
    flex-wrap: wrap;
    margin-top: 0.4rem;
  }
}
</style>
