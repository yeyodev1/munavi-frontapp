<script setup lang="ts">
import StatusChip from './StatusChip.vue'
import { money } from '@/composables/admin/money'
import { formatDateTime, paymentShort } from '@/composables/admin/orderStatus'
import type { Order } from '@/types'

defineProps<{ order: Order }>()
</script>

<template>
  <RouterLink :to="`/admin/pedidos/${order._id}`" class="orow">
    <div class="orow__head">
      <span class="orow__number">{{ order.orderNumber }}</span>
      <StatusChip :status="order.status" />
    </div>
    <div class="orow__customer">
      <span class="orow__name">{{ order.customer.name }}</span>
      <span class="orow__meta"
        >{{ order.shippingAddress.city }}, {{ order.shippingAddress.province }}</span
      >
    </div>
    <div class="orow__pay">
      <span class="orow__total">{{ money(order.total) }}</span>
      <span class="orow__meta">{{ paymentShort[order.paymentMethod] }}</span>
    </div>
    <span class="orow__date">{{ formatDateTime(order.createdAt) }}</span>
    <i class="fa-solid fa-chevron-right orow__go" aria-hidden="true"></i>
  </RouterLink>
</template>

<style scoped lang="scss">
.orow {
  @include card;
  @include flex(row, center, space-between, 0.4rem 1rem);
  flex-wrap: wrap;
  padding: 0.9rem 1rem;
  @include transition(border-color);

  &:hover {
    border-color: $accent;
  }

  @include from('lg') {
    flex-wrap: nowrap;
  }

  &__head {
    @include flex(row, center, space-between, 0.6rem);
    flex: 1 1 100%;

    @include from('lg') {
      flex: 0 0 15rem;
      justify-content: flex-start;
    }
  }

  &__number {
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  &__customer {
    @include flex(column, flex-start, center);
    flex: 1 1 160px;
    min-width: 0;
  }

  &__name {
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
  }

  &__meta,
  &__date {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__pay {
    @include flex(column, flex-end, center);
    flex: none;

    @include from('lg') {
      width: 8rem;
    }
  }

  &__total {
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  &__date {
    flex: 1 1 100%;

    @include from('lg') {
      flex: 0 0 8.5rem;
      text-align: right;
    }
  }

  &__go {
    display: none;
    color: $ink-muted;

    @include from('lg') {
      display: block;
    }
  }
}
</style>
