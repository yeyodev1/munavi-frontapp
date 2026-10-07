<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminCard from '@/components/admin/AdminCard.vue'
import AdminEmpty from '@/components/admin/AdminEmpty.vue'
import StatusChip from '@/components/admin/StatusChip.vue'
import OrderItemsCard from '@/components/admin/OrderItemsCard.vue'
import OrderCustomerCard from '@/components/admin/OrderCustomerCard.vue'
import OrderStatusPanel from '@/components/admin/OrderStatusPanel.vue'
import { useOrderDetail } from '@/composables/admin/useOrderDetail'
import { formatDateTime } from '@/composables/admin/orderStatus'

const route = useRoute()
const id = computed(() => String(route.params.id))
const { order, loading, saving, notFound, notes, whatsapp, update, saveNotes } = useOrderDetail(id)
</script>

<template>
  <section class="odetail">
    <AdminPageHeader
      :title="order ? `Pedido ${order.orderNumber}` : 'Pedido'"
      :subtitle="order ? `Recibido el ${formatDateTime(order.createdAt)}` : undefined"
      back="/admin/pedidos"
    >
      <StatusChip v-if="order" :status="order.status" />
    </AdminPageHeader>

    <p v-if="loading && !order" class="odetail__loading">
      <i class="fa-solid fa-spinner fa-spin"></i> Cargando…
    </p>

    <AdminEmpty
      v-else-if="notFound || !order"
      icon="fa-solid fa-magnifying-glass"
      :title="notFound ? 'No encontramos este pedido' : 'No pudimos cargar este pedido'"
    >
      <RouterLink to="/admin/pedidos" class="btn btn--primary">Ver todos los pedidos</RouterLink>
    </AdminEmpty>

    <div v-else class="odetail__cols">
      <div class="odetail__main">
        <OrderItemsCard :order="order" />
        <OrderCustomerCard :order="order" :whatsapp="whatsapp" />
      </div>
      <div class="odetail__side">
        <OrderStatusPanel :order="order" :saving="saving" @update="update" />

        <a
          v-if="order.trackingUrl"
          :href="order.trackingUrl"
          target="_blank"
          rel="noopener"
          class="odetail__track"
        >
          <i class="fa-solid fa-location-dot"></i> Abrir guía de envío
        </a>

        <AdminCard
          title="Notas internas"
          icon="fa-regular fa-note-sticky"
          description="Solo las ves tú. La clienta no las recibe."
        >
          <textarea
            v-model="notes"
            rows="4"
            aria-label="Notas internas"
            placeholder="Ej. Pidió entrega en la tarde"
          ></textarea>
          <button
            class="btn btn--ghost"
            type="button"
            :disabled="saving || notes === (order.adminNotes ?? '')"
            @click="saveNotes"
          >
            Guardar notas
          </button>
        </AdminCard>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.odetail {
  &__loading {
    color: $ink-soft;
  }

  &__cols {
    @include flex(column, stretch, flex-start, 1.2rem);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
    }
  }

  &__main,
  &__side {
    @include flex(column, stretch, flex-start, 1.2rem);
    min-width: 0;
  }

  @include from('lg') {
    &__main {
      flex: 1 1 0;
    }

    &__side {
      flex: 0 0 360px;
    }
  }

  &__track {
    @include flex(row, center, center, 0.5rem);
    padding: 0.7rem;
    border-radius: $radius-pill;
    background: $accent-soft;
    color: $accent-deep;
    font-weight: 600;
    font-size: 0.88rem;
  }

  textarea {
    resize: vertical;
  }
}
</style>
