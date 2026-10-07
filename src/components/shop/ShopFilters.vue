<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import type { Category } from '@/types'
import { shopCopy as copy } from '@/config/copy/product'

defineProps<{
  categories: Category[]
  active: string
  link: (slug: string) => RouteLocationRaw
}>()
const search = defineModel<string>('search', { required: true })
</script>

<template>
  <div class="filters">
    <nav class="filters__chips" :aria-label="copy.eyebrow">
      <RouterLink :to="link('')" class="filters__chip" :class="{ 'filters__chip--active': !active }">
        {{ copy.all }}
      </RouterLink>
      <RouterLink
        v-for="cat in categories"
        :key="cat._id"
        :to="link(cat.slug)"
        class="filters__chip"
        :class="{ 'filters__chip--active': active === cat.slug }"
      >
        {{ cat.name }}
      </RouterLink>
    </nav>

    <label class="filters__search">
      <span class="visually-hidden">{{ copy.searchLabel }}</span>
      <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
      <input v-model="search" type="search" :placeholder="copy.searchPlaceholder" />
      <button v-if="search" type="button" class="filters__clear" :aria-label="copy.clearSearch" @click="search = ''">
        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
      </button>
    </label>
  </div>
</template>

<style scoped lang="scss">
.filters {
  @include flex(column, stretch, flex-start, 1rem);

  @include from('lg') {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  &__chips {
    @include flex(row, center, flex-start, 0.5rem);
    overflow-x: auto;
    margin-inline: -1.25rem;
    padding-inline: 1.25rem;
    padding-bottom: 0.25rem;
    scrollbar-width: none;

    @include from('md') {
      flex-wrap: wrap;
      margin-inline: 0;
      padding-inline: 0;
    }
  }

  &__chip {
    flex: 0 0 auto;
    font-size: $text-sm;
    font-weight: 500;
    padding: 0.5rem 1.05rem;
    border-radius: $radius-pill;
    border: 1px solid $line;
    background: $surface;
    color: $ink-soft;
    white-space: nowrap;
    @include transition;

    &:hover {
      border-color: $accent;
      color: $accent;
    }

    &--active {
      background: $accent;
      border-color: $accent;
      color: $surface;

      &:hover {
        color: $surface;
      }
    }
  }

  &__search {
    position: relative;
    margin: 0;

    @include from('lg') {
      flex: 0 0 300px;
    }

    > i {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: $ink-muted;
      font-size: 0.85rem;
    }

    input {
      padding-left: 2.6rem;
      padding-right: 2.6rem;
      border-radius: $radius-pill;
    }
  }

  &__clear {
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    width: 2rem;
    height: 2rem;
    color: $ink-muted;
  }
}
</style>
