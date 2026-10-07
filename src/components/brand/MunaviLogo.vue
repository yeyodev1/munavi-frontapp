<script setup lang="ts">
// Logo de Munavi redibujado a partir del manual de marca: círculo (ciclo de la
// vida) + "M" cuyo centro baja en V formando un corazón y una mano.
// Es una aproximación: cuando llegue el SVG original, reemplazar los trazos.
withDefaults(
  defineProps<{
    variant?: 'full' | 'mark'
    color?: string
    stacked?: boolean
  }>(),
  { variant: 'full', color: 'currentColor', stacked: false },
)
</script>

<template>
  <span
    class="logo"
    :class="{ 'logo--stacked': stacked, 'logo--mark': variant === 'mark' }"
    :style="color === 'currentColor' ? undefined : { color }"
    role="img"
    aria-label="Munavi"
  >
    <svg class="logo__mark" viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <g stroke="currentColor" stroke-width="4.4" stroke-linejoin="miter" stroke-miterlimit="10">
        <circle cx="50" cy="50" r="44" />
        <polyline points="20.7,61.3 36.5,35.8 50,47.5 63.5,35.8 79.3,61.3" />
        <polyline points="27.4,50.7 50,65.8 72.6,50.7" />
      </g>
    </svg>
    <span v-if="variant === 'full'" class="logo__word" aria-hidden="true">Munavi</span>
  </span>
</template>

<style scoped lang="scss">
.logo {
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  line-height: 1;

  &--stacked {
    flex-direction: column;
    gap: 0.2em;
  }

  &__mark {
    width: 1.35em;
    height: 1.35em;
    flex-shrink: 0;
  }

  &--stacked &__mark {
    width: 2.2em;
    height: 2.2em;
  }

  &--mark &__mark {
    width: 1em;
    height: 1em;
  }

  &__word {
    font-family: $font-display;
    font-weight: 600;
    letter-spacing: 0.01em;
  }
}
</style>
