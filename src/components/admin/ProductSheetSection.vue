<script setup lang="ts">
import AdminCard from './AdminCard.vue'
import AdminField from './AdminField.vue'
import ListEditor from './ListEditor.vue'
import type { ProductInput } from '@/services/adminProducts.service'

const form = defineModel<ProductInput>({ required: true })
</script>

<template>
  <AdminCard
    title="Ficha del producto"
    icon="fa-solid fa-list-check"
    description="La información detallada que se muestra en la página del producto. Todo es opcional."
  >
    <AdminField
      label="Beneficios"
      hint="Frases cortas. Se muestran como una lista con viñetas."
      grow
    >
      <ListEditor
        v-model="form.benefits"
        placeholder="Ej. Fortalece cabello y uñas"
        add-label="Agregar beneficio"
      />
    </AdminField>
    <AdminField label="Modo de uso" for="p-usage" grow>
      <textarea
        id="p-usage"
        v-model="form.usage"
        rows="3"
        placeholder="Ej. Disolver 1 cucharada en 200 ml de agua"
      ></textarea>
    </AdminField>
    <AdminField label="Ingredientes" for="p-ingredients" grow>
      <textarea id="p-ingredients" v-model="form.ingredients" rows="3"></textarea>
    </AdminField>
    <AdminField
      label="Información nutricional"
      for="p-nutrition"
      hint="Puedes escribir una línea por dato; los saltos de línea se respetan."
      grow
    >
      <textarea id="p-nutrition" v-model="form.nutritionInfo" rows="4"></textarea>
    </AdminField>
    <AdminField label="Advertencias" for="p-warnings" grow>
      <textarea id="p-warnings" v-model="form.warnings" rows="2"></textarea>
    </AdminField>
  </AdminCard>
</template>

<style scoped lang="scss">
textarea {
  resize: vertical;
}
</style>
