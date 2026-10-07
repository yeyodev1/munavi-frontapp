<script setup lang="ts">
import ImageUploader from './ImageUploader.vue'
import ToggleSwitch from './ToggleSwitch.vue'
import type { ImageRef, Variant } from '@/types'

/** Sabores del producto. Stock vacío = no se controla inventario de ese sabor. */
const variants = defineModel<Variant[]>({ required: true })

function patch(index: number, changes: Partial<Variant>) {
  variants.value = variants.value.map((v, i) => (i === index ? { ...v, ...changes } : v))
}

function setStock(index: number, raw: string) {
  const trimmed = raw.trim()
  patch(index, { stock: trimmed === '' ? null : Math.max(0, Math.floor(Number(trimmed))) })
}

function add() {
  variants.value = [
    ...variants.value,
    { name: '', slug: '', image: null, stock: null, isActive: true },
  ]
}

function remove(index: number) {
  variants.value = variants.value.filter((_, i) => i !== index)
}
</script>

<template>
  <div class="variants">
    <p v-if="!variants.length" class="variants__empty">
      Sin sabores: el producto se venderá como "Único". Agrega sabores si tiene varios.
    </p>

    <article v-for="(variant, index) in variants" :key="index" class="variants__item">
      <div class="variants__fields">
        <div class="variants__field variants__field--name">
          <label :for="`variant-name-${index}`">Nombre del sabor</label>
          <input
            :id="`variant-name-${index}`"
            :value="variant.name"
            placeholder="Ej. Fresa"
            @input="patch(index, { name: ($event.target as HTMLInputElement).value })"
          />
        </div>
        <div class="variants__field">
          <label :for="`variant-stock-${index}`">Unidades disponibles</label>
          <input
            :id="`variant-stock-${index}`"
            type="number"
            min="0"
            step="1"
            placeholder="Sin control"
            :value="variant.stock ?? ''"
            @input="setStock(index, ($event.target as HTMLInputElement).value)"
          />
        </div>
      </div>
      <p class="variants__hint">
        Deja las unidades vacías si no quieres llevar la cuenta del inventario.
      </p>

      <ImageUploader
        compact
        label="Foto del sabor"
        :model-value="variant.image"
        @update:model-value="patch(index, { image: $event as ImageRef | null })"
      />

      <div class="variants__foot">
        <ToggleSwitch
          :model-value="variant.isActive"
          label="Disponible"
          hint="Apágalo para ocultar este sabor sin borrarlo"
          @update:model-value="patch(index, { isActive: $event })"
        />
        <button class="variants__remove" type="button" @click="remove(index)">
          <i class="fa-solid fa-trash-can"></i> Quitar sabor
        </button>
      </div>
    </article>

    <button class="variants__add" type="button" @click="add">
      <i class="fa-solid fa-plus"></i> Agregar sabor
    </button>
  </div>
</template>

<style scoped lang="scss">
.variants {
  @include flex(column, stretch, flex-start, 0.8rem);

  &__empty {
    font-size: $text-sm;
    color: $ink-muted;
  }

  &__item {
    @include flex(column, stretch, flex-start, 0.75rem);
    padding: 1rem;
    border: 1px solid $line;
    border-radius: $radius-sm;
    background: $paper;
  }

  &__fields {
    @include flex(row, flex-end, flex-start, 0.75rem);
    flex-wrap: wrap;
  }

  &__field {
    flex: 1 1 140px;
    min-width: 0;

    &--name {
      flex-basis: 220px;
    }
  }

  &__hint {
    margin-top: -0.4rem;
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__foot {
    @include flex(row, center, space-between, 0.75rem);
    flex-wrap: wrap;
  }

  &__remove {
    @include flex(row, center, center, 0.4rem);
    font-size: 0.82rem;
    font-weight: 600;
    color: $danger;
  }

  &__add {
    @include flex(row, center, center, 0.4rem);
    align-self: flex-start;
    padding: 0.55rem 1rem;
    border: 1px dashed $accent;
    border-radius: $radius-pill;
    color: $accent;
    font-size: 0.85rem;
    font-weight: 600;
  }
}
</style>
