<script setup lang="ts">
import AdminCard from './AdminCard.vue'
import AdminField from './AdminField.vue'
import ToggleSwitch from './ToggleSwitch.vue'
import MoneyInput from './MoneyInput.vue'
import type { CouponInput } from '@/services/adminCoupons.service'

/** Crea un cupón o, con `editing`, edita el que se cargó en el borrador. */
defineProps<{ editing: string | null; busy: boolean }>()
defineEmits<{ submit: []; cancel: [] }>()
const draft = defineModel<CouponInput>({ required: true })
</script>

<template>
  <AdminCard
    :title="editing ? `Editar cupón ${editing}` : 'Nuevo cupón'"
    :icon="editing ? 'fa-solid fa-pen' : 'fa-solid fa-plus'"
  >
    <form class="cform" @submit.prevent="$emit('submit')">
      <AdminField label="Código" for="c-code" hint="Letras y números, sin espacios. Ej. MAMA15">
        <input
          id="c-code"
          v-model="draft.code"
          class="cform__code"
          required
          minlength="3"
          maxlength="40"
        />
      </AdminField>
      <AdminField label="Descuento (%)" for="c-percent">
        <input
          id="c-percent"
          v-model.number="draft.percent"
          type="number"
          min="1"
          max="100"
          step="1"
          required
        />
      </AdminField>
      <AdminField label="Vence el (opcional)" for="c-expires" hint="Vacío = no vence">
        <input id="c-expires" v-model="draft.expiresAt" type="date" />
      </AdminField>
      <AdminField label="Compra mínima (opcional)" for="c-min" hint="Vacío = sin mínimo">
        <MoneyInput id="c-min" v-model="draft.minSubtotal" nullable placeholder="Sin mínimo" />
      </AdminField>
      <div class="cform__toggles">
        <ToggleSwitch v-model="draft.firstPurchaseOnly" label="Solo primera compra" />
        <ToggleSwitch
          v-model="draft.regularPriceOnly"
          label="Solo productos a precio regular (no se acumula con packs)"
        />
      </div>
      <div class="cform__submit">
        <button v-if="editing" class="btn btn--ghost" type="button" @click="$emit('cancel')">
          Cancelar edición
        </button>
        <button class="btn btn--primary" type="submit" :disabled="busy">
          <i :class="editing ? 'fa-solid fa-floppy-disk' : 'fa-solid fa-plus'"></i>
          {{ editing ? 'Guardar cambios' : 'Crear cupón' }}
        </button>
      </div>
    </form>
  </AdminCard>
</template>

<style scoped lang="scss">
.cform {
  @include flex(row, flex-start, flex-start, 1rem);
  flex-wrap: wrap;

  &__code {
    text-transform: uppercase;
  }

  &__toggles {
    @include flex(column, stretch, flex-start, 0.6rem);
    flex: 1 1 100%;
  }

  &__submit {
    @include flex(row, center, flex-end, 0.6rem);
    flex: 1 1 100%;
  }
}
</style>
