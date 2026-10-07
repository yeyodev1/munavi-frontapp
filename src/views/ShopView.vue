<script setup lang="ts">
import { computed } from 'vue'
import ShopFilters from '@/components/shop/ShopFilters.vue'
import ShopPagination from '@/components/shop/ShopPagination.vue'
import ProductGrid from '@/components/product/ProductGrid.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { useShop } from '@/composables/useShop'
import { shopCopy as copy } from '@/config/copy/product'

const {
  categories, category, current, q, page, pages, items, total, loading, error,
  reload, search, clearSearch, goToPage, categoryLink,
} = useShop()

const title = computed(() => current.value?.name ?? copy.title)
const text = computed(() => current.value?.description || copy.text)
const emptyTitle = computed(() => (category.value && !q.value ? copy.emptyCategoryTitle : copy.emptyTitle))
const emptyText = computed(() => (category.value && !q.value ? copy.emptyCategoryText : copy.emptyText))
</script>

<template>
  <div class="shop">
    <header class="shop__head">
      <p class="shop__eyebrow">{{ copy.eyebrow }}</p>
      <h1 class="shop__title">{{ title }}</h1>
      <p class="shop__text">{{ text }}</p>
    </header>

    <ShopFilters v-model:search="search" :categories="categories" :active="category" :link="categoryLink" />

    <p v-if="!loading && !error" class="shop__count">
      {{ copy.results(total) }}
      <template v-if="q">
        · {{ copy.searchingFor }} <strong>"{{ q }}"</strong>
      </template>
    </p>

    <EmptyState
      v-if="error"
      tone="error"
      icon="fa-solid fa-plug-circle-xmark"
      :title="copy.errorTitle"
      :text="error"
      class="shop__state"
    >
      <button class="btn btn--primary" @click="reload">{{ copy.retry }}</button>
    </EmptyState>

    <EmptyState
      v-else-if="!loading && !items.length"
      icon="fa-solid fa-seedling"
      :title="emptyTitle"
      :text="emptyText"
      class="shop__state"
    >
      <button v-if="q" class="btn btn--ghost" @click="clearSearch">{{ copy.clearSearch }}</button>
      <RouterLink v-if="category" to="/tienda" class="btn btn--primary">{{ copy.seeAll }}</RouterLink>
    </EmptyState>

    <template v-else>
      <ProductGrid :items="items" :loading="loading" :skeletons="8" class="shop__grid" />
      <ShopPagination :page="page" :pages="pages" @go="goToPage" />
    </template>
  </div>
</template>

<style scoped lang="scss">
.shop {
  @include container;
  padding-block: $space-lg $space-section;
  @include flex(column, stretch, flex-start, $space-md);

  &__head {
    @include flex(column, flex-start, flex-start, 0.6rem);
    padding: $space-lg $space-md;
    border-radius: $radius-lg;
    background:
      radial-gradient(circle at 90% 10%, rgba($rose, 0.16), transparent 45%),
      linear-gradient(135deg, rgba($accent, 0.1), rgba($accent, 0.03));

    @include from('md') {
      padding: $space-xl $space-lg;
    }
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-md);
  }

  &__text {
    color: $ink-soft;
    max-width: 56ch;
  }

  &__count {
    font-size: $text-sm;
    color: $ink-muted;
    margin-bottom: -0.5rem;

    strong {
      color: $ink;
    }
  }

  &__state {
    margin-top: $space-sm;
  }
}
</style>
