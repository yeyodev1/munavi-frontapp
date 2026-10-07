<script setup lang="ts">
import { shopCopy as copy } from '@/config/copy/product'

defineProps<{ page: number; pages: number }>()
const emit = defineEmits<{ go: [page: number] }>()
</script>

<template>
  <nav v-if="pages > 1" class="pager" aria-label="Paginación">
    <button class="btn btn--ghost pager__btn" :disabled="page <= 1" @click="emit('go', page - 1)">
      <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
      {{ copy.prev }}
    </button>
    <span class="pager__status">{{ copy.page(page, pages) }}</span>
    <button class="btn btn--ghost pager__btn" :disabled="page >= pages" @click="emit('go', page + 1)">
      {{ copy.next }}
      <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
    </button>
  </nav>
</template>

<style scoped lang="scss">
.pager {
  @include flex(row, center, center, 1rem);
  margin-top: $space-lg;

  &__btn {
    padding: 0.6rem 1.1rem;
  }

  &__status {
    font-size: $text-sm;
    color: $ink-muted;
  }
}
</style>
