<script setup lang="ts">
// "Compra más, ahorra más" de un producto: 1 unidad a precio regular y cada pack
// con precio normal, promocional, ahorro y precio por unidad (pedido de Munavi, 5 nov 2026).
import { computed } from 'vue'
import type { BundlePrice } from '@/types'
import { bundleFor, bundleOffers, money } from '@/utils/price'
import { productCopy as copy } from '@/config/copy/product'

const props = withDefaults(
  defineProps<{
    bundles: BundlePrice[]
    unitPrice: number
    quantity?: number
    compact?: boolean
  }>(),
  { quantity: 0, compact: false },
)
const emit = defineEmits<{ select: [qty: number] }>()

const offers = computed(() => bundleOffers(props.bundles, props.unitPrice))
const active = computed(() => bundleFor(props.bundles, props.quantity)?.qty ?? 1)
const best = computed(() => offers.value[offers.value.length - 1])
</script>

<template>
  <p v-if="compact && best" class="bundles-compact">
    <i class="fa-solid fa-tags" aria-hidden="true"></i>
    {{ copy.bundleFrom(money(best.unit), best.percent) }}
  </p>

  <section v-else-if="offers.length" class="bundles" :aria-label="copy.bundlesTitle">
    <header class="bundles__head">
      <h2 class="bundles__title">{{ copy.bundlesTitle }}</h2>
      <p class="bundles__hint">{{ copy.bundlesHint }}</p>
    </header>

    <ul class="bundles__list">
      <li>
        <button
          type="button"
          class="offer"
          :class="{ 'offer--active': active === 1 }"
          :aria-pressed="active === 1"
          @click="emit('select', 1)"
        >
          <span class="offer__qty">{{ copy.bundleUnits(1) }}</span>
          <strong class="offer__promo">{{ money(unitPrice) }}</strong>
          <span class="offer__line">{{ copy.bundleRegular }}</span>
        </button>
      </li>
      <li v-for="offer in offers" :key="offer.qty">
        <button
          type="button"
          class="offer"
          :class="{ 'offer--active': active === offer.qty }"
          :aria-pressed="active === offer.qty"
          @click="emit('select', offer.qty)"
        >
          <span class="offer__badge">-{{ Math.round(offer.percent) }}%</span>
          <span class="offer__qty">{{ copy.bundleUnits(offer.qty) }}</span>
          <s class="offer__normal">
            <span class="visually-hidden">{{ copy.bundleNormal }}:</span>{{ money(offer.normal) }}
          </s>
          <strong class="offer__promo">
            <span class="visually-hidden">{{ copy.bundlePromo }}:</span>{{ money(offer.promo) }}
          </strong>
          <span class="offer__save">{{ copy.bundleSave(money(offer.save), offer.percent) }}</span>
          <span class="offer__line">{{ copy.bundleUnit(money(offer.unit)) }}</span>
        </button>
      </li>
    </ul>

    <p class="bundles__legal">
      <span>{{ copy.taxIncluded }}</span>
      <span aria-hidden="true">|</span>
      <span>{{ copy.freeShipping }}</span>
    </p>
  </section>
</template>

<style scoped lang="scss">
.bundles-compact {
  @include flex(row, center, flex-start, 0.35rem);
  font-size: 0.75rem;
  font-weight: 700;
  color: $accent;
}

.bundles {
  @include flex(column, stretch, flex-start, 0.75rem);
  padding: 1rem;
  border-radius: $radius-md;
  background: $sage-soft;

  &__title {
    @include display(1.35rem);
    color: $accent-deep;
  }

  &__hint {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__list {
    list-style: none;
    // Tres por fila en la ficha; dos en celular angosto.
    @include flex-cards(130px, 0.6rem);
  }

  &__legal {
    @include flex(row, center, center, 0.5rem);
    font-size: $text-xs;
    font-weight: 600;
    color: $accent-deep;
  }
}

.offer {
  position: relative;
  width: 100%;
  height: 100%;
  @include flex(column, flex-start, flex-start, 0.1rem);
  padding: 0.8rem 0.8rem 0.7rem;
  border-radius: $radius-sm;
  border: 2px solid transparent;
  background: $surface;
  text-align: left;
  box-shadow: $shadow-sm;
  @include transition;

  &:hover {
    border-color: rgba($accent, 0.4);
  }

  &--active {
    border-color: $accent;
    box-shadow: 0 0 0 3px rgba($accent, 0.15);
  }

  &__badge {
    position: absolute;
    top: 0.55rem;
    right: 0.55rem;
    font-size: 0.7rem;
    font-weight: 700;
    color: $surface;
    background: $sale;
    padding: 0.12rem 0.45rem;
    border-radius: $radius-pill;
  }

  &__qty {
    // Deja sitio al rótulo de % de la esquina.
    padding-right: 2.8rem;
    font-weight: 700;
    color: $ink;
  }

  &__normal {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__promo {
    font-size: 1.2rem;
    font-weight: 800;
    color: $accent-deep;
  }

  &__save {
    font-size: 0.72rem;
    font-weight: 700;
    color: $sale;
    line-height: 1.3;
  }

  &__line {
    font-size: $text-xs;
    color: $ink-soft;
  }
}
</style>
