<script setup lang="ts">
/** Lista de textos cortos (beneficios): agregar, editar, reordenar y quitar. */
withDefaults(defineProps<{ placeholder?: string; addLabel?: string }>(), {
  placeholder: '',
  addLabel: 'Agregar',
})
const items = defineModel<string[]>({ required: true })

function update(index: number, value: string) {
  items.value = items.value.map((item, i) => (i === index ? value : item))
}

function move(index: number, delta: number) {
  const next = [...items.value]
  const target = index + delta
  if (target < 0 || target >= next.length) return
  ;[next[index], next[target]] = [next[target]!, next[index]!]
  items.value = next
}

function remove(index: number) {
  items.value = items.value.filter((_, i) => i !== index)
}
</script>

<template>
  <div class="lineed">
    <div v-for="(item, index) in items" :key="index" class="lineed__row">
      <span class="lineed__bullet" aria-hidden="true"><i class="fa-solid fa-check"></i></span>
      <input
        :value="item"
        :placeholder="placeholder"
        :aria-label="`Elemento ${index + 1}`"
        @input="update(index, ($event.target as HTMLInputElement).value)"
      />
      <div class="lineed__tools">
        <button type="button" :disabled="index === 0" aria-label="Subir" @click="move(index, -1)">
          <i class="fa-solid fa-arrow-up"></i>
        </button>
        <button
          type="button"
          :disabled="index === items.length - 1"
          aria-label="Bajar"
          @click="move(index, 1)"
        >
          <i class="fa-solid fa-arrow-down"></i>
        </button>
        <button type="button" class="lineed__remove" aria-label="Quitar" @click="remove(index)">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
    <button class="lineed__add" type="button" @click="items = [...items, '']">
      <i class="fa-solid fa-plus"></i> {{ addLabel }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.lineed {
  @include flex(column, stretch, flex-start, 0.5rem);

  &__row {
    @include flex(row, center, flex-start, 0.5rem);

    input {
      flex: 1;
      min-width: 0;
    }
  }

  &__bullet {
    flex: none;
    color: $success;
    font-size: 0.8rem;
  }

  &__tools {
    @include flex(row, center, flex-start, 0.15rem);
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
        opacity: 0.3;
      }
    }
  }

  &__remove {
    color: $danger !important;
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
