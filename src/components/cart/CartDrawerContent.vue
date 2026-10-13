<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { PaymentMethod } from '@/types'
import CartLineItem from '@/components/cart/CartLineItem.vue'
import FreeShippingBar from '@/components/cart/FreeShippingBar.vue'
import VolumePromoBar from '@/components/cart/VolumePromoBar.vue'
import { useCartStore } from '@/stores/cart'
import { quotedLine, useQuote } from '@/composables/useQuote'
import { money } from '@/utils/price'
import { cartCopy as copy, checkoutCopy } from '@/config/copy/checkout'

/**
 * Líneas y subtotal del panel. Vive solo mientras el panel está abierto, así la
 * cotización (que trae "Compra más, ahorra más") se pide únicamente cuando se ve.
 */
const cart = useCartStore()
const method = ref<PaymentMethod>('card')
const { quote, loading, refresh } = useQuote(method, ['card'])

// Mientras llega la cotización se pinta el estimado local con tarjeta.
const subtotal = computed(() =>
  quote.value ? quote.value.subtotal - quote.value.volumeDiscount : cart.estimate('card'),
)
const promoSaving = computed(() =>
  quote.value?.volumePromo?.percent ? quote.value.volumeDiscount : 0,
)

onMounted(refresh)
</script>

<template>
  <div class="drawer-body">
    <VolumePromoBar class="drawer-body__bar" :status="quote?.volumePromo" />
    <FreeShippingBar :amount="subtotal" />
    <CartLineItem
      v-for="item in cart.items"
      :key="`${item.productId}-${item.variantSlug}`"
      :item="item"
      :quoted="quotedLine(quote, item.productId, item.variantSlug)"
      compact
    />
  </div>

  <footer class="drawer-foot" :class="{ 'drawer-foot--loading': loading }" :aria-busy="loading">
    <div v-if="promoSaving" class="drawer-foot__saving">
      <span>{{ checkoutCopy.summary.volumePromo }}</span>
      <strong>-{{ money(promoSaving) }}</strong>
    </div>
    <div class="drawer-foot__subtotal">
      <span>{{ copy.subtotal }}</span>
      <strong>{{ money(subtotal) }}</strong>
    </div>
    <p class="drawer-foot__note">{{ copy.cardNote }}</p>
    <div class="drawer-foot__actions">
      <RouterLink to="/carrito" class="btn btn--ghost">{{ copy.viewCart }}</RouterLink>
      <RouterLink to="/checkout" class="btn btn--primary">
        {{ copy.checkout }}
        <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
      </RouterLink>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.drawer-body {
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 1rem 1.25rem 0;

  &__bar {
    margin-bottom: 0.6rem;
  }
}

.drawer-foot {
  @include flex(column, stretch, flex-start, 0.4rem);
  padding: 1rem 1.25rem 1.25rem;
  border-top: 1px solid $line;
  background: $surface;
  @include transition(opacity);

  &--loading &__subtotal strong {
    opacity: 0.55;
  }

  &__saving {
    @include flex(row, baseline, space-between);
    font-size: $text-sm;
    font-weight: 600;
    color: $accent-deep;
  }

  &__subtotal {
    @include flex(row, baseline, space-between);
    font-weight: 600;

    strong {
      font-size: $text-lg;
    }
  }

  &__note {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__actions {
    @include flex(row, stretch, flex-start, 0.6rem);
    margin-top: 0.6rem;

    .btn {
      flex: 1;
      padding-inline: 0.8rem;
      white-space: nowrap;
    }
  }
}
</style>
