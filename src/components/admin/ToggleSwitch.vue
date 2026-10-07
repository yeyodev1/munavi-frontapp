<script setup lang="ts">
defineProps<{ label: string; hint?: string; disabled?: boolean }>()
const model = defineModel<boolean>({ required: true })
</script>

<template>
  <label class="toggle" :class="{ 'toggle--on': model, 'toggle--disabled': disabled }">
    <input v-model="model" class="visually-hidden" type="checkbox" :disabled="disabled" />
    <span class="toggle__track" aria-hidden="true"><span class="toggle__thumb"></span></span>
    <span class="toggle__text">
      <span class="toggle__label">{{ label }}</span>
      <span v-if="hint" class="toggle__hint">{{ hint }}</span>
    </span>
  </label>
</template>

<style scoped lang="scss">
.toggle {
  @include flex(row, center, flex-start, 0.75rem);
  margin: 0;
  cursor: pointer;
  user-select: none;

  &__track {
    flex: none;
    width: 2.6rem;
    height: 1.5rem;
    border-radius: $radius-pill;
    background: $line;
    padding: 0.2rem;
    @include transition(background);
  }

  &__thumb {
    display: block;
    width: 1.1rem;
    height: 1.1rem;
    border-radius: 50%;
    background: $surface;
    box-shadow: $shadow-sm;
    @include transition(transform);
  }

  &__text {
    @include flex(column, flex-start, center);
  }

  &__label {
    font-size: 0.9rem;
    font-weight: 600;
    color: $ink;
  }

  &__hint {
    font-size: $text-xs;
    font-weight: 400;
    color: $ink-muted;
  }

  &--on &__track {
    background: $accent;
  }

  &--on &__thumb {
    transform: translateX(1.1rem);
  }

  &--disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  input:focus-visible + &__track {
    outline: 2px solid $accent;
    outline-offset: 2px;
  }
}
</style>
