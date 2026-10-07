<script setup lang="ts">
import { ref, watch } from 'vue'
import { checkoutCopy } from '@/config/copy/checkout'

const props = defineProps<{
  applied: { code: string; percent: number } | null
  error: string
  loading: boolean
}>()
const emit = defineEmits<{ apply: [code: string]; remove: [] }>()

const copy = checkoutCopy.coupon
const open = ref(false)
const code = ref('')

// Si el cupón llega aplicado o con error, el campo queda abierto para verlo.
watch(
  () => [props.applied, props.error],
  () => {
    if (props.applied || props.error) open.value = true
  },
  { immediate: true },
)

function submit() {
  if (code.value.trim()) emit('apply', code.value)
}
</script>

<template>
  <div class="coupon">
    <button v-if="!open" type="button" class="coupon__toggle" :aria-expanded="open" @click="open = true">
      <i class="fa-solid fa-ticket" aria-hidden="true"></i>
      {{ copy.toggle }}
    </button>

    <div v-else-if="applied" class="coupon__applied" role="status">
      <i class="fa-solid fa-circle-check" aria-hidden="true"></i>
      <span>{{ copy.applied(applied.code, applied.percent) }}</span>
      <button type="button" class="coupon__remove" :aria-label="copy.remove" @click="emit('remove')">
        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
      </button>
    </div>

    <!-- div y no form: vive dentro del formulario del checkout -->
    <div v-else class="coupon__form">
      <label for="co-coupon" class="visually-hidden">{{ copy.label }}</label>
      <div class="coupon__row">
        <input
          id="co-coupon"
          v-model="code"
          class="coupon__input"
          autocomplete="off"
          :placeholder="copy.placeholder"
          :aria-invalid="!!error"
          :aria-describedby="error ? 'co-coupon-error' : undefined"
          @keydown.enter.prevent="submit"
        />
        <button type="button" class="btn btn--dark coupon__apply" :disabled="loading || !code.trim()" @click="submit">
          {{ copy.apply }}
        </button>
      </div>
      <p v-if="error" id="co-coupon-error" class="coupon__error" role="alert">
        <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i>
        {{ error }}
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.coupon {
  &__toggle {
    @include flex(row, center, flex-start, 0.5rem);
    font-size: $text-sm;
    font-weight: 600;
    color: $accent;

    &:hover {
      text-decoration: underline;
    }
  }

  &__row {
    @include flex(row, stretch, flex-start, 0.5rem);
  }

  &__input {
    flex: 1;
    min-width: 0;
    text-transform: uppercase;
  }

  &__apply {
    flex: 0 0 auto;
    padding-inline: 1.2rem;
  }

  &__error {
    @include flex(row, center, flex-start, 0.35rem);
    margin-top: 0.4rem;
    font-size: $text-xs;
    color: $danger;
  }

  &__applied {
    @include flex(row, center, flex-start, 0.5rem);
    padding: 0.7rem 0.9rem;
    border-radius: $radius-sm;
    background: $success-bg;
    font-size: $text-sm;
    font-weight: 600;
    color: $ink;

    > i {
      color: $success;
    }

    span {
      flex: 1;
    }
  }

  &__remove {
    @include flex(row, center, center);
    width: 1.8rem;
    height: 1.8rem;
    border-radius: 50%;
    color: $ink-muted;

    &:hover {
      color: $danger;
    }
  }
}
</style>
