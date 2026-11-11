<script setup lang="ts">
import MoneyInput from './MoneyInput.vue'
import { money } from '@/composables/admin/money'
import type { BundlePrice } from '@/types'

/** Packs "N unidades por $X": precio final del pack, no un porcentaje. */
const bundles = defineModel<BundlePrice[]>({ required: true })
// Precio con tarjeta (centavos): contra él se calcula cuánto ahorra la clienta.
const props = defineProps<{ unitPrice: number }>()

function update(index: number, patch: Partial<BundlePrice>) {
  bundles.value = bundles.value.map((b, i) => (i === index ? { ...b, ...patch } : b))
}

function add() {
  const last = bundles.value[bundles.value.length - 1]
  bundles.value = [...bundles.value, { qty: last ? last.qty + 1 : 2, total: 0 }]
}

function remove(index: number) {
  bundles.value = bundles.value.filter((_, i) => i !== index)
}

function summary({ qty, total }: BundlePrice): string {
  if (qty < 2 || total <= 0 || !props.unitPrice) return ''
  const normal = props.unitPrice * qty
  const saving = normal - total
  const percent = ((saving / normal) * 100).toFixed(1).replace('.', ',')
  return `Precio normal ${money(normal)} · Ahorro ${money(saving)} (${percent} %) · ${money(Math.round(total / qty))} c/u`
}
</script>

<template>
  <div class="bundles">
    <p v-if="!bundles.length" class="bundles__empty">Sin packs. Ej. 2 unidades por $25.</p>
    <div v-for="(bundle, index) in bundles" :key="index" class="bundles__row">
      <div class="bundles__inputs">
        <label class="bundles__field">
          <span class="bundles__text">Unidades</span>
          <input
            class="bundles__num"
            type="number"
            min="2"
            max="50"
            step="1"
            :value="bundle.qty"
            @input="update(index, { qty: Number(($event.target as HTMLInputElement).value) })"
          />
        </label>
        <label class="bundles__field bundles__field--grow">
          <span class="bundles__text">Precio del pack</span>
          <MoneyInput
            :model-value="bundle.total"
            @update:model-value="update(index, { total: $event ?? 0 })"
          />
        </label>
        <button
          class="bundles__remove"
          type="button"
          aria-label="Quitar pack"
          @click="remove(index)"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <p v-if="summary(bundle)" class="bundles__summary">{{ summary(bundle) }}</p>
    </div>
    <button class="bundles__add" type="button" @click="add">
      <i class="fa-solid fa-plus"></i> Agregar pack
    </button>
  </div>
</template>

<style scoped lang="scss">
.bundles {
  @include flex(column, stretch, flex-start, 0.6rem);

  &__empty {
    font-size: $text-sm;
    color: $ink-muted;
  }

  &__row {
    @include flex(column, stretch, flex-start, 0.4rem);
    padding: 0.6rem 0.75rem;
    border-radius: $radius-sm;
    background: $paper;
    border: 1px solid $line;
  }

  &__inputs {
    @include flex(row, flex-end, flex-start, 0.6rem);
  }

  &__field {
    @include flex(column, stretch, flex-start, 0.25rem);
    margin: 0;

    &--grow {
      flex: 1;
      min-width: 0;
    }
  }

  &__text {
    font-size: $text-xs;
    font-weight: 600;
    color: $ink-soft;
  }

  &__num {
    width: 4.5rem;
    padding: 0.45rem 0.55rem;
    text-align: center;
  }

  &__summary {
    font-size: $text-xs;
    color: $ink-muted;
    font-variant-numeric: tabular-nums;
  }

  &__remove {
    flex: none;
    width: 2rem;
    height: 2rem;
    margin-bottom: 0.3rem;
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
