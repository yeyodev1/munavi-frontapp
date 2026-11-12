<script setup lang="ts">
// "Compra más, ahorra más" (Arquitectura Comercial – Propuesta 03): sección propia
// después de destacados, con el banner de la diseñadora y los packs de cada producto.
import { computed } from 'vue'
import type { ProductCard } from '@/types'
import { useProducts } from '@/composables/useCatalog'
import { useSettingsStore } from '@/stores/settings'
import { bundleOffers, money } from '@/utils/price'
import { homeCopy } from '@/config/copy/home'

const copy = homeCopy.volumePromo
const settings = useSettingsStore()
// shortcut: trae los primeros 48 publicados; si el catálogo crece, filtrar en el API.
const { items } = useProducts(() => ({ limit: 48 }))

// Orden y sabor los elige Munavi en el panel; sin vitrina, los primeros con pack.
const packs = computed(() => {
  if (!settings.bundlesActive) return []
  const bySlug = new Map(items.value.map((p) => [p.slug, p]))
  const chosen = settings.packShowcase.length
    ? settings.packShowcase.map((s) => ({ product: bySlug.get(s.product), variant: s.variant }))
    : items.value.map((product) => ({ product, variant: '' }))
  return (
    chosen
      .filter((x): x is { product: ProductCard; variant: string } => !!x.product)
      .map(({ product, variant }) => {
        const flavor = product.variants.find((v) => v.slug === variant)
        return {
          product,
          variant: flavor?.slug ?? '',
          image: flavor?.image?.url || product.image,
          best: bundleOffers(product.bundlePrices, product.prices.card).pop(),
        }
      })
      .filter((x) => x.best)
      // Dos filas de cinco en computador; el resto está en la tienda.
      .slice(0, 10)
  )
})
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
        <li v-for="{ product, variant, image, best } in packs" :key="product._id + variant">
          <RouterLink
            :to="{
              name: 'Product',
              params: { slug: product.slug },
              query: variant ? { sabor: variant } : {},
            }"
            class="pack"
          >
            <span class="pack__badge">-{{ Math.round(best!.percent) }}%</span>
            <img v-if="image" :src="image" :alt="product.name" loading="lazy" class="pack__img" />
            <strong class="pack__name">{{ product.name }}</strong>
            <span class="pack__unit">
              <small>{{ copy.perUnit }}</small>
              {{ money(best!.unit) }}
            </span>
            <span class="pack__taking">{{ copy.taking(best!.qty) }}</span>
            <span class="pack__cta">
              {{ copy.see }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
            </span>
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
  @include flex(column, center, flex-start, 0.35rem);
  padding: 0.9rem 0.8rem 1rem;
  border-radius: $radius-md;
  background: $surface;
  border: 1px solid rgba($line, 0.7);
  text-align: center;
  @include transition;

  &:hover {
    border-color: $accent;
    box-shadow: $shadow-md;
  }

  &__badge {
    position: absolute;
    top: 0.7rem;
    left: 0.7rem;
    font-size: $text-sm;
    font-weight: 800;
    color: $surface;
    background: $sale;
    padding: 0.15rem 0.55rem;
    border-radius: $radius-pill;
  }

  &__img {
    width: 100%;
    aspect-ratio: 1;
    object-fit: contain;
  }

  // Altura fija de dos líneas: así precios y enlaces quedan alineados en la fila.
  &__name {
    @include flex(column, center, center);
    min-height: 2.6em;
    font-weight: 700;
    line-height: 1.25;
    color: $ink;
  }

  &__unit {
    @include flex(column, center, center, 0);
    width: 100%;
    margin-top: auto;
    padding: 0.45rem 0.5rem;
    border-radius: $radius-sm;
    background: rgba($accent, 0.12);
    font-size: clamp(1.35rem, 1.2rem + 0.5vw, 1.65rem);
    font-weight: 800;
    line-height: 1.1;
    color: $ink;

    small {
      font-size: $text-xs;
      font-weight: 600;
      color: $ink-soft;
    }
  }

  &__taking {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__cta {
    font-size: $text-sm;
    font-weight: 700;
    color: $accent;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
}
</style>
