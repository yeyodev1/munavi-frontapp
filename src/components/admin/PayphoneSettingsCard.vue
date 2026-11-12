<script setup lang="ts">
import { computed, ref } from 'vue'
import AdminCard from './AdminCard.vue'
import AdminField from './AdminField.vue'
import type { AdminSettings } from '@/types'

const payphone = defineModel<AdminSettings['payphone']>({ required: true })
/** El token que se pega; nunca se persiste fuera de memoria. */
const token = defineModel<string>('token', { required: true })
defineProps<{ disabled?: boolean }>()
defineEmits<{ clear: [] }>()

const showToken = ref(false)
// Refleja lo guardado: un token recién pegado no cuenta hasta guardar.
const active = computed(() => Boolean(payphone.value.storeId.trim()) && payphone.value.hasToken)
</script>

<template>
  <AdminCard
    title="Pagos con tarjeta (Payphone)"
    icon="fa-solid fa-credit-card"
    description="Encuéntralos en Payphone Developer → tu aplicación → Credenciales (Token y Store ID). Solo pega el token si es nuevo; el guardado no se muestra por seguridad."
  >
    <div class="payphone__row">
      <AdminField label="Store ID" for="s-pp-store">
        <input id="s-pp-store" v-model="payphone.storeId" autocomplete="off" spellcheck="false" />
      </AdminField>
      <AdminField label="Token" for="s-pp-token">
        <div class="payphone__secret">
          <input
            id="s-pp-token"
            v-model="token"
            :type="showToken ? 'text' : 'password'"
            autocomplete="new-password"
            spellcheck="false"
            :placeholder="
              payphone.hasToken ? `Guardado ••••${payphone.tokenEnd}` : 'Pega el token de Payphone'
            "
          />
          <button
            class="payphone__eye"
            type="button"
            :aria-label="showToken ? 'Ocultar token' : 'Mostrar token'"
            :aria-pressed="showToken"
            @click="showToken = !showToken"
          >
            <i :class="showToken ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
          </button>
        </div>
      </AdminField>
    </div>
    <div class="payphone__foot">
      <p class="payphone__status" :class="{ 'payphone__status--on': active }">
        <i :class="active ? 'fa-solid fa-circle-check' : 'fa-solid fa-triangle-exclamation'"></i>
        {{
          active
            ? 'Pago con tarjeta activo'
            : 'Pago con tarjeta desactivado: falta el token o el Store ID'
        }}
      </p>
      <button
        v-if="payphone.hasToken"
        class="payphone__clear"
        type="button"
        :disabled="disabled"
        @click="$emit('clear')"
      >
        Quitar token
      </button>
    </div>
  </AdminCard>
</template>

<style scoped lang="scss">
.payphone {
  &__row {
    @include flex(row, flex-start, flex-start, 1rem);
    flex-wrap: wrap;
  }

  &__secret {
    position: relative;

    input {
      width: 100%;
      padding-right: 2.6rem;
    }
  }

  &__eye {
    position: absolute;
    top: 50%;
    right: 0.3rem;
    transform: translateY(-50%);
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    color: $ink-muted;

    &:hover {
      color: $ink;
    }
  }

  &__foot {
    @include flex(row, center, space-between, 0.8rem);
    flex-wrap: wrap;
  }

  &__status {
    @include flex(row, baseline, flex-start, 0.4rem);
    font-size: $text-sm;
    font-weight: 600;
    color: darken($warning, 18%);

    &--on {
      color: darken($success, 12%);
    }
  }

  &__clear {
    font-size: $text-sm;
    color: $danger;
    text-decoration: underline;

    &:disabled {
      opacity: 0.5;
    }
  }
}
</style>
