<script setup lang="ts">
import CheckoutField from '@/components/checkout/CheckoutField.vue'
import type { CheckoutErrors, CheckoutField as Field, CheckoutForm } from '@/composables/useCheckoutForm'
import { site } from '@/config/site'
import { checkoutCopy } from '@/config/copy/checkout'

// `form` y `errors` son los reactive del composable: se editan en sitio.
defineProps<{ form: CheckoutForm; errors: CheckoutErrors }>()
const emit = defineEmits<{ blur: [field: Field]; input: [field: Field] }>()

const copy = checkoutCopy
const f = copy.fields

const contact: Array<{ key: Field; type: string; autocomplete: string; inputmode?: 'email' | 'tel' | 'numeric' }> = [
  { key: 'name', type: 'text', autocomplete: 'name' },
  { key: 'email', type: 'email', autocomplete: 'email', inputmode: 'email' },
  { key: 'phone', type: 'tel', autocomplete: 'tel', inputmode: 'tel' },
  { key: 'documentId', type: 'text', autocomplete: 'off', inputmode: 'numeric' },
]
</script>

<template>
  <fieldset class="details">
    <legend class="details__legend"><span>1</span>{{ copy.steps.contact }}</legend>
    <div class="details__fields">
      <CheckoutField v-for="field in contact" :id="`co-${field.key}`" :key="field.key" :label="f[field.key]" :error="errors[field.key]">
        <input
          :id="`co-${field.key}`"
          v-model="form[field.key]"
          :type="field.type"
          :autocomplete="field.autocomplete"
          :inputmode="field.inputmode"
          :aria-invalid="!!errors[field.key]"
          :aria-describedby="errors[field.key] ? `co-${field.key}-error` : undefined"
          @blur="emit('blur', field.key)"
          @input="emit('input', field.key)"
        />
      </CheckoutField>
    </div>
  </fieldset>

  <fieldset class="details">
    <legend class="details__legend"><span>2</span>{{ copy.steps.address }}</legend>
    <div class="details__fields">
      <CheckoutField id="co-province" :label="f.province" :error="errors.province">
        <select
          id="co-province"
          v-model="form.province"
          autocomplete="address-level1"
          :aria-invalid="!!errors.province"
          @change="emit('blur', 'province')"
        >
          <option value="" disabled>{{ f.provincePlaceholder }}</option>
          <option v-for="province in site.provinces" :key="province" :value="province">{{ province }}</option>
        </select>
      </CheckoutField>
      <CheckoutField id="co-city" :label="f.city" :error="errors.city">
        <input
          id="co-city"
          v-model="form.city"
          autocomplete="address-level2"
          :aria-invalid="!!errors.city"
          @blur="emit('blur', 'city')"
          @input="emit('input', 'city')"
        />
      </CheckoutField>
      <CheckoutField id="co-address" :label="f.address" :error="errors.address" wide>
        <input
          id="co-address"
          v-model="form.address"
          autocomplete="street-address"
          :placeholder="f.addressPlaceholder"
          :aria-invalid="!!errors.address"
          @blur="emit('blur', 'address')"
          @input="emit('input', 'address')"
        />
      </CheckoutField>
      <CheckoutField id="co-reference" :label="f.reference" wide>
        <input id="co-reference" v-model="form.reference" :placeholder="f.referencePlaceholder" />
      </CheckoutField>
    </div>
  </fieldset>
</template>

<style scoped lang="scss">
.details {
  border: none;
  padding: 0;
  margin: 0;
  min-width: 0;

  &__legend {
    @include flex(row, center, flex-start, 0.6rem);
    @include display($text-xl, 700);
    margin-bottom: 1rem;

    span {
      @include flex(row, center, center);
      width: 1.8rem;
      height: 1.8rem;
      border-radius: 50%;
      background: $accent;
      color: $surface;
      font-family: $font-principal;
      font-size: $text-xs;
      font-weight: 700;
      letter-spacing: 0;
    }
  }

  &__fields {
    @include flex(row, flex-start, flex-start, 1rem);
    flex-wrap: wrap;
  }
}
</style>
