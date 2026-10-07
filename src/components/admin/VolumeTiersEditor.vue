<script setup lang="ts">
import type { VolumeDiscount } from '@/types'

/** Tramos "desde N unidades, X% menos". El backend aplica el de mayor cantidad alcanzada. */
const tiers = defineModel<VolumeDiscount[]>({ required: true })

function update(index: number, key: keyof VolumeDiscount, raw: string) {
  const value = Number(raw)
  tiers.value = tiers.value.map((tier, i) => (i === index ? { ...tier, [key]: value } : tier))
}

function add() {
  const last = tiers.value[tiers.value.length - 1]
  tiers.value = [
    ...tiers.value,
    { minQty: last ? last.minQty + 1 : 2, percent: last ? last.percent + 5 : 10 },
  ]
}

function remove(index: number) {
  tiers.value = tiers.value.filter((_, i) => i !== index)
}
</script>

<template>
  <div class="tiers">
    <p v-if="!tiers.length" class="tiers__empty">Sin descuentos por cantidad.</p>
    <div v-for="(tier, index) in tiers" :key="index" class="tiers__row">
      <span class="tiers__text">Desde</span>
      <input
        class="tiers__num"
        type="number"
        min="2"
        step="1"
        :value="tier.minQty"
        :aria-label="`Cantidad mínima del tramo ${index + 1}`"
        @input="update(index, 'minQty', ($event.target as HTMLInputElement).value)"
      />
      <span class="tiers__text">unidades,</span>
      <input
        class="tiers__num"
        type="number"
        min="1"
        max="100"
        step="1"
        :value="tier.percent"
        :aria-label="`Porcentaje del tramo ${index + 1}`"
        @input="update(index, 'percent', ($event.target as HTMLInputElement).value)"
      />
      <span class="tiers__text">% de descuento</span>
      <button class="tiers__remove" type="button" aria-label="Quitar tramo" @click="remove(index)">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
    <button class="tiers__add" type="button" @click="add">
      <i class="fa-solid fa-plus"></i> Agregar descuento por cantidad
    </button>
  </div>
</template>

<style scoped lang="scss">
.tiers {
  @include flex(column, stretch, flex-start, 0.6rem);

  &__empty {
    font-size: $text-sm;
    color: $ink-muted;
  }

  &__row {
    @include flex(row, center, flex-start, 0.45rem);
    flex-wrap: wrap;
    padding: 0.6rem 0.75rem;
    border-radius: $radius-sm;
    background: $paper;
    border: 1px solid $line;
  }

  &__text {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__num {
    width: 4.5rem;
    padding: 0.45rem 0.55rem;
    text-align: center;
  }

  &__remove {
    margin-left: auto;
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
