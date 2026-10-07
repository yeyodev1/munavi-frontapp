<script setup lang="ts">
import { computed } from 'vue'
import type { Order, PayphoneBox as PayphoneConfig } from '@/types'
import OrderSummary from '@/components/checkout/OrderSummary.vue'
import PayphoneBox from '@/components/checkout/PayphoneBox.vue'
import { useSettingsStore } from '@/stores/settings'
import { whatsappLink } from '@/config/site'
import { money } from '@/utils/price'
import { checkoutCopy } from '@/config/copy/checkout'

const props = withDefaults(defineProps<{ order: Order; payphone: PayphoneConfig; renewing?: boolean }>(), {
  renewing: false,
})
const emit = defineEmits<{ renew: [] }>()

const copy = checkoutCopy.cardSection
const settings = useSettingsStore()
const helpLink = computed(() => whatsappLink(copy.changeMethodWhatsapp(props.order.orderNumber), settings.whatsapp))
</script>

<template>
  <section class="cardpay">
    <header class="cardpay__head">
      <p class="cardpay__eyebrow">{{ copy.eyebrow }}</p>
      <h1 class="cardpay__title">{{ copy.title(order.orderNumber) }}</h1>
      <p class="cardpay__text">{{ copy.text }}</p>
    </header>

    <div class="cardpay__layout">
      <OrderSummary
        class="cardpay__summary"
        :items="order.items"
        :subtotal="order.subtotal"
        :volume-discount="order.volumeDiscount"
        :coupon-discount="order.couponDiscount"
        :coupon-code="order.couponCode"
        :shipping="order.shipping"
        :total="order.total"
      />

      <div class="cardpay__box">
        <p class="cardpay__amount">
          {{ checkoutCopy.summary.total }} <strong>{{ money(order.total) }}</strong>
        </p>
        <PayphoneBox :payphone="payphone" :renewing="renewing" @renew="emit('renew')" />
        <a :href="helpLink" target="_blank" rel="noopener" class="cardpay__alt">
          <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
          {{ copy.changeMethod }}
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.cardpay {
  @include flex(column, stretch, flex-start, $space-md);

  &__head {
    @include flex(column, flex-start, flex-start, 0.4rem);
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-sm);
  }

  &__text {
    color: $ink-soft;
    font-size: $text-sm;
  }

  &__layout {
    @include flex(column, stretch, flex-start, $space-md);

    @include from('md') {
      flex-direction: row-reverse;
      align-items: flex-start;
    }
  }

  &__summary {
    @include from('md') {
      flex: 0 0 360px;
      position: sticky;
      top: 6rem;
    }
  }

  &__box {
    @include card;
    @include flex(column, stretch, flex-start, 1rem);
    flex: 1;
    min-width: 0;
    padding: 1.25rem;

    @include from('md') {
      padding: 1.75rem;
    }
  }

  &__amount {
    @include flex(row, baseline, space-between);
    font-weight: 600;

    strong {
      font-size: $text-xl;
    }
  }

  &__alt {
    @include flex(row, center, center, 0.5rem);
    font-size: $text-sm;
    font-weight: 600;
    color: #128c4a;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
