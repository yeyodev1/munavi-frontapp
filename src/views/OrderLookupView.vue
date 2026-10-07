<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CheckoutField from '@/components/checkout/CheckoutField.vue'
import { isValidEmail } from '@/composables/useCheckoutForm'
import { lookupCopy as copy } from '@/config/copy/checkout'

const route = useRoute()
const router = useRouter()

const orderNumber = ref(String(route.query.pedido ?? ''))
const email = ref('')
const errors = ref({ orderNumber: '', email: '' })

function submit() {
  const number = orderNumber.value.trim().toUpperCase()
  const mail = email.value.trim().toLowerCase()
  errors.value = {
    orderNumber: number ? '' : copy.required,
    email: !mail ? copy.required : isValidEmail(mail) ? '' : copy.invalidEmail,
  }
  if (errors.value.orderNumber || errors.value.email) return
  router.push({ name: 'Order', params: { orderNumber: number }, query: { email: mail } })
}
</script>

<template>
  <div class="lookup">
    <div class="lookup__card">
      <span class="lookup__icon"><i class="fa-solid fa-box" aria-hidden="true"></i></span>
      <p class="lookup__eyebrow">{{ copy.eyebrow }}</p>
      <h1 class="lookup__title">{{ copy.title }}</h1>
      <p class="lookup__text">{{ copy.text }}</p>

      <form class="lookup__form" novalidate @submit.prevent="submit">
        <CheckoutField id="lk-number" :label="copy.orderNumber" :error="errors.orderNumber" wide>
          <input
            id="lk-number"
            v-model="orderNumber"
            autocomplete="off"
            :placeholder="copy.orderNumberPlaceholder"
            :aria-invalid="!!errors.orderNumber"
            class="lookup__number"
          />
        </CheckoutField>
        <CheckoutField id="lk-email" :label="copy.email" :error="errors.email" wide>
          <input id="lk-email" v-model="email" type="email" autocomplete="email" inputmode="email" :aria-invalid="!!errors.email" />
        </CheckoutField>
        <button type="submit" class="btn btn--primary lookup__submit">
          {{ copy.submit }}
          <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.lookup {
  @include container(560px);
  padding-block: $space-lg $space-section;

  &__card {
    @include card;
    @include flex(column, center, flex-start, 0.5rem);
    padding: $space-md 1.25rem;
    text-align: center;

    @include from('md') {
      padding: $space-lg;
    }
  }

  &__icon {
    @include flex(row, center, center);
    width: 3.2rem;
    height: 3.2rem;
    margin-bottom: 0.4rem;
    border-radius: 50%;
    background: $sage-soft;
    color: $accent;
    font-size: 1.2rem;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-sm);
  }

  &__text {
    font-size: $text-sm;
    color: $ink-soft;
    max-width: 40ch;
  }

  &__form {
    @include flex(column, stretch, flex-start, 1rem);
    width: 100%;
    margin-top: 1rem;
    text-align: left;
  }

  &__number {
    text-transform: uppercase;
  }

  &__submit {
    width: 100%;
    margin-top: 0.3rem;
  }
}
</style>
