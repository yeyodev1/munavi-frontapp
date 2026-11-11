<script setup lang="ts">
// "Encuentra lo que tu cuerpo pide": las nueve necesidades con los íconos de la
// diseñadora, grandes y con los fondos de su propuesta 3 (pedido del 5 nov 2026).
import SectionHead from './SectionHead.vue'
import { needs } from '@/config/needs'
import { homeCopy } from '@/config/copy/home'

const copy = homeCopy.categories
</script>

<template>
  <section class="needs">
    <SectionHead
      :eyebrow="copy.eyebrow"
      :title="copy.title"
      link="/tienda"
      :link-label="copy.all"
    />

    <ul class="needs__list">
      <li v-for="need in needs" :key="need.slug" class="needs__item">
        <RouterLink :to="{ path: '/tienda', query: { necesidad: need.slug } }" class="need">
          <span class="need__disc" :style="{ background: need.color }">
            <span
              class="need__icon"
              :style="{ '--icon': `url(${need.icon})` }"
              aria-hidden="true"
            ></span>
          </span>
          <span class="need__name">{{ need.name }}</span>
        </RouterLink>
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.needs {
  @include container;
  padding-top: $space-section;

  // Las nueve a la vista: 3×3 en celular, y en computador en una sola línea.
  &__list {
    list-style: none;
    @include flex(row, flex-start, center, 1.4rem 0.5rem);
    flex-wrap: wrap;
    padding-block: 0.4rem 0.8rem;

    @include from('md') {
      gap: 1.6rem 0.5rem;
    }

    @include from('lg') {
      flex-wrap: nowrap;
      justify-content: space-between;
    }
  }

  &__item {
    flex: 0 0 calc(33.333% - 0.34rem);

    @include from('md') {
      flex: 0 0 8.5rem;
    }

    @include from('lg') {
      flex: 1 1 0;
      min-width: 0;
    }
  }
}

.need {
  @include flex(column, center, flex-start, 0.7rem);
  text-align: center;

  &__disc {
    @include flex(row, center, center);
    width: 6rem;
    height: 6rem;
    border-radius: 50%;
    box-shadow: $shadow-sm;
    @include transition;

    @include from('md') {
      width: 7.5rem;
      height: 7.5rem;
    }

    @include from('xl') {
      width: 8.25rem;
      height: 8.25rem;
    }
  }

  // El SVG entra como máscara: el color del ícono lo decide el CSS, no el archivo.
  &__icon {
    display: block;
    width: 64%;
    height: 64%;
    background: $surface;
    mask: var(--icon) center / contain no-repeat;
    -webkit-mask: var(--icon) center / contain no-repeat;
  }

  &:hover &__disc {
    transform: translateY(-4px) scale(1.03);
    box-shadow: $shadow-md;
  }

  &__name {
    font-size: $text-sm;
    font-weight: 600;
    line-height: 1.25;
    color: $ink;

    @include from('md') {
      font-size: $text-base;
    }
  }
}
</style>
