<script setup lang="ts">
import SectionHead from './SectionHead.vue'
import { homeCopy } from '@/config/copy/home'

const copy = homeCopy.flavors
</script>

<template>
  <section class="flavors">
    <div class="flavors__inner">
      <SectionHead :eyebrow="copy.eyebrow" :title="copy.title" :text="copy.text" />

      <ul class="flavors__row">
        <li v-for="item in copy.items" :key="item.slug">
          <RouterLink :to="{ path: '/tienda', query: { q: item.name } }" class="flavor">
            <span class="flavor__disc" :style="{ background: item.color, color: item.ink }">
              <img v-if="item.image" :src="item.image" :alt="item.name" class="flavor__img" loading="lazy" />
              <span v-else class="flavor__initial" aria-hidden="true">{{ item.name.charAt(0) }}</span>
            </span>
            <span class="flavor__name">{{ item.name }}</span>
          </RouterLink>
        </li>
      </ul>

      <h3 class="flavors__lines-title">{{ copy.linesTitle }}</h3>
      <ul class="flavors__lines">
        <li v-for="line in copy.lines" :key="line.slug">
          <RouterLink :to="`/tienda/${line.slug}`" class="line">
            <span class="line__icon"><i :class="line.icon" aria-hidden="true"></i></span>
            <span class="line__copy">
              <span class="line__name">{{ line.name }}</span>
              <span class="line__text">{{ line.text }}</span>
            </span>
            <i class="fa-solid fa-arrow-right line__arrow" aria-hidden="true"></i>
          </RouterLink>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped lang="scss">
.flavors {
  margin-top: $space-section;
  padding-block: $space-xl;
  background: linear-gradient(180deg, $sage-soft, $paper);

  &__inner {
    @include container;
  }

  // Fila con scroll en celular; en desktop entran los ocho.
  &__row {
    list-style: none;
    @include flex(row, flex-start, flex-start, 1rem);
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding-inline: 1.25rem;
    margin-inline: -1.25rem;
    padding: 0.4rem 1.25rem 0.8rem;

    > li {
      flex: 0 0 5.6rem;
      scroll-snap-align: start;
    }

    @include from('md') {
      flex-wrap: wrap;
      justify-content: space-between;
      overflow: visible;
      margin-inline: 0;
      padding-inline: 0;

      > li {
        flex: 1 1 0;
        min-width: 6rem;
      }
    }
  }

  &__lines-title {
    @include eyebrow;
    margin: $space-lg 0 $space-sm;
  }

  &__lines {
    list-style: none;
    @include flex-cards(240px, 1rem);
  }
}

.flavor {
  @include flex(column, center, flex-start, 0.6rem);
  text-align: center;

  &__disc {
    @include flex(row, center, center);
    width: 5.2rem;
    height: 5.2rem;
    border-radius: 50%;
    box-shadow: $shadow-sm;
    overflow: hidden;
    @include transition(transform);

    @include from('md') {
      width: 6.5rem;
      height: 6.5rem;
    }
  }

  &:hover &__disc {
    transform: translateY(-3px) scale(1.04);
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  &__initial {
    font-family: $font-script;
    font-size: 2.2rem;
    line-height: 1;
  }

  &__name {
    font-size: $text-sm;
    font-weight: 600;
    color: $ink;
  }
}

.line {
  @include flex(row, center, flex-start, 0.9rem);
  padding: 1rem 1.2rem;
  border-radius: $radius-md;
  background: $surface;
  border: 1px solid $line;
  @include transition;

  &:hover {
    border-color: $sage;
    box-shadow: $shadow-sm;
  }

  &__icon {
    @include flex(row, center, center);
    flex: 0 0 2.6rem;
    height: 2.6rem;
    border-radius: 50%;
    background: $accent-soft;
    color: $accent-deep;
  }

  &__copy {
    @include flex(column, flex-start, flex-start, 0.15rem);
    flex: 1;
  }

  &__name {
    font-weight: 700;
    color: $ink;
  }

  &__text {
    font-size: $text-xs;
    color: $ink-soft;
  }

  &__arrow {
    font-size: 0.8rem;
    color: $accent;
    @include transition(transform);
  }

  &:hover &__arrow {
    transform: translateX(3px);
  }
}
</style>
