<script setup lang="ts">
// "Compra más, ahorra más" (Arquitectura Comercial – Propuesta 03): sección propia
// después de destacados, con el banner de la diseñadora y los packs de cada producto.
import { computed } from 'vue'
import { useProducts } from '@/composables/useCatalog'
import { bundleOffers, money } from '@/utils/price'
import { homeCopy } from '@/config/copy/home'

const copy = homeCopy.volumePromo
// shortcut: trae los primeros 48 publicados; si el catálogo crece, filtrar en el API.
const { items } = useProducts(() => ({ limit: 48 }))

const packs = computed(() =>
  items.value
    .map((p) => ({ product: p, best: bundleOffers(p.bundlePrices, p.prices.card).pop() }))
    .filter((x) => x.best)
    // Dos filas en computador; el resto está en la tienda.
    .slice(0, 10),
)
</script>

<template>
  <section v-if="packs.length" class="vpromo">
    <a href="#packs" class="vpromo__banner">
      <picture>
        <source media="(max-width: 767px)" srcset="/brand/banner-compra-mas-mobile.webp" />
        <img src="/brand/banner-compra-mas-desktop.webp" :alt="copy.bannerAlt" loading="lazy" />
      </picture>
    </a>

    <div id="packs" class="vpromo__packs">
      <header class="vpromo__head">
        <h2 class="vpromo__title">{{ copy.title }}</h2>
        <p class="vpromo__text">{{ copy.text }}</p>
      </header>

      <ul class="vpromo__list">
        <li v-for="{ product, best } in packs" :key="product._id">
          <RouterLink :to="{ name: 'Product', params: { slug: product.slug } }" class="pack">
            <span class="pack__badge">-{{ Math.round(best!.percent) }}%</span>
            <img
              v-if="product.image"
              :src="product.image"
              :alt="product.name"
              loading="lazy"
              class="pack__img"
            />
            <strong class="pack__name">{{ product.name }}</strong>
            <span class="pack__deal">
              {{ copy.units(best!.qty) }} · <b>{{ copy.unit(money(best!.unit)) }}</b>
            </span>
            <span class="pack__save">{{ copy.save(best!.percent) }}</span>
            <span class="pack__cta"
              >{{ copy.see }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i
            ></span>
          </RouterLink>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped lang="scss">
.vpromo {
  @include container;
  padding-top: $space-section;
  @include flex(column, stretch, flex-start, $space-md);

  &__banner {
    display: block;
    overflow: hidden;
    border-radius: $radius-lg;
    box-shadow: $shadow-sm;

    img {
      display: block;
      width: 100%;
      height: auto;
      aspect-ratio: 2 / 3;
      object-fit: cover;

      @include from('md') {
        aspect-ratio: 12 / 5;
      }
    }
  }

  &__packs {
    scroll-margin-top: 6rem;
  }

  &__head {
    @include flex(column, flex-start, flex-start, 0.3rem);
    margin-bottom: 1rem;
  }

  &__title {
    @include display($display-sm);
    color: $accent-deep;
  }

  &__text {
    color: $ink-soft;
  }

  // Fila deslizable en celular; en computador se acomodan en varias filas.
  &__list {
    list-style: none;
    @include flex(row, stretch, flex-start, 0.8rem);
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    margin-inline: -1.25rem;
    padding: 0.3rem 1.25rem 0.8rem;
    scrollbar-width: none;

    > li {
      flex: 0 0 11.5rem;
      scroll-snap-align: start;
    }

    @include from('lg') {
      flex-wrap: wrap;
      overflow: visible;
      margin-inline: 0;
      padding-inline: 0;

      > li {
        flex: 0 0 calc(20% - 0.64rem);
      }
    }
  }
}

.pack {
  position: relative;
  height: 100%;
  @include flex(column, flex-start, flex-start, 0.3rem);
  padding: 0.9rem;
  border-radius: $radius-md;
  background: $surface;
  border: 1px solid rgba($line, 0.7);
  @include transition;

  &:hover {
    border-color: $accent;
    box-shadow: $shadow-md;
  }

  &__badge {
    position: absolute;
    top: 0.7rem;
    left: 0.7rem;
    font-size: $text-xs;
    font-weight: 800;
    color: $surface;
    background: $sale;
    padding: 0.15rem 0.5rem;
    border-radius: $radius-pill;
  }

  &__img {
    align-self: center;
    width: 100%;
    aspect-ratio: 1;
    object-fit: contain;
    margin-bottom: 0.3rem;
  }

  &__name {
    font-weight: 700;
    color: $ink;
    line-height: 1.25;
  }

  &__deal {
    font-size: $text-sm;
    color: $ink-soft;

    b {
      color: $accent-deep;
    }
  }

  &__save {
    font-size: $text-sm;
    font-weight: 700;
    color: $sale;
  }

  &__cta {
    margin-top: auto;
    padding-top: 0.3rem;
    font-size: $text-sm;
    font-weight: 700;
    color: $accent;
  }
}
</style>
