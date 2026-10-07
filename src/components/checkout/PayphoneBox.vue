<script setup lang="ts">
import { onMounted, watch } from 'vue'
import type { PayphoneBox } from '@/types'
import { usePayphoneBox } from '@/composables/usePayphoneBox'
import { checkoutCopy, payphoneCopy as copy } from '@/config/copy/checkout'

const props = withDefaults(defineProps<{ payphone: PayphoneBox; renewing?: boolean }>(), { renewing: false })
const emit = defineEmits<{ renew: [] }>()

const { status, expired, mount } = usePayphoneBox('pp-button')

onMounted(() => mount(props.payphone))
// Un intento nuevo trae otro clientTransactionId: se vuelve a montar el formulario.
watch(
  () => props.payphone.clientTransactionId,
  () => mount(props.payphone),
)
</script>

<template>
  <div class="ppbox" :class="`ppbox--${status}`">
    <p class="ppbox__expires">
      <i class="fa-regular fa-clock" aria-hidden="true"></i>
      {{ checkoutCopy.cardSection.expires }}
    </p>

    <div v-if="status === 'loading'" class="ppbox__state" role="status">
      <span class="ppbox__spinner" aria-hidden="true"></span>
      {{ copy.loading }}
    </div>

    <div v-else-if="status === 'error'" class="ppbox__state ppbox__state--error" role="alert">
      <i class="fa-solid fa-plug-circle-xmark" aria-hidden="true"></i>
      <p>{{ copy.loadError }}</p>
      <button type="button" class="btn btn--primary" @click="mount(payphone)">{{ copy.retry }}</button>
    </div>

    <div v-if="expired" class="ppbox__expired" role="alert">
      <button type="button" class="btn btn--dark" :disabled="renewing" @click="emit('renew')">
        <i class="fa-solid fa-rotate-right" aria-hidden="true"></i>
        {{ checkoutCopy.cardSection.newAttempt }}
      </button>
    </div>

    <!-- Payphone pinta aquí su formulario; Vue no toca el interior. -->
    <div id="pp-button" class="ppbox__mount" :class="{ 'ppbox__mount--hidden': status !== 'ready' || expired }"></div>

    <p class="ppbox__secured">
      <i class="fa-solid fa-lock" aria-hidden="true"></i>
      {{ copy.secured }}
    </p>
  </div>
</template>

<style scoped lang="scss">
.ppbox {
  @include flex(column, stretch, flex-start, 1rem);

  &__expires {
    @include flex(row, center, flex-start, 0.5rem);
    padding: 0.7rem 0.9rem;
    border-radius: $radius-sm;
    background: $warning-bg;
    font-size: $text-xs;
    font-weight: 600;
    color: $ink-soft;

    i {
      color: $warning;
    }
  }

  &__state {
    @include flex(column, center, center, 0.8rem);
    min-height: 14rem;
    padding: $space-md;
    border-radius: $radius-md;
    background: rgba($accent, 0.04);
    text-align: center;
    font-size: $text-sm;
    color: $ink-soft;

    &--error > i {
      font-size: 1.6rem;
      color: $danger;
    }
  }

  &__spinner {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    border: 3px solid rgba($accent, 0.15);
    border-top-color: $accent;
    animation: ppbox-spin 0.8s linear infinite;
  }

  &__expired {
    @include flex(row, center, center);
    padding: $space-md;
    border-radius: $radius-md;
    border: 1px dashed rgba($accent, 0.35);
  }

  &__mount {
    width: 100%;
    min-height: 1px;

    &--hidden {
      display: none;
    }
  }

  &__secured {
    @include flex(row, center, center, 0.45rem);
    font-size: $text-xs;
    color: $ink-muted;
    text-align: center;
  }
}

@keyframes ppbox-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

<style lang="scss">
// Interior del formulario de Payphone (no scoped porque lo genera su script).
// Ajustes mínimos: que use todo el ancho en móvil y la tipografía de la marca.
#pp-button {
  font-family: $font-principal;

  > *,
  iframe,
  form {
    max-width: 100% !important;
    width: 100% !important;
  }

  @include until('sm') {
    > * {
      margin-inline: 0 !important;
      padding-inline: 0 !important;
    }
  }
}
</style>
