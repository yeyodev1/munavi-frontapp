<script setup lang="ts">
// Bloque "Somos Munavi" de la web anterior: salvia, firma de pincel y hojas.
// En el home cierra la curva del hero; en /nosotros hace de encabezado.
import LeafDecor from '@/components/decor/LeafDecor.vue'
import { homeCopy } from '@/config/copy/home'

withDefaults(defineProps<{ as?: 'h1' | 'h2'; cta?: boolean }>(), { as: 'h2', cta: true })

const copy = homeCopy.somos
</script>

<template>
  <section class="somos">
    <LeafDecor variant="palm" class="somos__leaf somos__leaf--a" />
    <LeafDecor variant="monstera" class="somos__leaf somos__leaf--b" />

    <div class="somos__inner">
      <component :is="as" class="somos__title">
        <span class="somos__script">{{ copy.script }}</span>
        <span class="somos__name">{{ copy.name }}</span>
      </component>
      <p class="somos__text">{{ copy.text }}</p>
      <RouterLink v-if="cta" :to="copy.to" class="btn btn--primary btn--caps somos__cta">{{
        copy.cta
      }}</RouterLink>
    </div>
  </section>
</template>

<style scoped lang="scss">
.somos {
  position: relative;
  overflow: hidden;
  background: $sage;
  padding-block: $space-lg $space-xl;

  @include from('md') {
    padding-block: $space-xl;
  }

  &__inner {
    @include container(880px);
    position: relative;
    z-index: 1;
    @include flex(column, flex-start, flex-start, 1.2rem);

    @include from('md') {
      align-items: center;
      text-align: center;
    }
  }

  &__title {
    @include flex(column, flex-start, flex-start);

    @include from('md') {
      align-items: center;
    }
  }

  &__script {
    @include script(clamp(5rem, 3rem + 6vw, 8rem), $accent-deep);
    margin-left: -0.08em;
  }

  // Blanco sobre salvia como en la marca; la sombra suave le da lectura.
  &__name {
    font-family: $font-display;
    font-size: clamp(2.8rem, 1.8rem + 4vw, 4.8rem);
    font-weight: 700;
    line-height: 0.9;
    color: $surface;
    margin: -0.35em 0 0 0.9em;
    text-shadow: 0 2px 14px rgba($accent-deep, 0.35);

    @include from('md') {
      margin-left: 2.2em;
    }
  }

  &__text {
    font-size: $text-lg;
    line-height: 1.65;
    color: darken($accent, 18%);
    max-width: 60ch;
  }

  &__cta {
    margin-top: 0.6rem;
  }

  &__leaf {
    position: absolute;
    z-index: 0;

    &--a {
      width: clamp(100px, 18vw, 250px);
      top: -60px;
      right: -20px;
      transform: rotate(-20deg);
    }

    &--b {
      width: clamp(90px, 13vw, 180px);
      bottom: -50px;
      left: -40px;
      transform: rotate(40deg);
      opacity: 0.55;
      display: none;

      @include from('md') {
        display: block;
      }
    }
  }
}
</style>
