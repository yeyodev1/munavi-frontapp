<script setup lang="ts">
import AdminCard from './AdminCard.vue'
import { site } from '@/config/site'
import { payphoneLabel } from '@/composables/admin/useOrderDetail'
import type { Order } from '@/types'

defineProps<{ order: Order; whatsapp: string }>()
</script>

<template>
  <AdminCard title="Cliente y entrega" icon="fa-solid fa-user">
    <div class="ocust">
      <p class="ocust__name">{{ order.customer.name }}</p>
      <a :href="`mailto:${order.customer.email}`" class="ocust__line"
        ><i class="fa-regular fa-envelope"></i> {{ order.customer.email }}</a
      >
      <a :href="`tel:${order.customer.phone}`" class="ocust__line"
        ><i class="fa-solid fa-phone"></i> {{ order.customer.phone }}</a
      >
      <p class="ocust__line">
        <i class="fa-regular fa-id-card"></i> Cédula / RUC {{ order.customer.documentId }}
      </p>
    </div>

    <a :href="whatsapp" target="_blank" rel="noopener" class="ocust__wa">
      <i class="fa-brands fa-whatsapp"></i> Escribirle por WhatsApp
    </a>

    <div class="ocust">
      <p class="ocust__label">Dirección de envío</p>
      <p>{{ order.shippingAddress.address }}</p>
      <p>{{ order.shippingAddress.city }}, {{ order.shippingAddress.province }}</p>
      <p v-if="order.shippingAddress.reference" class="ocust__muted">
        Referencia: {{ order.shippingAddress.reference }}
      </p>
    </div>

    <div class="ocust">
      <p class="ocust__label">Pago</p>
      <p>
        <i :class="site.paymentMethods[order.paymentMethod].icon"></i>
        {{ site.paymentMethods[order.paymentMethod].label }}
      </p>
      <template v-if="order.paymentMethod === 'card'">
        <p class="ocust__muted">Payphone: {{ payphoneLabel(order.payphone?.statusCode) }}</p>
        <p v-if="order.payphone?.transactionId" class="ocust__muted">
          Transacción {{ order.payphone.transactionId }}
        </p>
        <p v-if="order.payphone?.authorizationCode" class="ocust__muted">
          Autorización {{ order.payphone.authorizationCode }}
        </p>
      </template>
      <p
        v-if="order.paymentMethod === 'transfer' && order.status === 'awaiting_transfer'"
        class="ocust__muted"
      >
        Cuando recibas el comprobante, márcalo como Pagado.
      </p>
    </div>
  </AdminCard>
</template>

<style scoped lang="scss">
.ocust {
  @include flex(column, flex-start, flex-start, 0.2rem);
  font-size: $text-sm;

  &__name {
    font-size: 1.05rem;
    font-weight: 700;
  }

  &__line {
    @include flex(row, center, flex-start, 0.5rem);
    overflow-wrap: anywhere;

    i {
      width: 1rem;
      color: $ink-muted;
    }
  }

  a.ocust__line:hover {
    color: $accent;
  }

  &__label {
    font-size: $text-xs;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: $ink-muted;
  }

  &__muted {
    color: $ink-muted;
  }

  &__wa {
    @include flex(row, center, center, 0.5rem);
    padding: 0.75rem 1rem;
    border-radius: $radius-pill;
    background: #25d366;
    color: $surface;
    font-weight: 700;
    font-size: 0.9rem;

    &:hover {
      background: darken(#25d366, 8%);
    }
  }
}
</style>
