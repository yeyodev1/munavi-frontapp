<script setup lang="ts">
import { computed } from 'vue'
import { money } from '@/composables/admin/money'
import type { ProductFlag } from '@/composables/admin/useAdminProducts'
import type { Product } from '@/types'

const props = defineProps<{ product: Product }>()
const emit = defineEmits<{ toggle: [flag: ProductFlag] }>()

const cover = computed(() => props.product.images[0]?.url ?? '')
const categoryName = computed(() =>
  typeof props.product.category === 'string' ? '' : (props.product.category?.name ?? ''),
)
const flavors = computed(() => props.product.variants.filter((v) => v.slug !== 'unico'))

const flags: Array<{ key: ProductFlag; label: string; icon: string }> = [
  { key: 'isPublished', label: 'Publicado', icon: 'fa-solid fa-eye' },
  { key: 'isFeatured', label: 'Destacado', icon: 'fa-solid fa-star' },
  { key: 'isBestSeller', label: 'Más vendido', icon: 'fa-solid fa-fire' },
]
</script>

<template>
  <article class="prow" :class="{ 'prow--draft': !product.isPublished }">
    <RouterLink :to="`/admin/productos/${product._id}`" class="prow__main">
      <span class="prow__thumb">
        <img v-if="cover" :src="cover" alt="" loading="lazy" />
        <i v-else class="fa-regular fa-image"></i>
      </span>
      <span class="prow__info">
        <span class="prow__name">{{ product.name }}</span>
        <span class="prow__meta">
          {{ categoryName
          }}<template v-if="product.presentation"> · {{ product.presentation }}</template>
          <template v-if="flavors.length">
            · {{ flavors.length }} {{ flavors.length === 1 ? 'sabor' : 'sabores' }}</template
          >
        </span>
      </span>
    </RouterLink>

    <div class="prow__price">
      <span class="prow__amount">{{
        product.prices.card ? money(product.prices.card) : 'Sin precio'
      }}</span>
      <span v-if="product.prices.card" class="prow__price-label">con tarjeta</span>
      <s v-if="product.compareAtPrice" class="prow__compare">{{ money(product.compareAtPrice) }}</s>
    </div>

    <div class="prow__flags">
      <button
        v-for="flag in flags"
        :key="flag.key"
        type="button"
        class="prow__flag"
        :class="{ 'prow__flag--on': product[flag.key] }"
        :aria-pressed="product[flag.key]"
        @click="emit('toggle', flag.key)"
      >
        <i :class="flag.icon"></i> {{ flag.label }}
      </button>
    </div>

    <RouterLink
      :to="`/admin/productos/${product._id}`"
      class="prow__edit"
      aria-label="Editar producto"
    >
      <i class="fa-solid fa-pen"></i> <span>Editar</span>
    </RouterLink>
  </article>
</template>

<style scoped lang="scss">
.prow {
  @include card;
  @include flex(column, stretch, flex-start, 0.8rem);
  padding: 0.9rem;

  @include from('lg') {
    flex-direction: row;
    align-items: center;
    gap: 1.2rem;
    padding: 0.8rem 1.1rem;
  }

  &--draft &__thumb {
    opacity: 0.55;
  }

  &__main {
    @include flex(row, center, flex-start, 0.85rem);
    flex: 1 1 auto;
    min-width: 0;
  }

  &__thumb {
    flex: none;
    @include flex(row, center, center);
    width: 56px;
    height: 56px;
    border-radius: $radius-sm;
    background: $sand;
    overflow: hidden;
    color: $ink-muted;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__info {
    @include flex(column, flex-start, center, 0.1rem);
    min-width: 0;
  }

  &__name {
    font-weight: 700;
    line-height: 1.3;
  }

  &__meta {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__price {
    @include flex(row, baseline, flex-start, 0.4rem);
    flex: none;

    @include from('lg') {
      flex-direction: column;
      align-items: flex-end;
      gap: 0;
      width: 7rem;
    }
  }

  &__amount {
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  &__price-label,
  &__compare {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__flags {
    @include flex(row, center, flex-start, 0.35rem);
    flex-wrap: wrap;
    flex: none;
  }

  &__flag {
    @include flex(row, center, center, 0.35rem);
    padding: 0.4rem 0.7rem;
    border-radius: $radius-pill;
    border: 1px solid $line;
    font-size: 0.76rem;
    font-weight: 600;
    color: $ink-muted;
    @include transition(background);

    &--on {
      background: $accent-soft;
      border-color: transparent;
      color: $accent-deep;
    }
  }

  &__edit {
    @include flex(row, center, center, 0.4rem);
    flex: none;
    padding: 0.55rem 1rem;
    border-radius: $radius-pill;
    background: $ink;
    color: $surface;
    font-size: 0.82rem;
    font-weight: 600;

    &:hover {
      background: $accent;
    }
  }
}
</style>
