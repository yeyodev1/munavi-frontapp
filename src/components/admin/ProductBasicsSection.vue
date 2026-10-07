<script setup lang="ts">
import AdminCard from './AdminCard.vue'
import AdminField from './AdminField.vue'
import type { ProductInput } from '@/services/adminProducts.service'
import type { AdminCategory } from '@/services/adminCategories.service'

// El formulario es un objeto reactivo del padre: se editan sus campos en el lugar.
const form = defineModel<ProductInput>({ required: true })
defineProps<{ categories: AdminCategory[] }>()
</script>

<template>
  <AdminCard
    title="Datos básicos"
    icon="fa-solid fa-tag"
    description="Lo primero que ve la clienta en la tienda."
  >
    <div class="row">
      <AdminField label="Nombre del producto" for="p-name" grow>
        <input id="p-name" v-model="form.name" placeholder="Ej. Colágeno hidrolizado con biotina" />
      </AdminField>
      <AdminField label="Categoría" for="p-category">
        <select id="p-category" v-model="form.category">
          <option value="" disabled>Elige una categoría</option>
          <option v-for="category in categories" :key="category._id" :value="category._id">
            {{ category.name }}{{ category.isActive ? '' : ' (oculta)' }}
          </option>
        </select>
      </AdminField>
      <AdminField
        label="Presentación"
        for="p-presentation"
        hint="Ej. Tarro 400 g, Frasco 60 cápsulas"
      >
        <input id="p-presentation" v-model="form.presentation" />
      </AdminField>
    </div>
    <AdminField
      label="Descripción corta"
      for="p-short"
      hint="Una o dos frases. Aparece debajo del nombre en el listado de la tienda."
      grow
    >
      <input id="p-short" v-model="form.shortDescription" maxlength="200" />
    </AdminField>
    <AdminField label="Descripción completa" for="p-description" grow>
      <textarea id="p-description" v-model="form.description" rows="5"></textarea>
    </AdminField>
  </AdminCard>
</template>

<style scoped lang="scss">
.row {
  @include flex(row, flex-start, flex-start, 1rem);
  flex-wrap: wrap;
}

textarea {
  resize: vertical;
}
</style>
