<script setup lang="ts">
/** Bloque centrado de resultado (pago aprobado, rechazado, cargando…). */
withDefaults(
  defineProps<{
    tone?: 'brand' | 'success' | 'error' | 'warning'
    icon?: string
    title: string
    text?: string
    loading?: boolean
  }>(),
  { tone: 'brand', icon: 'fa-solid fa-circle-info', text: '', loading: false },
)
</script>

<template>
  <section class="result" :class="`result--${tone}`" :role="loading ? 'status' : undefined" :aria-busy="loading">
    <span class="result__icon">
      <span v-if="loading" class="result__spinner" aria-hidden="true"></span>
      <i v-else :class="icon" aria-hidden="true"></i>
    </span>
    <h1 class="result__title">{{ title }}</h1>
    <p v-if="text" class="result__text">{{ text }}</p>
    <slot />
    <div v-if="$slots.actions" class="result__actions">
      <slot name="actions" />
    </div>
  </section>
</template>

<style scoped lang="scss">
.result {
  @include card;
  @include flex(column, center, flex-start, 0.7rem);
  padding: $space-lg 1.25rem;
  text-align: center;

  @include from('md') {
    padding: $space-lg;
  }

  &__icon {
    @include flex(row, center, center);
    width: 4rem;
    height: 4rem;
    margin-bottom: 0.3rem;
    border-radius: 50%;
    background: rgba($accent, 0.1);
    color: $accent;
    font-size: 1.6rem;
  }

  &--success &__icon {
    background: $success-bg;
    color: $success;
  }

  &--error &__icon {
    background: $danger-bg;
    color: $danger;
  }

  &--warning &__icon {
    background: $warning-bg;
    color: $warning;
  }

  &__spinner {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    border: 3px solid rgba($accent, 0.15);
    border-top-color: $accent;
    animation: result-spin 0.8s linear infinite;
  }

  &__title {
    @include display($display-sm);
  }

  &__text {
    max-width: 46ch;
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__actions {
    @include flex(row, center, center, 0.6rem);
    flex-wrap: wrap;
    margin-top: 0.6rem;
  }
}

@keyframes result-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
