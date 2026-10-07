<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import OrderSummary from '@/components/checkout/OrderSummary.vue'
import OrderTimeline from '@/components/order/OrderTimeline.vue'
import BankTransferInfo from '@/components/order/BankTransferInfo.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { useOrderLookup } from '@/composables/useOrderLookup'
import { site } from '@/config/site'
import { orderCopy as copy } from '@/config/copy/checkout'

const route = useRoute()
const orderNumber = computed(() => String(route.params.orderNumber ?? '').toUpperCase())
const email = computed(() => String(route.query.email ?? ''))

const { order, loading, error, load, bankInfo, helpLink, placedAt, canRetryPayment } = useOrderLookup(orderNumber, email)

const stopped = computed(() => order.value && ['canceled', 'payment_failed'].includes(order.value.status))
const retryLink = computed(() => ({ path: '/pago/reintentar', query: { pedido: orderNumber.value, email: email.value } }))
</script>

<template>
  <div class="order">
    <EmptyState v-if="!email" icon="fa-solid fa-envelope" :title="copy.notFoundTitle" :text="copy.missingEmail">
      <RouterLink :to="{ path: '/mi-pedido', query: { pedido: orderNumber } }" class="btn btn--primary">
        {{ copy.lookup }}
      </RouterLink>
    </EmptyState>

    <div v-else-if="loading && !order" class="order__loading" role="status">
      <span class="order__spinner" aria-hidden="true"></span>
      {{ copy.loading }}
    </div>

    <EmptyState v-else-if="error || !order" tone="error" icon="fa-solid fa-box-open" :title="copy.notFoundTitle" :text="error?.message">
      <button v-if="error && error.status !== 404" type="button" class="btn btn--primary" @click="load">{{ copy.retry }}</button>
      <RouterLink :to="{ path: '/mi-pedido', query: { pedido: orderNumber } }" class="btn btn--ghost">{{ copy.lookup }}</RouterLink>
    </EmptyState>

    <template v-else>
      <header class="order__head">
        <p class="order__eyebrow">{{ copy.eyebrow }}</p>
        <h1 class="order__title">{{ copy.title(order.orderNumber) }}</h1>
        <p class="order__meta">
          {{ copy.placed(placedAt) }}
          <span class="order__status" :class="`order__status--${order.status}`">{{ site.orderStatus[order.status] }}</span>
        </p>
      </header>

      <p v-if="stopped" class="order__alert" role="status">
        <i class="fa-solid fa-circle-info" aria-hidden="true"></i>
        {{ order.status === 'canceled' ? copy.canceled : copy.failed }}
      </p>
      <OrderTimeline v-else :status="order.status" class="order__timeline" />

      <div class="order__layout">
        <div class="order__main">
          <BankTransferInfo
            v-if="order.paymentMethod === 'transfer' && order.status === 'awaiting_transfer'"
            :order-number="order.orderNumber"
            :total="order.total"
            :info="bankInfo"
          />
          <div v-else-if="!stopped || canRetryPayment" class="order__note">
            <p v-if="order.paymentMethod === 'cash_on_delivery'">{{ copy.instructions.cash_on_delivery }}</p>
            <p v-else-if="canRetryPayment">{{ copy.instructions.cardPending }}</p>
            <p v-else-if="order.paymentMethod === 'card'">{{ copy.instructions.card }}</p>
            <RouterLink v-if="canRetryPayment" :to="retryLink" class="btn btn--primary">{{ copy.retryPay }}</RouterLink>
          </div>

          <a v-if="order.trackingUrl" :href="order.trackingUrl" target="_blank" rel="noopener" class="btn btn--dark order__track">
            <i class="fa-solid fa-truck-fast" aria-hidden="true"></i>
            {{ copy.track }}
          </a>

          <dl class="order__info">
            <div>
              <dt>{{ copy.shipTo }}</dt>
              <dd>
                {{ order.shippingAddress.address }}<br />
                {{ order.shippingAddress.city }}, {{ order.shippingAddress.province }}
                <template v-if="order.shippingAddress.reference"><br />{{ order.shippingAddress.reference }}</template>
              </dd>
            </div>
            <div>
              <dt>{{ copy.contact }}</dt>
              <dd>{{ order.customer.name }}<br />{{ order.customer.email }}<br />{{ order.customer.phone }}</dd>
            </div>
            <div>
              <dt>{{ copy.paymentMethod }}</dt>
              <dd>{{ site.paymentMethods[order.paymentMethod].label }}</dd>
            </div>
          </dl>

          <a :href="helpLink" target="_blank" rel="noopener" class="order__help">
            <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
            {{ copy.help }}
          </a>
        </div>

        <OrderSummary
          class="order__summary"
          :items="order.items"
          :subtotal="order.subtotal"
          :volume-discount="order.volumeDiscount"
          :coupon-discount="order.couponDiscount"
          :coupon-code="order.couponCode"
          :shipping="order.shipping"
          :total="order.total"
        />
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.order {
  @include container(1040px);
  padding-block: $space-md $space-section;

  &__loading {
    @include flex(column, center, center, 0.8rem);
    min-height: 40vh;
    color: $ink-soft;
    font-size: $text-sm;
  }

  &__spinner {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    border: 3px solid rgba($accent, 0.15);
    border-top-color: $accent;
    animation: order-spin 0.8s linear infinite;
  }

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

  &__meta {
    @include flex(row, center, flex-start, 0.6rem);
    flex-wrap: wrap;
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__status {
    padding: 0.2rem 0.7rem;
    border-radius: $radius-pill;
    background: $info-bg;
    font-size: $text-xs;
    font-weight: 600;
    color: $ink;

    &--paid,
    &--confirmed,
    &--shipped,
    &--delivered {
      background: $success-bg;
    }

    &--awaiting_transfer,
    &--pending_payment {
      background: $warning-bg;
    }

    &--canceled,
    &--payment_failed {
      background: $danger-bg;
    }
  }

  &__timeline {
    margin-bottom: $space-lg;
  }

  &__alert {
    @include flex(row, flex-start, flex-start, 0.5rem);
    margin-bottom: $space-md;
    padding: 0.9rem 1rem;
    border-radius: $radius-sm;
    background: $danger-bg;
    font-size: $text-sm;

    i {
      margin-top: 0.2rem;
      color: $danger;
    }
  }

  &__layout {
    @include flex(column, stretch, flex-start, $space-md);

    @include from('md') {
      flex-direction: row;
      align-items: flex-start;
    }
  }

  &__main {
    @include flex(column, stretch, flex-start, 1.2rem);
    flex: 1;
    min-width: 0;
  }

  &__note {
    @include flex(column, flex-start, flex-start, 0.8rem);
    padding: 1.1rem 1.25rem;
    border-radius: $radius-md;
    background: rgba($accent, 0.05);
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__track {
    align-self: flex-start;
  }

  &__info {
    @include card;
    @include flex-cards(200px, 1.2rem);
    padding: 1.25rem;

    dt {
      @include eyebrow;
      margin-bottom: 0.35rem;
    }

    dd {
      font-size: $text-sm;
      color: $ink-soft;
      line-height: 1.55;
      word-break: break-word;
    }
  }

  &__help {
    @include flex(row, center, flex-start, 0.5rem);
    font-size: $text-sm;
    font-weight: 600;
    color: #128c4a;
  }

  &__summary {
    @include from('md') {
      flex: 0 0 360px;
    }
  }
}

@keyframes order-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
