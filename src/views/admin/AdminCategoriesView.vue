<script setup lang="ts">
import { ref } from 'vue'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminEmpty from '@/components/admin/AdminEmpty.vue'
import CategoryRow from '@/components/admin/CategoryRow.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import { useAdminCategories } from '@/composables/admin/useAdminCategories'
import type { AdminCategory } from '@/services/adminCategories.service'

const { items, loading, busyId, create, save, remove } = useAdminCategories()

const newName = ref('')
const toDelete = ref<AdminCategory | null>(null)

async function onCreate() {
  if (await create(newName.value)) newName.value = ''
}

async function onConfirmDelete() {
  const category = toDelete.value
  toDelete.value = null
  if (category) await remove(category)
}
</script>

<template>
  <section class="cats">
    <AdminPageHeader
      title="Categorías"
      subtitle="Agrupan los productos en la tienda (por ejemplo, Colágenos o Vitaminas). El orden define cuál aparece primero."
    />

    <form class="cats__new" @submit.prevent="onCreate">
      <label for="cat-new" class="visually-hidden">Nombre de la nueva categoría</label>
      <input id="cat-new" v-model="newName" placeholder="Nombre de la nueva categoría" />
      <button class="btn btn--primary" type="submit" :disabled="busyId === 'new'">
        <i class="fa-solid fa-plus"></i> Agregar
      </button>
    </form>

    <p v-if="loading && !items.length" class="cats__loading">
      <i class="fa-solid fa-spinner fa-spin"></i> Cargando…
    </p>

    <AdminEmpty
      v-else-if="!items.length"
      icon="fa-solid fa-folder-open"
      title="Todavía no hay categorías"
      text="Crea la primera con el campo de arriba."
    />

    <div v-else class="cats__list">
      <CategoryRow
        v-for="category in items"
        :key="category._id"
        :category="category"
        :busy="busyId === category._id"
        @save="save(category._id, $event)"
        @remove="toDelete = category"
      />
    </div>

    <BaseModal
      :open="Boolean(toDelete)"
      :title="`¿Eliminar ${toDelete?.name ?? ''}?`"
      :message="
        toDelete?.productCount
          ? `Tiene ${toDelete.productCount} producto(s): no se podrá eliminar hasta moverlos a otra categoría.`
          : 'No tiene productos. Se elimina de forma permanente.'
      "
      confirm-label="Eliminar"
      danger
      @confirm="onConfirmDelete"
      @cancel="toDelete = null"
    />
  </section>
</template>

<style scoped lang="scss">
.cats {
  &__new {
    @include flex(row, center, flex-start, 0.6rem);
    margin-bottom: 1.4rem;

    input {
      flex: 1;
      min-width: 0;
    }

    .btn {
      flex: none;
      padding-inline: 1.2rem;
    }
  }

  &__loading {
    color: $ink-soft;
  }

  &__list {
    @include flex(column, stretch, flex-start, 0.6rem);
  }
}
</style>
