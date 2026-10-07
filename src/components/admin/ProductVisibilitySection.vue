<script setup lang="ts">
import AdminCard from './AdminCard.vue'
import AdminField from './AdminField.vue'
import ToggleSwitch from './ToggleSwitch.vue'
import type { ProductInput } from '@/services/adminProducts.service'

const form = defineModel<ProductInput>({ required: true })
</script>

<template>
  <AdminCard title="Visibilidad" icon="fa-solid fa-eye">
    <ToggleSwitch
      v-model="form.isPublished"
      label="Publicado"
      hint="Si está apagado, el producto no aparece en la tienda"
    />
    <ToggleSwitch
      v-model="form.isFeatured"
      label="Destacado"
      hint="Aparece en la portada de la tienda"
    />
    <ToggleSwitch
      v-model="form.isBestSeller"
      label="Más vendido"
      hint="Muestra la etiqueta de más vendido"
    />
    <AdminField
      label="Orden"
      for="p-order"
      hint="Los números más bajos aparecen primero. Si no te importa el orden, déjalo en 0."
    >
      <input id="p-order" v-model.number="form.order" type="number" step="1" />
    </AdminField>
  </AdminCard>
</template>
