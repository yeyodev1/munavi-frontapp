<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { ApiError } from '@/types'
import CardPaymentSection from '@/components/checkout/CardPaymentSection.vue'
import ResultPanel from '@/components/order/ResultPanel.vue'
import { orderService, type RetryResponse } from '@/services/order.service'
import { savePendingOrder } from '@/composables/useOrderSession'
import { useToastStore } from '@/stores/toast'
import { paymentResultCopy as copy, orderCopy } from '@/config/copy/checkout'

const route = useRoute()
const toast = useToastStore()
const orderNumber = String(route.query.pedido ?? '').trim().toUpperCase()
const email = String(route.query.email ?? '').trim().toLowerCase()

const payment = ref<RetryResponse | null>(null)
const loading = ref(false)
const error = ref<ApiError | null>(null)

/** Cada llamada genera un clientTransactionId nuevo (también al expirar el formulario). */
async function start() {
  if (!orderNumber || !email) return
  const renewing = !!payment.value
  loading.value = true
  if (!renewing) error.value = null
  try {
    payment.value = await orderService.retry(orderNumber, email)
    savePendingOrder({ orderNumber, email })
  } catch (err) {
    if (renewing) toast.error((err as ApiError).message)
    else error.value = err as ApiError
  } finally {
    loading.value = false
  }
}

onMounted(start)
</script>

<template>
  <div class="retry">
    <ResultPanel
      v-if="!orderNumber || !email"
      tone="warning"
      icon="fa-solid fa-circle-question"
      :title="copy.retryTitle"
      :text="copy.retryMissing"
    >
      <template #actions>
        <RouterLink to="/mi-pedido" class="btn btn--primary">{{ copy.lookup }}</RouterLink>
      </template>
    </ResultPanel>

    <CardPaymentSection
      v-else-if="payment"
      :order="payment.order"
      :payphone="payment.payphone"
      :renewing="loading"
      @renew="start"
    />

    <ResultPanel v-else-if="loading" loading :title="copy.retryTitle" :text="copy.retryLoading" />

    <ResultPanel
      v-else-if="error"
      tone="error"
      icon="fa-solid fa-circle-xmark"
      :title="copy.retryErrorTitle"
      :text="error.message"
    >
      <template #actions>
        <RouterLink :to="{ path: `/pedido/${orderNumber}`, query: { email } }" class="btn btn--primary">
          {{ copy.viewOrder }}
        </RouterLink>
        <button v-if="error.status !== 409 && error.status !== 404" type="button" class="btn btn--ghost" @click="start">
          {{ orderCopy.retry }}
        </button>
      </template>
    </ResultPanel>
  </div>
</template>

<style scoped lang="scss">
.retry {
  @include container;
  padding-block: $space-md $space-section;

  > :deep(.result) {
    max-width: 640px;
    margin-inline: auto;
  }
}
</style>
