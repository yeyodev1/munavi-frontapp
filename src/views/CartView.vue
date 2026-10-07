<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { PaymentMethod } from '@/types'
import CartLineItem from '@/components/cart/CartLineItem.vue'
import FreeShippingBar from '@/components/cart/FreeShippingBar.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { useCartStore } from '@/stores/cart'
import { useSettingsStore } from '@/stores/settings'
import { useQuote } from '@/composables/useQuote'
import { money } from '@/utils/price'
import { cartCopy as copy, checkoutCopy } from '@/config/copy/checkout'

const cart = useCartStore()
const settings = useSettingsStore()
const method = ref<PaymentMethod>('card')
const { quote, loading, refresh } = useQuote(method, ['card'])

// Mientras llega la cotización se muestra el estimado local.
const progressBase = computed(() =>
  quote.value ? quote.value.subtotal - quote.value.volumeDiscount : cart.estimate('card'),
)

onMounted(() => {
  settings.load()
  refresh()
})
</script>

<template>
  <div class="cart">
    <header class="cart__head">
      <p class="cart__eyebrow">{{ copy.pageEyebrow }}</p>
      <h1 class="cart__title">{{ copy.title }}</h1>
    </header>

    <EmptyState v-if="cart.isEmpty" icon="fa-solid fa-bag-shopping" :title="copy.emptyTitle" :text="copy.emptyText">
      <RouterLink to="/tienda" class="btn btn--primary">{{ copy.toShop }}</RouterLink>
    </EmptyState>

    <div v-else class="cart__layout">
      <div class="cart__lines">
        <FreeShippingBar :amount="progressBase" />
        <CartLineItem v-for="item in cart.items" :key="`${item.productId}-${item.variantSlug}`" :item="item" />
        <RouterLink to="/tienda" class="cart__continue">
          <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
          {{ copy.continue }}
        </RouterLink>
      </div>

      <aside class="cart__aside" :class="{ 'cart__aside--loading': loading }" :aria-busy="loading">
        <h2 class="cart__aside-title">{{ checkoutCopy.summary.title }}</h2>
        <dl class="cart__totals">
          <div>
            <dt>{{ checkoutCopy.summary.subtotal }}</dt>
            <dd>{{ money(quote?.subtotal ?? cart.estimate('card')) }}</dd>
          </div>
          <div v-if="quote?.volumeDiscount" class="cart__discount">
            <dt>{{ checkoutCopy.summary.volume }}</dt>
            <dd>-{{ money(quote.volumeDiscount) }}</dd>
          </div>
          <div v-if="quote">
            <dt>{{ checkoutCopy.summary.shipping }}</dt>
            <dd>{{ quote.shipping ? money(quote.shipping) : checkoutCopy.summary.free }}</dd>
          </div>
          <div class="cart__total">
            <dt>{{ checkoutCopy.summary.total }}</dt>
            <dd>{{ money(quote?.total ?? cart.estimate('card')) }}</dd>
          </div>
        </dl>
        <p class="cart__note">{{ copy.cardNote }}</p>
        <RouterLink to="/checkout" class="btn btn--primary cart__checkout">
          {{ copy.checkout }}
          <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
        </RouterLink>
      </aside>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cart {
  @include container;
  padding-block: $space-md $space-section;

  &__head {
    @include flex(column, flex-start, flex-start, 0.4rem);
    margin-bottom: $space-md;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-sm);
  }

  &__layout {
    @include flex(column, stretch, flex-start, $space-lg);

    @include from('md') {
      flex-direction: row;
      align-items: flex-start;
    }
  }

  &__lines {
    @include flex(column, stretch, flex-start);
    flex: 1;
    min-width: 0;
  }

  &__continue {
    @include flex(row, center, flex-start, 0.5rem);
    margin-top: 1.2rem;
    font-size: $text-sm;
    font-weight: 600;
    color: $accent;
  }

  &__aside {
    @include card;
    @include flex(column, stretch, flex-start, 0.9rem);
    padding: 1.25rem;
    @include transition(opacity);

    @include from('md') {
      flex: 0 0 340px;
      position: sticky;
      top: 6rem;
    }

    &--loading {
      opacity: 0.6;
    }
  }

  &__aside-title {
    @include display($text-xl, 500);
  }

  &__totals {
    @include flex(column, stretch, flex-start, 0.45rem);
    font-size: $text-sm;

    div {
      @include flex(row, baseline, space-between);
      color: $ink-soft;
    }

    dd {
      font-weight: 600;
      color: $ink;
    }
  }

  &__discount dd {
    color: $rose-deep !important;
  }

  &__total {
    margin-top: 0.4rem;
    padding-top: 0.7rem;
    border-top: 1px dashed $line;
    font-weight: 700;

    dd {
      font-size: $text-xl;
    }
  }

  &__note {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__checkout {
    width: 100%;
  }
}
</style>
