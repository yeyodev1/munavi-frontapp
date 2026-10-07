<script setup lang="ts">
import { computed } from 'vue'
import QuantityStepper from '@/components/product/QuantityStepper.vue'
import { MAX_QTY, useCartStore, type CartItem } from '@/stores/cart'
import { hasPrice, money, tierFor } from '@/utils/price'
import { cartCopy as copy } from '@/config/copy/checkout'
import { productCopy } from '@/config/copy/product'

const props = withDefaults(defineProps<{ item: CartItem; compact?: boolean }>(), { compact: false })
const emit = defineEmits<{ navigate: [] }>()

const cart = useCartStore()

const qty = computed({
  get: () => props.item.quantity,
  set: (value: number) => cart.setQty(props.item.productId, props.item.variantSlug, value),
})

const tier = computed(() => tierFor(props.item.snapshot.volumeDiscounts, props.item.quantity))
const showVariant = computed(() => props.item.variantSlug !== 'unico' && !!props.item.snapshot.variantName)
// Estimado con tarjeta para pintar; el total real lo da la cotización del servidor.
const lineTotal = computed(() => {
  const subtotal = props.item.snapshot.prices.card * props.item.quantity
  return subtotal - (tier.value ? Math.round((subtotal * tier.value.percent) / 100) : 0)
})
</script>

<template>
  <article class="line" :class="{ 'line--compact': compact }">
    <RouterLink :to="`/producto/${item.slug}`" class="line__media" @click="emit('navigate')">
      <img v-if="item.snapshot.image" :src="item.snapshot.image" :alt="item.snapshot.name" loading="lazy" />
      <i v-else class="fa-solid fa-image" aria-hidden="true"></i>
    </RouterLink>

    <div class="line__body">
      <div class="line__head">
        <div class="line__titles">
          <RouterLink :to="`/producto/${item.slug}`" class="line__name" @click="emit('navigate')">
            {{ item.snapshot.name }}
          </RouterLink>
          <span v-if="showVariant" class="line__variant">{{ item.snapshot.variantName }}</span>
        </div>
        <button
          type="button"
          class="line__remove"
          :aria-label="copy.removeAria(item.snapshot.name)"
          @click="cart.remove(item.productId, item.variantSlug)"
        >
          <i class="fa-solid fa-trash-can" aria-hidden="true"></i>
        </button>
      </div>

      <div class="line__foot">
        <QuantityStepper v-model="qty" :max="MAX_QTY" class="line__qty" />
        <div class="line__price">
          <strong>{{ hasPrice(item.snapshot.prices) ? money(lineTotal) : productCopy.noPrice }}</strong>
          <span v-if="tier" class="line__tier">{{ productCopy.tier(tier.minQty, tier.percent) }}</span>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.line {
  @include flex(row, flex-start, flex-start, 0.9rem);
  padding-block: 1rem;
  border-bottom: 1px solid $line;

  &__media {
    @include flex(row, center, center);
    flex: 0 0 4.8rem;
    height: 4.8rem;
    border-radius: $radius-sm;
    background: $blush;
    overflow: hidden;
    color: rgba($accent, 0.4);

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: 0.2rem;
    }

    @include from('md') {
      flex-basis: 6rem;
      height: 6rem;
    }
  }

  &--compact &__media {
    flex-basis: 4.4rem;
    height: 4.4rem;
  }

  &__body {
    @include flex(column, stretch, flex-start, 0.7rem);
    flex: 1;
    min-width: 0;
  }

  &__head {
    @include flex(row, flex-start, space-between, 0.6rem);
  }

  &__titles {
    @include flex(column, flex-start, flex-start, 0.15rem);
    min-width: 0;
  }

  &__name {
    font-weight: 600;
    font-size: $text-sm;
    line-height: 1.3;

    &:hover {
      color: $accent;
    }
  }

  &__variant {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__remove {
    @include flex(row, center, center);
    flex: 0 0 2rem;
    height: 2rem;
    border-radius: 50%;
    color: $ink-muted;
    font-size: 0.8rem;
    @include transition(color);

    &:hover {
      color: $danger;
    }
  }

  &__foot {
    @include flex(row, center, space-between, 0.6rem);
    flex-wrap: wrap;
  }

  &__qty {
    height: 2.5rem;
  }

  &__price {
    @include flex(column, flex-end, flex-start, 0.1rem);
    text-align: right;

    strong {
      font-size: $text-base;
    }
  }

  &__tier {
    font-size: 0.7rem;
    font-weight: 600;
    color: $rose-deep;
  }
}
</style>
