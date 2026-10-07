<script setup lang="ts">
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminPagination from '@/components/admin/AdminPagination.vue'
import AdminEmpty from '@/components/admin/AdminEmpty.vue'
import OrderRow from '@/components/admin/OrderRow.vue'
import { useAdminOrders } from '@/composables/admin/useAdminOrders'
import { paymentOptions, statusOptions, statusTone } from '@/composables/admin/orderStatus'

const { items, q, status, paymentMethod, page, pages, total, loading } = useAdminOrders()
</script>

<template>
  <section class="orders">
    <AdminPageHeader
      title="Pedidos"
      :subtitle="`${total} ${total === 1 ? 'pedido' : 'pedidos'}${status || paymentMethod || q ? ' con estos filtros' : ''}. Los más recientes primero.`"
    />

    <div class="orders__filters">
      <label class="orders__search">
        <i class="fa-solid fa-magnifying-glass"></i>
        <span class="visually-hidden">Buscar pedido</span>
        <input v-model="q" type="search" placeholder="Número, nombre, correo o teléfono" />
      </label>
      <label class="orders__method">
        <span class="visually-hidden">Forma de pago</span>
        <select v-model="paymentMethod">
          <option value="">Todas las formas de pago</option>
          <option v-for="option in paymentOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </label>
    </div>

    <div class="orders__chips" role="group" aria-label="Filtrar por estado">
      <button
        type="button"
        class="orders__chip"
        :class="{ 'orders__chip--on': !status }"
        @click="status = ''"
      >
        Todos
      </button>
      <button
        v-for="option in statusOptions"
        :key="option.value"
        type="button"
        class="orders__chip"
        :class="[
          `orders__chip--${statusTone[option.value]}`,
          { 'orders__chip--on': status === option.value },
        ]"
        @click="status = status === option.value ? '' : option.value"
      >
        {{ option.label }}
      </button>
    </div>

    <p v-if="loading && !items.length" class="orders__loading">
      <i class="fa-solid fa-spinner fa-spin"></i> Cargando pedidos…
    </p>

    <AdminEmpty
      v-else-if="!items.length"
      icon="fa-solid fa-bag-shopping"
      :title="
        status || paymentMethod || q ? 'Ningún pedido con estos filtros' : 'Todavía no hay pedidos'
      "
      :text="
        status || paymentMethod || q
          ? 'Prueba quitando algún filtro.'
          : 'Cuando alguien compre en la tienda, aparecerá aquí.'
      "
    />

    <div v-else class="orders__list" :class="{ 'orders__list--busy': loading }">
      <OrderRow v-for="order in items" :key="order._id" :order="order" />
    </div>

    <AdminPagination v-model="page" :pages="pages" />
  </section>
</template>

<style scoped lang="scss">
.orders {
  &__filters {
    @include flex(row, center, flex-start, 0.6rem);
    flex-wrap: wrap;
    margin-bottom: 0.9rem;
  }

  &__search {
    position: relative;
    flex: 1 1 260px;
    margin: 0;

    i {
      position: absolute;
      left: 0.9rem;
      top: 50%;
      transform: translateY(-50%);
      color: $ink-muted;
    }

    input {
      padding-left: 2.4rem;
    }
  }

  &__method {
    flex: 1 1 200px;
    margin: 0;

    @include from('md') {
      flex: 0 0 260px;
    }
  }

  &__chips {
    @include flex(row, center, flex-start, 0.4rem);
    flex-wrap: wrap;
    margin-bottom: 1.2rem;
  }

  &__chip {
    padding: 0.4rem 0.85rem;
    border-radius: $radius-pill;
    border: 1px solid $line;
    background: $surface;
    font-size: 0.78rem;
    font-weight: 600;
    color: $ink-soft;

    &--on {
      background: $ink;
      border-color: $ink;
      color: $surface;
    }

    &--warning.orders__chip--on {
      background: darken($warning, 12%);
      border-color: darken($warning, 12%);
    }

    &--success.orders__chip--on {
      background: darken($success, 10%);
      border-color: darken($success, 10%);
    }

    &--info.orders__chip--on {
      background: $info;
      border-color: $info;
    }

    &--accent.orders__chip--on {
      background: $accent;
      border-color: $accent;
    }

    &--danger.orders__chip--on {
      background: $danger;
      border-color: $danger;
    }
  }

  &__loading {
    color: $ink-soft;
  }

  &__list {
    @include flex(column, stretch, flex-start, 0.5rem);
    @include transition(opacity);

    &--busy {
      opacity: 0.6;
    }
  }
}
</style>
