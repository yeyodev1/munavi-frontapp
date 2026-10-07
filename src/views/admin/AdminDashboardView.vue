<script setup lang="ts">
import { computed } from 'vue'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminEmpty from '@/components/admin/AdminEmpty.vue'
import StatTile from '@/components/admin/StatTile.vue'
import OrderRow from '@/components/admin/OrderRow.vue'
import { useDashboard } from '@/composables/admin/useDashboard'
import { money } from '@/composables/admin/money'
import { useUserStore } from '@/stores/user'

const { stats, recent, loading } = useDashboard()
const userStore = useUserStore()

const greeting = computed(() => {
  const hour = new Date().getHours()
  const name =
    userStore.user?.name && userStore.user.name !== 'Administración'
      ? `, ${userStore.user.name}`
      : ''
  if (hour < 12) return `Buenos días${name}`
  if (hour < 19) return `Buenas tardes${name}`
  return `Buenas noches${name}`
})

const shortcuts = [
  { to: '/admin/productos/nuevo', label: 'Nuevo producto', icon: 'fa-solid fa-plus' },
  { to: '/admin/cupones', label: 'Crear cupón', icon: 'fa-solid fa-ticket' },
  { to: '/admin/ajustes', label: 'Envío y anuncios', icon: 'fa-solid fa-gear' },
]
</script>

<template>
  <section class="dash">
    <AdminPageHeader :title="greeting" subtitle="Así va la tienda hoy." />

    <div v-if="stats" class="dash__tiles">
      <StatTile
        label="Pedidos de hoy"
        :value="stats.ordersToday"
        icon="fa-solid fa-bag-shopping"
        to="/admin/pedidos"
      />
      <StatTile
        label="Vendido este mes"
        :value="money(stats.revenueMonth)"
        icon="fa-solid fa-sack-dollar"
      />
      <StatTile
        label="Transferencias por validar"
        :value="stats.pendingTransfers"
        icon="fa-solid fa-building-columns"
        to="/admin/pedidos?status=awaiting_transfer"
        :alert="stats.pendingTransfers > 0"
        hint="Revisa el comprobante y márcalo como pagado"
      />
      <StatTile
        label="Por enviar"
        :value="stats.toShip"
        icon="fa-solid fa-truck-fast"
        to="/admin/pedidos"
        :alert="stats.toShip > 0"
        hint="Pagados o confirmados sin despachar"
      />
      <StatTile
        label="Productos publicados"
        :value="stats.productsPublished"
        icon="fa-solid fa-box"
        to="/admin/productos"
      />
    </div>
    <p v-else-if="loading" class="dash__loading">
      <i class="fa-solid fa-spinner fa-spin"></i> Cargando…
    </p>

    <div class="dash__shortcuts">
      <RouterLink v-for="s in shortcuts" :key="s.to" :to="s.to" class="dash__shortcut">
        <i :class="s.icon"></i> {{ s.label }}
      </RouterLink>
    </div>

    <div class="dash__recent">
      <div class="dash__recent-head">
        <h2 class="dash__h2">Últimos pedidos</h2>
        <RouterLink to="/admin/pedidos" class="dash__all"
          >Ver todos <i class="fa-solid fa-arrow-right"></i
        ></RouterLink>
      </div>
      <AdminEmpty
        v-if="!loading && !recent.length"
        icon="fa-solid fa-bag-shopping"
        title="Todavía no hay pedidos"
        text="Cuando alguien compre en la tienda, lo verás aquí."
      />
      <div v-else class="dash__list">
        <OrderRow v-for="order in recent" :key="order._id" :order="order" />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.dash {
  &__tiles {
    @include flex-cards(220px, 0.8rem);
    margin-bottom: 1.2rem;
  }

  &__loading {
    color: $ink-soft;
    margin-bottom: 1.2rem;
  }

  &__shortcuts {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
    margin-bottom: 2rem;
  }

  &__shortcut {
    @include flex(row, center, center, 0.5rem);
    padding: 0.6rem 1.1rem;
    border-radius: $radius-pill;
    border: 1px solid $line;
    background: $surface;
    font-size: 0.85rem;
    font-weight: 600;

    i {
      color: $accent;
    }

    &:hover {
      border-color: $accent;
    }
  }

  &__recent-head {
    @include flex(row, baseline, space-between, 1rem);
    margin-bottom: 0.8rem;
  }

  &__h2 {
    font-family: $font-principal;
    font-size: 1.1rem;
    font-weight: 700;
  }

  &__all {
    font-size: $text-sm;
    font-weight: 600;
    color: $accent;
  }

  &__list {
    @include flex(column, stretch, flex-start, 0.5rem);
  }
}
</style>
