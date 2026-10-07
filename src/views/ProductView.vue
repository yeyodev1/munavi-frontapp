<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ProductGallery from '@/components/product/ProductGallery.vue'
import PriceBlock from '@/components/product/PriceBlock.vue'
import VolumeTiers from '@/components/product/VolumeTiers.vue'
import FlavorPicker from '@/components/product/FlavorPicker.vue'
import QuantityStepper from '@/components/product/QuantityStepper.vue'
import ProductDetails from '@/components/product/ProductDetails.vue'
import ProductRelated from '@/components/product/ProductRelated.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { useProductDetail } from '@/composables/useProductDetail'
import { useSettingsStore } from '@/stores/settings'
import { whatsappLink } from '@/config/site'
import { productDetailCopy as copy } from '@/config/copy/product'

const route = useRoute()
const settings = useSettingsStore()
const slug = computed(() => String(route.params.slug ?? ''))

const {
  product, loading, error, variants, variantSlug, hasFlavors, inStock, maxQty,
  quantity, images, activeImage, categorySlug, categoryName, load, add, buyNow,
} = useProductDetail(slug)

const askLink = computed(() => whatsappLink(copy.askMessage(product.value?.name ?? ''), settings.whatsapp))
</script>

<template>
  <div class="pdp">
    <div v-if="loading" class="pdp__top pdp__top--loading" aria-busy="true">
      <div class="pdp__shimmer pdp__shimmer--media"></div>
      <div class="pdp__info">
        <div class="pdp__shimmer pdp__shimmer--sm"></div>
        <div class="pdp__shimmer pdp__shimmer--lg"></div>
        <div class="pdp__shimmer pdp__shimmer--md"></div>
      </div>
    </div>

    <EmptyState
      v-else-if="error?.status === 404"
      icon="fa-solid fa-magnifying-glass"
      :title="copy.notFoundTitle"
      :text="copy.notFoundText"
    >
      <RouterLink to="/tienda" class="btn btn--primary">{{ copy.toShop }}</RouterLink>
    </EmptyState>

    <EmptyState v-else-if="error || !product" tone="error" icon="fa-solid fa-plug-circle-xmark" :title="copy.errorTitle" :text="error?.message">
      <button class="btn btn--primary" @click="load">{{ copy.retry }}</button>
    </EmptyState>

    <template v-else>
      <nav class="pdp__crumbs" aria-label="Migas de pan">
        <RouterLink to="/tienda">{{ copy.back }}</RouterLink>
        <template v-if="categorySlug">
          <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
          <RouterLink :to="`/tienda/${categorySlug}`">{{ categoryName }}</RouterLink>
        </template>
      </nav>

      <div class="pdp__top">
        <ProductGallery v-model="activeImage" :images="images" :alt="product.name" class="pdp__gallery" />

        <div class="pdp__info">
          <p v-if="categoryName" class="pdp__eyebrow">{{ categoryName }}</p>
          <h1 class="pdp__name">{{ product.name }}</h1>
          <p v-if="product.presentation" class="pdp__presentation">{{ product.presentation }}</p>
          <p v-if="product.shortDescription" class="pdp__short">{{ product.shortDescription }}</p>

          <PriceBlock :prices="product.prices" :compare-at-price="product.compareAtPrice" size="lg" />
          <VolumeTiers :tiers="product.volumeDiscounts" :quantity="quantity" />

          <FlavorPicker v-if="hasFlavors" v-model="variantSlug" :variants="variants" />

          <div class="pdp__buy">
            <QuantityStepper v-model="quantity" :max="maxQty" class="pdp__qty" />
            <button class="btn btn--primary pdp__add" :disabled="!inStock" @click="add">
              <i class="fa-solid fa-bag-shopping" aria-hidden="true"></i>
              {{ inStock ? copy.addToCart : copy.unavailable }}
            </button>
          </div>
          <button class="btn btn--dark pdp__now" :disabled="!inStock" @click="buyNow">
            {{ copy.buyNow }}
            <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </button>

          <ul class="pdp__perks">
            <li v-for="perk in copy.perks" :key="perk.text">
              <i :class="perk.icon" aria-hidden="true"></i>
              {{ perk.text }}
            </li>
          </ul>
          <a :href="askLink" target="_blank" rel="noopener" class="pdp__ask">
            <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
            {{ copy.ask }}
          </a>
        </div>
      </div>

      <ProductDetails :product="product" class="pdp__details" />

      <ProductRelated v-if="categorySlug" :key="product._id" :category="categorySlug" :exclude-id="product._id" />
    </template>
  </div>
</template>

<style scoped lang="scss">
.pdp {
  @include container;
  padding-block: $space-md $space-section;

  &__crumbs {
    @include flex(row, center, flex-start, 0.5rem);
    font-size: $text-xs;
    color: $ink-muted;
    margin-bottom: $space-md;

    a:hover {
      color: $accent;
    }

    i {
      font-size: 0.55rem;
    }
  }

  &__top {
    @include flex(column, stretch, flex-start, $space-md);

    @include from('md') {
      flex-direction: row;
      align-items: flex-start;
      gap: $space-lg;
    }
  }

  &__gallery {
    @include from('md') {
      flex: 1 1 52%;
      position: sticky;
      top: 6rem;
    }
  }

  &__info {
    @include flex(column, stretch, flex-start, 1.1rem);

    @include from('md') {
      flex: 1 1 48%;
    }
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__name {
    @include display($display-md);
    margin-top: -0.6rem;
  }

  &__presentation {
    font-size: $text-sm;
    color: $ink-muted;
    margin-top: -0.6rem;
  }

  &__short {
    color: $ink-soft;
  }

  &__buy {
    @include flex(row, stretch, flex-start, 0.6rem);
    margin-top: 0.3rem;
  }

  &__qty {
    flex: 0 0 auto;
  }

  &__add {
    flex: 1;
  }

  &__now {
    width: 100%;
    margin-top: -0.4rem;
  }

  &__perks {
    list-style: none;
    @include flex(column, flex-start, flex-start, 0.55rem);
    padding: 1rem 1.1rem;
    border-radius: $radius-md;
    background: rgba($accent, 0.05);
    font-size: $text-sm;
    color: $ink-soft;

    li {
      @include flex(row, baseline, flex-start, 0.6rem);
    }

    i {
      color: $accent;
      width: 1rem;
    }
  }

  &__ask {
    @include flex(row, center, flex-start, 0.5rem);
    font-size: $text-sm;
    font-weight: 600;
    color: #128c4a;

    &:hover {
      text-decoration: underline;
    }
  }

  &__details {
    margin-top: $space-xl;

    @include from('md') {
      max-width: 780px;
    }
  }

  &__shimmer {
    border-radius: $radius-md;
    background: linear-gradient(90deg, #f3edf6 25%, #faf6fb 50%, #f3edf6 75%);
    background-size: 200% 100%;
    animation: shimmer 1.6s linear infinite;
    height: 1.2rem;

    &--media {
      aspect-ratio: 1;
      height: auto;
      border-radius: $radius-lg;

      @include from('md') {
        flex: 1 1 52%;
      }
    }

    &--sm {
      width: 30%;
    }

    &--lg {
      width: 80%;
      height: 2.6rem;
    }

    &--md {
      width: 50%;
      height: 2rem;
    }
  }
}

</style>
