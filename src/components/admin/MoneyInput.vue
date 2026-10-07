<script setup lang="ts">
import { ref, watch } from 'vue'
import { centsToInput, parseDollars, toCents } from '@/composables/admin/money'

/**
 * Nathalie escribe dólares ("12,50"); el modelo siempre guarda centavos (1250).
 * Con `nullable`, dejarlo vacío significa "sin valor" en vez de $0.
 */
const props = defineProps<{ id?: string; nullable?: boolean; placeholder?: string }>()
const model = defineModel<number | null>({ required: true })

const text = ref(centsToInput(model.value))
const focused = ref(false)

watch(model, (value) => {
  if (!focused.value) text.value = centsToInput(value)
})

function onInput(event: Event) {
  text.value = (event.target as HTMLInputElement).value
  const dollars = parseDollars(text.value)
  if (dollars === null) model.value = props.nullable ? null : 0
  else model.value = toCents(dollars)
}

function onBlur() {
  focused.value = false
  text.value = centsToInput(model.value)
}
</script>

<template>
  <div class="money">
    <span class="money__symbol">$</span>
    <input
      :id="id"
      class="money__input"
      type="text"
      inputmode="decimal"
      autocomplete="off"
      :placeholder="placeholder ?? '0.00'"
      :value="text"
      @focus="focused = true"
      @input="onInput"
      @blur="onBlur"
    />
  </div>
</template>

<style scoped lang="scss">
.money {
  position: relative;

  &__symbol {
    position: absolute;
    left: 0.9rem;
    top: 50%;
    transform: translateY(-50%);
    color: $ink-muted;
    font-weight: 600;
    pointer-events: none;
  }

  &__input {
    padding-left: 1.9rem;
    font-variant-numeric: tabular-nums;
  }
}
</style>
