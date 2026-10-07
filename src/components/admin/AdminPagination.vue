<script setup lang="ts">
defineProps<{ pages: number; total?: number }>()
const page = defineModel<number>({ required: true })
</script>

<template>
  <nav v-if="pages > 1" class="pager" aria-label="Paginación">
    <button class="pager__btn" type="button" :disabled="page <= 1" @click="page--">
      <i class="fa-solid fa-chevron-left"></i> Anterior
    </button>
    <span class="pager__info">Página {{ page }} de {{ pages }}</span>
    <button class="pager__btn" type="button" :disabled="page >= pages" @click="page++">
      Siguiente <i class="fa-solid fa-chevron-right"></i>
    </button>
  </nav>
</template>

<style scoped lang="scss">
.pager {
  @include flex(row, center, center, 0.8rem);
  flex-wrap: wrap;
  margin-top: 1.4rem;

  &__btn {
    @include flex(row, center, center, 0.4rem);
    padding: 0.55rem 1rem;
    border: 1px solid $line;
    border-radius: $radius-pill;
    background: $surface;
    font-size: $text-sm;
    font-weight: 600;

    &:hover:not(:disabled) {
      border-color: $accent;
      color: $accent;
    }

    &:disabled {
      opacity: 0.4;
      cursor: default;
    }
  }

  &__info {
    font-size: $text-sm;
    color: $ink-soft;
  }
}
</style>
