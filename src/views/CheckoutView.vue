<script setup lang="ts">
import { computed } from 'vue'
import CheckoutDetails from '@/components/checkout/CheckoutDetails.vue'
import PaymentMethods from '@/components/checkout/PaymentMethods.vue'
import CouponField from '@/components/checkout/CouponField.vue'
import OrderSummary from '@/components/checkout/OrderSummary.vue'
import CardPaymentSection from '@/components/checkout/CardPaymentSection.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { useCartStore } from '@/stores/cart'
import { useCheckout } from '@/composables/useCheckout'
import { money } from '@/utils/price'
import { cartCopy, checkoutCopy as copy } from '@/config/copy/checkout'

const cart = useCartStore()
const {
  method, quotes, quote, couponError, loading, error, refresh, applyCoupon, removeCoupon,
  form, errors, check, recheck, submitting, renewing, cardUnavailable, payment, canSubmit, submit, renewPayment,
} = useCheckout()

const submitLabel = computed(() => {
  if (submitting.value) return copy.processing
  if (method.value !== 'card') return copy.confirm
  return quote.value ? copy.pay(money(quote.value.total)) : copy.confirm
})
</script>

<template>
  <div class="checkout">
    <CardPaymentSection
      v-if="payment"
      :order="payment.order"
      :payphone="payment.payphone"
      :renewing="renewing"
      @renew="renewPayment"
    />

    <EmptyState
      v-else-if="cart.isEmpty"
      icon="fa-solid fa-bag-shopping"
      :title="cartCopy.emptyTitle"
      :text="cartCopy.emptyText"
    >
      <RouterLink to="/tienda" class="btn btn--primary">{{ cartCopy.toShop }}</RouterLink>
    </EmptyState>

    <template v-else>
      <header class="checkout__head">
        <p class="checkout__eyebrow">{{ copy.eyebrow }}</p>
        <h1 class="checkout__title">{{ copy.title }}</h1>
        <p class="checkout__secure">
          <i class="fa-solid fa-lock" aria-hidden="true"></i>
          {{ copy.secure }}
        </p>
      </header>

      <form class="checkout__layout" novalidate @submit.prevent="submit">
        <div class="checkout__main">
          <CheckoutDetails :form="form" :errors="errors" @blur="check" @input="recheck" />
          <PaymentMethods v-model="method" :quotes="quotes" :loading="loading" :card-unavailable="cardUnavailable" />
        </div>

        <aside class="checkout__aside">
          <CouponField
            class="checkout__coupon"
            :applied="quote?.coupon ?? null"
            :error="couponError"
            :loading="loading"
            @apply="applyCoupon"
            @remove="removeCoupon"
          />

          <div v-if="error && !quote" class="checkout__error" role="alert">
            <p>{{ error.message || copy.quoteError }}</p>
            <button type="button" class="btn btn--ghost" @click="refresh">{{ copy.retryQuote }}</button>
          </div>

          <div v-else-if="!quote" class="checkout__skeleton" aria-busy="true">
            <span v-for="n in 4" :key="n"></span>
          </div>

          <OrderSummary
            v-else
            :items="quote.items"
            :subtotal="quote.subtotal"
            :volume-discount="quote.volumeDiscount"
            :coupon-discount="quote.couponDiscount"
            :coupon-code="quote.coupon?.code"
            :shipping="quote.shipping"
            :total="quote.total"
            :loading="loading"
          >
            <p v-if="error" class="checkout__inline-error" role="alert">
              {{ error.message }}
              <button type="button" @click="refresh">{{ copy.retryQuote }}</button>
            </p>
            <button type="submit" class="btn btn--primary checkout__submit" :disabled="!canSubmit">
              <i v-if="submitting" class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
              <i v-else class="fa-solid fa-lock" aria-hidden="true"></i>
              {{ submitLabel }}
            </button>
          </OrderSummary>
        </aside>
      </form>
    </template>
  </div>
</template>

<style scoped lang="scss">
.checkout {
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

  &__secure {
    @include flex(row, center, flex-start, 0.45rem);
    font-size: $text-sm;
    color: $ink-soft;

    i {
      color: $accent;
    }
  }

  &__layout {
    @include flex(column, stretch, flex-start, $space-lg);

    @include from('md') {
      flex-direction: row;
      align-items: flex-start;
    }
  }

  &__main {
    @include flex(column, stretch, flex-start, $space-lg);
    flex: 1;
    min-width: 0;
  }

  &__aside {
    @include flex(column, stretch, flex-start, 1rem);

    @include from('md') {
      flex: 0 0 380px;
      position: sticky;
      top: 6rem;
    }
  }

  &__coupon {
    padding-inline: 0.25rem;
  }

  &__submit {
    width: 100%;
    padding-block: 1rem;
    font-size: 0.95rem;
  }

  &__error {
    @include flex(column, flex-start, flex-start, 0.7rem);
    padding: 1.25rem;
    border-radius: $radius-md;
    background: $danger-bg;
    font-size: $text-sm;
  }

  &__inline-error {
    font-size: $text-xs;
    color: $danger;

    button {
      font-weight: 600;
      text-decoration: underline;
    }
  }

  &__skeleton {
    @include card;
    @include flex(column, stretch, flex-start, 0.8rem);
    padding: 1.25rem;

    span {
      height: 1.1rem;
      border-radius: $radius-sm;
      background: linear-gradient(90deg, $sand 25%, $sage-soft 50%, $sand 75%);
      background-size: 200% 100%;
      animation: shimmer 1.6s linear infinite;

      &:first-child {
        width: 50%;
        height: 1.6rem;
      }
    }
  }
}
</style>
