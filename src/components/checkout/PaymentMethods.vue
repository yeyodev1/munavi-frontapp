<script setup lang="ts">
import { computed } from 'vue'
import type { PaymentMethod, Quote } from '@/types'
import { site } from '@/config/site'
import { money } from '@/utils/price'
import { checkoutCopy as copy } from '@/config/copy/checkout'
import { PAYMENT_METHODS } from '@/composables/useQuote'

const props = defineProps<{
  quotes: Partial<Record<PaymentMethod, Quote>>
  loading: boolean
  cardUnavailable: boolean
}>()
const model = defineModel<PaymentMethod>({ required: true })

const savings = computed(() => {
  const card = props.quotes.card?.total
  const cash = props.quotes.cash_on_delivery?.total
  return card != null && cash != null && cash > card ? cash - card : 0
})
</script>

<template>
  <fieldset class="methods">
    <legend class="methods__legend"><span>3</span>{{ copy.steps.payment }}</legend>

    <div class="methods__list" role="radiogroup">
      <label
        v-for="method in PAYMENT_METHODS"
        :key="method"
        class="methods__option"
        :class="{ 'methods__option--active': model === method, 'methods__option--off': method === 'card' && cardUnavailable }"
      >
        <input v-model="model" class="visually-hidden" type="radio" name="payment-method" :value="method" />
        <span class="methods__radio" aria-hidden="true"></span>
        <i :class="site.paymentMethods[method].icon" class="methods__icon" aria-hidden="true"></i>
        <span class="methods__text">
          <span class="methods__label">
            {{ site.paymentMethods[method].label }}
            <span v-if="method === 'card'" class="methods__badge">{{ copy.bestPrice }}</span>
          </span>
          <span class="methods__hint">{{ site.paymentMethods[method].hint }}</span>
          <span v-if="method === 'card' && savings" class="methods__save">
            <i class="fa-solid fa-tag" aria-hidden="true"></i>
            {{ copy.saveVsCash(money(savings)) }}
          </span>
        </span>
        <strong class="methods__total">
          {{ quotes[method] ? money(quotes[method]!.total) : loading ? copy.quoting : '' }}
        </strong>
      </label>
    </div>

    <p v-if="cardUnavailable && model === 'card'" class="methods__warn" role="alert">
      <i class="fa-solid fa-circle-info" aria-hidden="true"></i>
      {{ copy.errors.cardUnavailable }}
    </p>
  </fieldset>
</template>

<style scoped lang="scss">
.methods {
  border: none;
  padding: 0;
  margin: 0;
  min-width: 0;

  &__legend {
    @include flex(row, center, flex-start, 0.6rem);
    @include display($text-xl, 500);
    margin-bottom: 1rem;

    span {
      @include flex(row, center, center);
      width: 1.8rem;
      height: 1.8rem;
      border-radius: 50%;
      background: $accent;
      color: $surface;
      font-family: $font-principal;
      font-size: $text-xs;
      font-weight: 700;
      letter-spacing: 0;
    }
  }

  &__list {
    @include flex(column, stretch, flex-start, 0.7rem);
  }

  &__option {
    @include flex(row, flex-start, flex-start, 0.75rem);
    margin: 0;
    padding: 1rem;
    border: 1.5px solid $line;
    border-radius: $radius-md;
    background: $surface;
    cursor: pointer;
    color: $ink;
    @include transition(border-color);

    &:hover {
      border-color: rgba($accent, 0.45);
    }

    &:has(input:focus-visible) {
      outline: 2px solid $accent;
      outline-offset: 2px;
    }

    &--active {
      border-color: $accent;
      background: rgba($accent, 0.04);
    }

    &--off {
      opacity: 0.6;
    }
  }

  &__radio {
    flex: 0 0 1.1rem;
    height: 1.1rem;
    margin-top: 0.15rem;
    border-radius: 50%;
    border: 2px solid $line;
    @include transition(border);
  }

  &__option--active &__radio {
    border: 5px solid $accent;
  }

  &__icon {
    margin-top: 0.2rem;
    color: $accent;
    width: 1.2rem;
  }

  &__text {
    @include flex(column, flex-start, flex-start, 0.2rem);
    flex: 1;
    min-width: 0;
  }

  &__label {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
    font-weight: 600;
    font-size: $text-sm;
  }

  &__badge {
    padding: 0.15rem 0.55rem;
    border-radius: $radius-pill;
    background: $rose;
    color: $surface;
    font-size: 0.64rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  &__hint {
    font-size: $text-xs;
    color: $ink-muted;
    font-weight: 400;
  }

  &__save {
    @include flex(row, center, flex-start, 0.35rem);
    font-size: $text-xs;
    font-weight: 600;
    color: $rose-deep;
  }

  &__total {
    font-size: $text-base;
    white-space: nowrap;
  }

  &__warn {
    @include flex(row, flex-start, flex-start, 0.5rem);
    margin-top: 0.8rem;
    padding: 0.8rem 1rem;
    border-radius: $radius-sm;
    background: $warning-bg;
    font-size: $text-sm;
    color: $ink-soft;

    i {
      margin-top: 0.2rem;
      color: $warning;
    }
  }
}
</style>
