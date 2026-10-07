<script setup lang="ts">
import { computed } from 'vue'
import AdminField from './AdminField.vue'
import MoneyInput from './MoneyInput.vue'
import type { Prices } from '@/types'

const prices = defineModel<Prices>('prices', { required: true })
const compareAt = defineModel<number | null>('compareAt', { required: true })

function setPrice(key: keyof Prices, cents: number | null) {
  prices.value = { ...prices.value, [key]: cents ?? 0 }
}

const cardWarning = computed(() => {
  const { card, transfer, cashOnDelivery } = prices.value
  if (!card) return ''
  if (card > transfer || card > cashOnDelivery) {
    return 'Ojo: el precio con tarjeta es más alto que otro. Normalmente es el más bajo.'
  }
  return ''
})

const compareWarning = computed(() =>
  compareAt.value !== null && compareAt.value <= prices.value.card
    ? 'El precio tachado tiene que ser mayor que el precio con tarjeta, si no, no se ve como oferta.'
    : '',
)
</script>

<template>
  <div class="prices">
    <div class="prices__row">
      <AdminField
        label="Precio con tarjeta"
        for="price-card"
        hint="El precio con tarjeta debe ser el más bajo: es el que se destaca en la tienda."
        :warning="cardWarning"
      >
        <MoneyInput
          id="price-card"
          :model-value="prices.card"
          @update:model-value="setPrice('card', $event)"
        />
      </AdminField>
      <AdminField label="Precio por transferencia" for="price-transfer">
        <MoneyInput
          id="price-transfer"
          :model-value="prices.transfer"
          @update:model-value="setPrice('transfer', $event)"
        />
      </AdminField>
      <AdminField label="Precio contra entrega" for="price-cod">
        <MoneyInput
          id="price-cod"
          :model-value="prices.cashOnDelivery"
          @update:model-value="setPrice('cashOnDelivery', $event)"
        />
      </AdminField>
    </div>
    <AdminField
      label="Precio antes (tachado, opcional)"
      for="price-compare"
      hint="Si lo llenas, la tienda lo muestra tachado junto al precio con tarjeta. Déjalo vacío si no hay promoción."
      :warning="compareWarning"
    >
      <MoneyInput id="price-compare" v-model="compareAt" nullable placeholder="Sin promoción" />
    </AdminField>
  </div>
</template>

<style scoped lang="scss">
.prices {
  @include flex(column, stretch, flex-start, 1rem);

  &__row {
    @include flex(row, flex-start, flex-start, 1rem);
    flex-wrap: wrap;
  }
}
</style>
