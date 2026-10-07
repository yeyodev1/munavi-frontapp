<script setup lang="ts">
import ResultPanel from '@/components/order/ResultPanel.vue'
import OrderSummary from '@/components/checkout/OrderSummary.vue'
import { usePaymentConfirm } from '@/composables/usePaymentConfirm'
import { paymentResultCopy as copy } from '@/config/copy/checkout'

const { state, order, error, orderNumber, retryLink, orderLink, whatsapp, confirm } = usePaymentConfirm()
</script>

<template>
  <div class="payres">
    <ResultPanel v-if="state === 'confirming'" loading :title="copy.confirmingTitle" :text="copy.confirmingText" />

    <ResultPanel
      v-else-if="state === 'missing'"
      tone="warning"
      icon="fa-solid fa-circle-question"
      :title="copy.missingTitle"
      :text="copy.missingText"
    >
      <template #actions>
        <RouterLink to="/mi-pedido" class="btn btn--primary">{{ copy.lookup }}</RouterLink>
      </template>
    </ResultPanel>

    <template v-else-if="state === 'approved' && order">
      <ResultPanel tone="success" icon="fa-solid fa-circle-check" :title="copy.approvedTitle" :text="copy.approvedText">
        <p class="payres__number">
          {{ copy.orderNumber }} <strong>{{ order.orderNumber }}</strong>
        </p>
        <template #actions>
          <RouterLink :to="orderLink" class="btn btn--primary">{{ copy.viewOrder }}</RouterLink>
          <RouterLink to="/tienda" class="btn btn--ghost">{{ copy.toShop }}</RouterLink>
        </template>
      </ResultPanel>
      <OrderSummary
        class="payres__summary"
        :items="order.items"
        :subtotal="order.subtotal"
        :volume-discount="order.volumeDiscount"
        :coupon-discount="order.couponDiscount"
        :coupon-code="order.couponCode"
        :shipping="order.shipping"
        :total="order.total"
      />
    </template>

    <ResultPanel
      v-else-if="state === 'failed'"
      tone="error"
      icon="fa-solid fa-circle-xmark"
      :title="copy.failedTitle"
      :text="copy.failedText"
    >
      <p v-if="orderNumber" class="payres__number">
        {{ copy.orderNumber }} <strong>{{ orderNumber }}</strong>
      </p>
      <template #actions>
        <RouterLink v-if="orderNumber" :to="retryLink" class="btn btn--primary">
          <i class="fa-solid fa-rotate-right" aria-hidden="true"></i>
          {{ copy.retryPay }}
        </RouterLink>
        <a :href="whatsapp" target="_blank" rel="noopener" class="btn btn--ghost">
          <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
          {{ copy.whatsapp }}
        </a>
      </template>
    </ResultPanel>

    <ResultPanel
      v-else-if="state === 'pending'"
      tone="warning"
      icon="fa-solid fa-hourglass-half"
      :title="copy.pendingTitle"
      :text="copy.pendingText"
    >
      <template #actions>
        <button type="button" class="btn btn--primary" @click="confirm">{{ copy.retryConfirm }}</button>
        <RouterLink v-if="orderNumber" :to="orderLink" class="btn btn--ghost">{{ copy.viewOrder }}</RouterLink>
      </template>
    </ResultPanel>

    <ResultPanel
      v-else
      tone="error"
      icon="fa-solid fa-plug-circle-xmark"
      :title="copy.networkTitle"
      :text="error?.status === 404 ? error.message : copy.networkText"
    >
      <template #actions>
        <button type="button" class="btn btn--primary" @click="confirm">
          <i class="fa-solid fa-rotate-right" aria-hidden="true"></i>
          {{ copy.retryConfirm }}
        </button>
        <a :href="whatsapp" target="_blank" rel="noopener" class="btn btn--ghost">
          <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
          {{ copy.whatsapp }}
        </a>
      </template>
    </ResultPanel>
  </div>
</template>

<style scoped lang="scss">
.payres {
  @include container(640px);
  @include flex(column, stretch, flex-start, $space-md);
  padding-block: $space-lg $space-section;

  &__number {
    padding: 0.6rem 1.1rem;
    border-radius: $radius-pill;
    background: rgba($accent, 0.06);
    font-size: $text-sm;
    color: $ink-soft;

    strong {
      color: $ink;
      letter-spacing: 0.04em;
    }
  }
}
</style>
