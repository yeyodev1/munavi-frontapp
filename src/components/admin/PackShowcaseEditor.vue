<script setup lang="ts">
import { computed, ref } from 'vue'
import { adminProductsService } from '@/services/adminProducts.service'
import type { PackShowcaseItem, Product } from '@/types'

const MAX = 10

/** Vitrina de packs del inicio: producto + sabor (slugs), en orden de aparición. */
const rows = defineModel<PackShowcaseItem[]>({ required: true })

const products = ref<Product[]>([])
const loadError = ref(false)
// Solo tiene sentido mostrar en la vitrina lo que tiene precios por cantidad.
const withPacks = computed(() => products.value.filter((p) => p.bundlePrices?.length))

// shortcut: una página de 100 cubre el catálogo actual; paginar si llega a más.
adminProductsService
  .list({ limit: 100 })
  .then(({ items }) => (products.value = items))
  .catch(() => (loadError.value = true))

function variantsOf(slug: string) {
  return products.value.find((p) => p.slug === slug)?.variants ?? []
}

function isKnown(slug: string) {
  return withPacks.value.some((p) => p.slug === slug)
}

function update(index: number, patch: Partial<PackShowcaseItem>) {
  rows.value = rows.value.map((row, i) => (i === index ? { ...row, ...patch } : row))
}

function move(index: number, delta: number) {
  const next = [...rows.value]
  const [row] = next.splice(index, 1)
  next.splice(index + delta, 0, row!)
  rows.value = next
}

function remove(index: number) {
  rows.value = rows.value.filter((_, i) => i !== index)
}
</script>

<template>
  <div class="showcase">
    <p v-if="loadError" class="showcase__hint">
      No se pudieron cargar los productos. Recarga la página para editar la vitrina.
    </p>
    <p v-else-if="!rows.length" class="showcase__hint">Sin productos todavía.</p>

    <div v-for="(row, index) in rows" :key="index" class="showcase__row">
      <span class="showcase__pos">{{ index + 1 }}</span>
      <select
        class="showcase__product"
        :value="row.product"
        :aria-label="`Producto ${index + 1}`"
        @change="
          update(index, { product: ($event.target as HTMLSelectElement).value, variant: '' })
        "
      >
        <option value="" disabled>Elige producto</option>
        <option v-if="row.product && !isKnown(row.product)" :value="row.product">
          {{ row.product }} (sin precios por cantidad)
        </option>
        <option v-for="product in withPacks" :key="product.slug" :value="product.slug">
          {{ product.name }}
        </option>
      </select>
      <select
        class="showcase__variant"
        :value="row.variant"
        :aria-label="`Sabor del producto ${index + 1}`"
        @change="update(index, { variant: ($event.target as HTMLSelectElement).value })"
      >
        <option value="">Foto principal</option>
        <option
          v-for="variant in variantsOf(row.product)"
          :key="variant.slug"
          :value="variant.slug"
        >
          {{ variant.name }}{{ variant.isActive ? '' : ' (oculto)' }}
        </option>
      </select>
      <div class="showcase__tools">
        <button type="button" aria-label="Subir" :disabled="index === 0" @click="move(index, -1)">
          <i class="fa-solid fa-arrow-up"></i>
        </button>
        <button
          type="button"
          aria-label="Bajar"
          :disabled="index === rows.length - 1"
          @click="move(index, 1)"
        >
          <i class="fa-solid fa-arrow-down"></i>
        </button>
        <button
          class="showcase__remove"
          type="button"
          aria-label="Quitar de la vitrina"
          @click="remove(index)"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>

    <button
      v-if="rows.length < MAX"
      class="showcase__add"
      type="button"
      @click="rows = [...rows, { product: '', variant: '' }]"
    >
      <i class="fa-solid fa-plus"></i> Agregar producto
    </button>
    <p v-else class="showcase__hint">Llegaste al máximo de {{ MAX }}.</p>
  </div>
</template>

<style scoped lang="scss">
.showcase {
  @include flex(column, stretch, flex-start, 0.5rem);

  &__hint {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__row {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
  }

  &__pos {
    flex: none;
    width: 1.4rem;
    font-weight: 700;
    color: $ink-soft;
  }

  &__product,
  &__variant {
    flex: 1 1 10rem;
    min-width: 0;
  }

  &__tools {
    @include flex(row, center, flex-start, 0.2rem);
    flex: none;

    button {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      color: $ink-soft;

      &:hover:not(:disabled) {
        background: $sand;
      }

      &:disabled {
        opacity: 0.35;
      }
    }
  }

  &__tools &__remove {
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
