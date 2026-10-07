<script setup lang="ts">
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminPagination from '@/components/admin/AdminPagination.vue'
import AdminEmpty from '@/components/admin/AdminEmpty.vue'
import ProductRow from '@/components/admin/ProductRow.vue'
import { useAdminProducts } from '@/composables/admin/useAdminProducts'

const { items, categories, q, category, page, pages, total, loading, toggle } = useAdminProducts()
</script>

<template>
  <section class="products">
    <AdminPageHeader
      title="Productos"
      :subtitle="`${total} ${total === 1 ? 'producto' : 'productos'}. Toca un producto para editar precios, sabores y fotos.`"
    >
      <RouterLink to="/admin/productos/nuevo" class="btn btn--primary">
        <i class="fa-solid fa-plus"></i> Nuevo producto
      </RouterLink>
    </AdminPageHeader>

    <div class="products__filters">
      <label class="products__search">
        <i class="fa-solid fa-magnifying-glass"></i>
        <span class="visually-hidden">Buscar producto</span>
        <input v-model="q" type="search" placeholder="Buscar por nombre" />
      </label>
      <label v-if="categories.length" class="products__category">
        <span class="visually-hidden">Categoría</span>
        <select v-model="category">
          <option value="">Todas las categorías</option>
          <option v-for="c in categories" :key="c._id" :value="c._id">{{ c.name }}</option>
        </select>
      </label>
    </div>

    <p v-if="loading && !items.length" class="products__loading">
      <i class="fa-solid fa-spinner fa-spin"></i> Cargando productos…
    </p>

    <AdminEmpty
      v-else-if="!items.length"
      icon="fa-solid fa-box-open"
      :title="q || category ? 'Nada coincide con la búsqueda' : 'Todavía no hay productos'"
      :text="
        q || category
          ? 'Prueba con otra palabra o categoría.'
          : 'Crea el primero: nombre, precios, sabores y fotos.'
      "
    >
      <RouterLink v-if="!q && !category" to="/admin/productos/nuevo" class="btn btn--primary">
        Crear producto
      </RouterLink>
    </AdminEmpty>

    <div v-else class="products__list" :class="{ 'products__list--busy': loading }">
      <ProductRow
        v-for="product in items"
        :key="product._id"
        :product="product"
        @toggle="toggle(product, $event)"
      />
    </div>

    <AdminPagination v-model="page" :pages="pages" />
  </section>
</template>

<style scoped lang="scss">
.products {
  &__filters {
    @include flex(row, center, flex-start, 0.6rem);
    flex-wrap: wrap;
    margin-bottom: 1.2rem;
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

  &__category {
    flex: 1 1 200px;
    margin: 0;

    @include from('md') {
      flex: 0 0 240px;
    }
  }

  &__loading {
    color: $ink-soft;
  }

  &__list {
    @include flex(column, stretch, flex-start, 0.6rem);
    @include transition(opacity);

    &--busy {
      opacity: 0.6;
    }
  }
}
</style>
