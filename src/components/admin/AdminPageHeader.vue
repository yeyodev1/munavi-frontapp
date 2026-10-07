<script setup lang="ts">
defineProps<{ title: string; subtitle?: string; back?: string }>()
</script>

<template>
  <header class="phead">
    <div class="phead__titles">
      <RouterLink v-if="back" :to="back" class="phead__back">
        <i class="fa-solid fa-arrow-left"></i> Volver
      </RouterLink>
      <h1 class="phead__title">{{ title }}</h1>
      <p v-if="subtitle" class="phead__subtitle">{{ subtitle }}</p>
    </div>
    <div v-if="$slots.default" class="phead__actions"><slot /></div>
  </header>
</template>

<style scoped lang="scss">
.phead {
  @include flex(row, flex-end, space-between, 1rem);
  flex-wrap: wrap;
  margin-bottom: 1.4rem;

  &__titles {
    flex: 1 1 260px;
  }

  &__back {
    @include flex(row, center, flex-start, 0.4rem);
    font-size: $text-sm;
    font-weight: 600;
    color: $ink-soft;
    margin-bottom: 0.4rem;

    &:hover {
      color: $accent;
    }
  }

  &__title {
    @include display($display-sm, 600);
  }

  &__subtitle {
    margin-top: 0.3rem;
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__actions {
    @include flex(row, center, flex-end, 0.5rem);
    flex-wrap: wrap;
  }
}
</style>
