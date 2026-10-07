<script setup lang="ts">
defineProps<{ label: string; for?: string; hint?: string; warning?: string; grow?: boolean }>()
</script>

<template>
  <div class="field" :class="{ 'field--grow': grow }">
    <label :for="$props.for" class="field__label">{{ label }}</label>
    <slot />
    <p v-if="warning" class="field__warning">
      <i class="fa-solid fa-triangle-exclamation"></i> {{ warning }}
    </p>
    <p v-else-if="hint" class="field__hint">{{ hint }}</p>
  </div>
</template>

<style scoped lang="scss">
.field {
  @include flex(column, stretch, flex-start, 0.3rem);
  // Base "auto" y no 220px: dentro de una tarjeta en columna, una base fija
  // se convertiría en altura. En filas, el min-width es el que obliga a saltar.
  flex: 1 1 auto;
  min-width: min(200px, 100%);

  &--grow {
    flex-basis: 100%;
  }

  &__label {
    margin: 0;
    font-size: 0.85rem;
    font-weight: 600;
    color: $ink;
  }

  &__hint,
  &__warning {
    font-size: $text-xs;
    line-height: 1.45;
    color: $ink-muted;
  }

  &__warning {
    color: darken($warning, 18%);
    font-weight: 600;
  }
}
</style>
