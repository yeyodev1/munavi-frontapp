<script setup lang="ts">
import SectionHead from './SectionHead.vue'
import { homeCopy } from '@/config/copy/home'

const copy = homeCopy.flavors
</script>

<template>
  <section class="flavors">
    <div class="flavors__inner">
      <SectionHead :eyebrow="copy.eyebrow" :title="copy.title" :text="copy.text" />

      <div class="flavors__list">
        <RouterLink
          v-for="item in copy.items"
          :key="item.name"
          :to="{ path: '/tienda', query: { q: item.q } }"
          class="flavor"
        >
          <span class="flavor__detail">{{ item.detail }}</span>
          <h3 class="flavor__name">{{ item.name }}</h3>
          <ul class="flavor__tags">
            <li v-for="tag in item.tags" :key="tag">{{ tag }}</li>
          </ul>
          <span class="flavor__cta">{{ copy.cta }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></span>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.flavors {
  margin-top: $space-section;
  background:
    radial-gradient(circle at 0% 0%, rgba($sage, 0.42), transparent 40%),
    linear-gradient(180deg, $sage-soft, $paper);
  padding-block: $space-xl;

  &__inner {
    @include container;
  }

  &__list {
    @include flex-cards(240px, 1rem);
  }
}

.flavor {
  @include flex(column, flex-start, flex-start, 0.6rem);
  padding: 1.5rem;
  border-radius: $radius-lg;
  background: $surface;
  box-shadow: $shadow-sm;
  @include transition;

  &:hover {
    box-shadow: $shadow-md;
    transform: translateY(-3px);
  }

  &__detail {
    @include eyebrow;
    color: $accent;
  }

  &__name {
    @include display($display-sm, 700);
    color: $accent-deep;
  }

  &__tags {
    list-style: none;
    @include flex(row, center, flex-start, 0.4rem);
    flex-wrap: wrap;

    li {
      font-size: $text-xs;
      font-weight: 600;
      padding: 0.35rem 0.75rem;
      border-radius: $radius-pill;
      background: $sage-soft;
      color: $accent-deep;
    }
  }

  &__cta {
    margin-top: auto;
    padding-top: 0.5rem;
    font-size: $text-sm;
    font-weight: 700;
    color: $accent;
  }
}
</style>
