<script setup lang="ts">
import { productDetailCopy as copy } from '@/config/copy/product'

const props = withDefaults(defineProps<{ min?: number; max?: number }>(), { min: 1, max: 50 })
const model = defineModel<number>({ required: true })

function set(value: number) {
  model.value = Math.min(props.max, Math.max(props.min, Math.round(value) || props.min))
}
</script>

<template>
  <div class="qty">
    <button type="button" class="qty__btn" :aria-label="copy.decrease" :disabled="model <= min" @click="set(model - 1)">
      <i class="fa-solid fa-minus" aria-hidden="true"></i>
    </button>
    <input
      class="qty__input"
      type="number"
      inputmode="numeric"
      :min="min"
      :max="max"
      :value="model"
      :aria-label="copy.quantity"
      @change="set(Number(($event.target as HTMLInputElement).value))"
    />
    <button type="button" class="qty__btn" :aria-label="copy.increase" :disabled="model >= max" @click="set(model + 1)">
      <i class="fa-solid fa-plus" aria-hidden="true"></i>
    </button>
  </div>
</template>

<style scoped lang="scss">
.qty {
  @include flex(row, center, space-between);
  border: 1.5px solid $line;
  border-radius: $radius-pill;
  background: $surface;
  height: 3rem;
  padding-inline: 0.3rem;

  &__btn {
    @include flex(row, center, center);
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 50%;
    color: $ink;
    font-size: 0.8rem;
    @include transition(background);

    &:hover {
      background: rgba($accent, 0.08);
    }

    &:disabled {
      opacity: 0.35;
      cursor: default;
    }
  }

  &__input {
    width: 2.8rem;
    border: none;
    padding: 0;
    text-align: center;
    font-weight: 600;
    background: transparent;
    -moz-appearance: textfield;

    &:focus {
      box-shadow: none;
    }

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
    }
  }
}
</style>
