<script setup lang="ts">
// "Encuentra lo que tu cuerpo pide": las nueve necesidades con los íconos de
// la diseñadora (un solo color, como pidió Nathalie el 27 oct 2026).
import SectionHead from './SectionHead.vue'
import { needs } from '@/config/needs'
import { homeCopy } from '@/config/copy/home'

const copy = homeCopy.categories
</script>

<template>
  <section class="needs">
    <SectionHead :eyebrow="copy.eyebrow" :title="copy.title" link="/tienda" :link-label="copy.all" />

    <ul class="needs__list">
      <li v-for="need in needs" :key="need.slug" class="needs__item">
        <RouterLink :to="{ path: '/tienda', query: { necesidad: need.slug } }" class="need">
          <span class="need__disc">
            <span class="need__icon" :style="{ '--icon': `url(${need.icon})` }" aria-hidden="true"></span>
          </span>
          <span class="need__name">{{ need.name }}</span>
        </RouterLink>
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
// Verde oliva de las piezas de la diseñadora (íconos y "Confianza en Munavi").
$olive-brand: #7d895b;

.needs {
  @include container;
  padding-top: $space-section;

  // Fila con scroll en celular; en computador entran las nueve en una línea.
  &__list {
    list-style: none;
    @include flex(row, flex-start, flex-start, 0.9rem);
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding-inline: 1.25rem;
    margin-inline: -1.25rem;
    padding: 0.4rem 1.25rem 0.8rem;
    scrollbar-width: none;

    @include from('md') {
      flex-wrap: wrap;
      justify-content: center;
      gap: 1.2rem 0.5rem;
      overflow: visible;
      margin-inline: 0;
      padding-inline: 0;
    }

    @include from('lg') {
      flex-wrap: nowrap;
      justify-content: space-between;
    }
  }

  &__item {
    flex: 0 0 6.2rem;
    scroll-snap-align: start;

    @include from('md') {
      flex: 0 0 7.2rem;
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
    width: 4.6rem;
    height: 4.6rem;
    border-radius: 50%;
    background: $olive-brand;
    box-shadow: $shadow-sm;
    @include transition;

    @include from('md') {
      width: 5.4rem;
      height: 5.4rem;
    }
  }

  // El SVG entra como máscara: el color del ícono lo decide el CSS, no el archivo.
  &__icon {
    display: block;
    width: 62%;
    height: 62%;
    background: $surface;
    mask: var(--icon) center / contain no-repeat;
    -webkit-mask: var(--icon) center / contain no-repeat;
  }

  &:hover &__disc {
    background: $accent;
    transform: translateY(-3px);
    box-shadow: $shadow-md;
  }

  &__name {
    font-size: $text-sm;
    font-weight: 500;
    line-height: 1.25;
    color: $ink-soft;
  }
}
</style>
