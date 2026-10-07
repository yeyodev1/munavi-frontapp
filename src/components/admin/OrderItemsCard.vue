<script setup lang="ts">
import AdminCard from './AdminCard.vue'
import { money } from '@/composables/admin/money'
import type { Order } from '@/types'

defineProps<{ order: Order }>()
</script>

<template>
  <AdminCard title="Productos" icon="fa-solid fa-box">
    <ul class="oitems">
      <li v-for="(item, index) in order.items" :key="index" class="oitems__item">
        <span class="oitems__thumb">
          <img v-if="item.image" :src="item.image" alt="" loading="lazy" />
          <i v-else class="fa-regular fa-image"></i>
        </span>
        <span class="oitems__info">
          <span class="oitems__name">{{ item.productName }}</span>
          <span class="oitems__meta">
            <template v-if="item.variantSlug !== 'unico'">{{ item.variantName }} · </template>
            {{ item.quantity }} x {{ money(item.unitPrice) }}
            <template v-if="item.volumeDiscountPercent">
              · {{ item.volumeDiscountPercent }}% por cantidad</template
            >
          </span>
        </span>
        <span class="oitems__total">{{ money(item.lineTotal) }}</span>
      </li>
    </ul>

    <dl class="oitems__sums">
      <div>
        <dt>Subtotal</dt>
        <dd>{{ money(order.subtotal) }}</dd>
      </div>
      <div v-if="order.volumeDiscount">
        <dt>Descuento por cantidad</dt>
        <dd>- {{ money(order.volumeDiscount) }}</dd>
      </div>
      <div v-if="order.couponDiscount">
        <dt>Cupón {{ order.couponCode }}</dt>
        <dd>- {{ money(order.couponDiscount) }}</dd>
      </div>
      <div>
        <dt>Envío</dt>
        <dd>{{ order.shipping ? money(order.shipping) : 'Gratis' }}</dd>
      </div>
      <div class="oitems__grand">
        <dt>Total</dt>
        <dd>{{ money(order.total) }}</dd>
      </div>
    </dl>
  </AdminCard>
</template>

<style scoped lang="scss">
.oitems {
  list-style: none;
  @include flex(column, stretch, flex-start, 0.8rem);

  &__item {
    @include flex(row, center, flex-start, 0.8rem);
  }

  &__thumb {
    flex: none;
    @include flex(row, center, center);
    width: 52px;
    height: 52px;
    border-radius: $radius-sm;
    background: $sand;
    overflow: hidden;
    color: $ink-muted;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__info {
    @include flex(column, flex-start, center);
    flex: 1;
    min-width: 0;
  }

  &__name {
    font-weight: 600;
    line-height: 1.3;
  }

  &__meta {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__total {
    flex: none;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  &__sums {
    @include flex(column, stretch, flex-start, 0.35rem);
    padding-top: 0.9rem;
    border-top: 1px solid $line;

    div {
      @include flex(row, center, space-between, 1rem);
      font-size: $text-sm;
    }

    dt {
      color: $ink-soft;
    }

    dd {
      font-variant-numeric: tabular-nums;
    }
  }

  &__grand {
    margin-top: 0.3rem;
    font-size: 1.05rem !important;
    font-weight: 700;

    dt {
      color: $ink !important;
    }
  }
}
</style>
