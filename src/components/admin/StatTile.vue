<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{
  label: string
  value: string | number
  icon: string
  to?: string
  hint?: string
  alert?: boolean
}>()
</script>

<template>
  <component
    :is="to ? RouterLink : 'div'"
    :to="to"
    class="tile"
    :class="{ 'tile--alert': alert, 'tile--link': to }"
  >
    <span class="tile__icon"><i :class="icon"></i></span>
    <span class="tile__body">
      <span class="tile__value">{{ value }}</span>
      <span class="tile__label">{{ label }}</span>
      <span v-if="hint" class="tile__hint">{{ hint }}</span>
    </span>
  </component>
</template>

<style scoped lang="scss">
.tile {
  @include card;
  @include flex(row, center, flex-start, 0.9rem);
  padding: 1rem 1.1rem;
  @include transition(border-color);

  &--link:hover {
    border-color: $accent;
  }

  &__icon {
    flex: none;
    @include flex(row, center, center);
    width: 2.8rem;
    height: 2.8rem;
    border-radius: 50%;
    background: $accent-soft;
    color: $accent;
    font-size: 1.05rem;
  }

  &--alert &__icon {
    background: $warning-bg;
    color: darken($warning, 18%);
  }

  &__body {
    @include flex(column, flex-start, center);
    min-width: 0;
  }

  &__value {
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1.2;
    font-variant-numeric: tabular-nums;
  }

  &__label {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__hint {
    font-size: $text-xs;
    color: $ink-muted;
  }
}
</style>
