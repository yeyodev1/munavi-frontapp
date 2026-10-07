<script setup lang="ts">
/** Etiqueta + control + mensaje de error, con los ids enlazados para lectores de pantalla. */
withDefaults(defineProps<{ id: string; label: string; error?: string; wide?: boolean }>(), {
  error: '',
  wide: false,
})
</script>

<template>
  <div class="field" :class="{ 'field--error': error, 'field--wide': wide }">
    <label :for="id">{{ label }}</label>
    <slot />
    <p v-if="error" :id="`${id}-error`" class="field__error" role="alert">
      <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i>
      {{ error }}
    </p>
  </div>
</template>

<style scoped lang="scss">
.field {
  @include flex(column, stretch, flex-start);
  flex: 1 1 100%;
  min-width: 0;

  @include from('sm') {
    flex-basis: calc(50% - 0.5rem);
  }

  &--wide {
    flex-basis: 100% !important;
  }

  &--error :slotted(input),
  &--error :slotted(select) {
    border-color: $danger;
  }

  &__error {
    @include flex(row, center, flex-start, 0.35rem);
    margin-top: 0.35rem;
    font-size: $text-xs;
    color: $danger;
  }
}
</style>
