<script setup lang="ts">
import { computed } from 'vue'
import type { ProductCard } from '@/types'
import PriceBlock from './PriceBlock.vue'
import VolumeTiers from './VolumeTiers.vue'
import { hasPrice, savingsPercent } from '@/utils/price'
import { useAddToCart } from '@/composables/useAddToCart'
import { useSettingsStore } from '@/stores/settings'
import { whatsappLink } from '@/config/site'
import { productCopy as copy } from '@/config/copy/product'

const props = defineProps<{ product: ProductCard }>()

const { addToCart } = useAddToCart()
const settings = useSettingsStore()

const to = computed(() => ({ name: 'Product', params: { slug: props.product.slug } }))
const activeVariants = computed(() => props.product.variants.filter((v) => v.isActive))
const available = computed(() => activeVariants.value.filter((v) => v.inStock))
const soldOut = computed(() => activeVariants.value.length > 0 && available.value.length === 0)
const hasFlavors = computed(() => activeVariants.value.length > 1)
const priced = computed(() => hasPrice(props.product.prices))
const savings = computed(() =>
  priced.value ? savingsPercent(props.product.compareAtPrice, props.product.prices.card) : 0,
)
// Con varios sabores no sabemos cuál le interesa; el sabor solo va si es único.
const askLink = computed(() => {
  const flavor = activeVariants.value.length === 1 ? activeVariants.value[0]?.name : undefined
  return whatsappLink(copy.askPriceMessage(props.product.name, flavor), settings.whatsapp)
})
const image = computed(() => props.product.image || available.value[0]?.image?.url || '')

// Con un solo sabor se agrega directo; con varios, se elige en la ficha.
function quickAdd() {
  const variant = available.value[0]
  if (!variant) return
  const p = props.product
  addToCart({
    productId: p._id,
    slug: p.slug,
    variantSlug: variant.slug,
    snapshot: {
      name: p.name,
      variantName: variant.name,
      image: variant.image?.url || p.image,
      prices: p.prices,
      volumeDiscounts: p.volumeDiscounts,
    },
  })
}
</script>

<template>
  <article class="pcard" :class="{ 'pcard--soldout': soldOut }">
    <RouterLink :to="to" class="pcard__media">
      <img v-if="image" :src="image" :alt="product.name" loading="lazy" class="pcard__img" />
      <span v-else class="pcard__placeholder">
        <i class="fa-solid fa-leaf" aria-hidden="true"></i>
        <span>{{ copy.noImage }}</span>
      </span>

      <span class="pcard__badges">
        <span v-if="soldOut" class="pcard__badge pcard__badge--muted">{{ copy.outOfStock }}</span>
        <span v-else-if="savings" class="pcard__badge pcard__badge--sale">-{{ savings }}%</span>
        <span v-if="product.isBestSeller" class="pcard__badge">{{ copy.bestSeller }}</span>
      </span>
    </RouterLink>

    <div class="pcard__body">
      <p class="pcard__meta">
        <span>{{ product.category?.name }}</span>
        <span v-if="hasFlavors" class="pcard__flavors">{{ copy.flavors(activeVariants.length) }}</span>
      </p>
      <RouterLink :to="to" class="pcard__name">{{ product.name }}</RouterLink>
      <p v-if="product.presentation" class="pcard__presentation">{{ product.presentation }}</p>

      <PriceBlock :prices="product.prices" :compare-at-price="product.compareAtPrice" />
      <VolumeTiers v-if="priced" :tiers="product.volumeDiscounts" compact />

      <a v-if="!priced" :href="askLink" target="_blank" rel="noopener" class="btn btn--whatsapp pcard__cta">
        <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
        {{ copy.askPrice }}
      </a>
      <RouterLink v-else-if="hasFlavors" :to="to" class="btn btn--ghost pcard__cta">
        {{ copy.chooseFlavor }}
      </RouterLink>
      <button v-else class="btn btn--primary pcard__cta" :disabled="soldOut" @click="quickAdd">
        <i class="fa-solid fa-bag-shopping" aria-hidden="true"></i>
        {{ soldOut ? copy.outOfStock : copy.add }}
      </button>
    </div>
  </article>
</template>

<style scoped lang="scss">
.pcard {
  @include flex(column, stretch, flex-start);
  background: $surface;
  border-radius: $radius-md;
  overflow: hidden;
  border: 1px solid rgba($line, 0.7);
  @include transition;

  &:hover {
    box-shadow: $shadow-md;
    transform: translateY(-3px);
  }

  &__media {
    position: relative;
    display: block;
    aspect-ratio: 1;
    background: linear-gradient(160deg, #f6eefa, #fdf1f6);
    overflow: hidden;
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 8%;
    transition: transform 0.6s $ease;
  }

  &:hover &__img {
    transform: scale(1.04);
  }

  &__placeholder {
    @include flex(column, center, center, 0.5rem);
    height: 100%;
    color: rgba($accent, 0.45);
    font-size: $text-xs;

    i {
      font-size: 2rem;
    }
  }

  &__badges {
    position: absolute;
    top: 0.7rem;
    left: 0.7rem;
    @include flex(column, flex-start, flex-start, 0.35rem);
  }

  &__badge {
    font-size: 0.66rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    padding: 0.28rem 0.6rem;
    border-radius: $radius-pill;
    background: $accent;
    color: $surface;

    &--sale {
      background: $rose;
    }

    &--muted {
      background: $ink-soft;
    }
  }

  &__body {
    @include flex(column, stretch, flex-start, 0.45rem);
    padding: 0.9rem 0.9rem 1rem;
    flex: 1;

    @include from('md') {
      padding: 1.1rem 1.15rem 1.2rem;
    }
  }

  &__meta {
    @include flex(row, center, space-between, 0.5rem);
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: $ink-muted;
  }

  &__flavors {
    color: #b8336f;
    text-transform: none;
    letter-spacing: 0;
  }

  &__name {
    font-family: $font-display;
    font-size: $text-lg;
    font-weight: 500;
    line-height: 1.2;
    color: $ink;

    &:hover {
      color: $accent;
    }
  }

  &__presentation {
    font-size: $text-xs;
    color: $ink-muted;
    margin-top: -0.25rem;
  }

  &__cta {
    margin-top: auto;
    padding: 0.7rem 1rem;
    width: 100%;
  }

  &--soldout &__img {
    filter: grayscale(0.6);
    opacity: 0.75;
  }
}
</style>
