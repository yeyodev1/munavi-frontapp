<script setup lang="ts">
import MoneyInput from './MoneyInput.vue'
import { site } from '@/config/site'

type Surcharge = { province: string; amount: number }

/** Recargo fijo por provincia (Galápagos y similares), en centavos. */
const surcharges = defineModel<Surcharge[]>({ required: true })

function update(index: number, patch: Partial<Surcharge>) {
  surcharges.value = surcharges.value.map((s, i) => (i === index ? { ...s, ...patch } : s))
}

function remove(index: number) {
  surcharges.value = surcharges.value.filter((_, i) => i !== index)
}
</script>

<template>
  <div class="surcharges">
    <p class="surcharges__label">Recargos por destino</p>
    <p class="surcharges__hint">
      Para destinos con costo de envío adicional (por ejemplo Galápagos). Se suma aunque el envío
      sea gratis.
    </p>
    <div v-for="(row, index) in surcharges" :key="index" class="surcharges__row">
      <select
        class="surcharges__province"
        :value="row.province"
        :aria-label="`Provincia del recargo ${index + 1}`"
        @change="update(index, { province: ($event.target as HTMLSelectElement).value })"
      >
        <option value="" disabled>Elige provincia</option>
        <option v-for="province in site.provinces" :key="province" :value="province">
          {{ province }}
        </option>
      </select>
      <MoneyInput
        class="surcharges__amount"
        :model-value="row.amount"
        @update:model-value="update(index, { amount: $event ?? 0 })"
      />
      <button
        class="surcharges__remove"
        type="button"
        aria-label="Quitar recargo"
        @click="remove(index)"
      >
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
    <button
      class="surcharges__add"
      type="button"
      @click="surcharges = [...surcharges, { province: '', amount: 0 }]"
    >
      <i class="fa-solid fa-plus"></i> Agregar recargo
    </button>
  </div>
</template>

<style scoped lang="scss">
.surcharges {
  @include flex(column, stretch, flex-start, 0.5rem);

  &__label {
    font-size: 0.85rem;
    font-weight: 600;
    color: $ink;
  }

  &__hint {
    font-size: $text-xs;
    line-height: 1.45;
    color: $ink-muted;
  }

  &__row {
    @include flex(row, center, flex-start, 0.5rem);
  }

  &__province {
    flex: 1;
    min-width: 0;
  }

  &__amount {
    width: 8rem;
    flex: none;
  }

  &__remove {
    flex: none;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    color: $danger;

    &:hover {
      background: $danger-bg;
    }
  }

  &__add {
    @include flex(row, center, center, 0.4rem);
    align-self: flex-start;
    padding: 0.5rem 0.9rem;
    border: 1px dashed $accent;
    border-radius: $radius-pill;
    color: $accent;
    font-size: 0.82rem;
    font-weight: 600;
  }
}
</style>
