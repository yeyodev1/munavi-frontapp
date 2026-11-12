<script setup lang="ts">
// Recuadro de pagos del pie: logos oficiales de Payphone y tarjetas, y transferencia.
import { computed } from 'vue'
import { whatsappLink } from '@/config/site'
import { layoutCopy } from '@/config/copy/layout'
import { useSettingsStore } from '@/stores/settings'

const copy = layoutCopy.footer
const settings = useSettingsStore()
const otherPayment = computed(() => whatsappLink(copy.otherPaymentMessage, settings.whatsapp))
</script>

<template>
  <div class="pay">
    <div class="pay__box">
      <div class="pay__logos" :aria-label="copy.cardsAccepted">
        <img src="/brand/pagos/payphone.svg" alt="Payphone" class="pay__payphone" />
        <span class="pay__sep" aria-hidden="true"></span>
        <img
          v-for="b in copy.cardLogos"
          :key="b.file"
          :src="`/brand/pagos/${b.file}.svg`"
          :alt="b.label"
          class="pay__card"
        />
      </div>
      <p class="pay__box-text">{{ copy.cardsText }}</p>
      <hr class="pay__rule" />
      <p class="pay__transfer">
        <i class="fa-solid fa-building-columns" aria-hidden="true"></i>
        <span
          ><strong>{{ copy.transfer }}</strong
          >{{ copy.transferText }}</span
        >
      </p>
    </div>
    <a :href="otherPayment" target="_blank" rel="noopener" class="pay__other">
      <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
      <span>{{ copy.otherPayment }}</span>
    </a>
  </div>
</template>

<style scoped lang="scss">
$lime: #b5e06a;

.pay {
  width: 100%;
  @include flex(column, flex-start, flex-start, 0.55rem);

  &__rule {
    width: 100%;
    border: 0;
    border-top: 1px solid rgba($paper, 0.25);
    margin-block: 0.6rem;
  }

  &__box {
    width: 100%;
    padding: 1rem;
    border: 1.5px solid rgba($lime, 0.7);
    border-radius: $radius-md;
  }

  &__logos {
    @include flex(row, center, flex-start, 0.4rem);
    flex-wrap: wrap;
  }

  &__payphone {
    height: 1.9rem;
    padding: 0.4rem 0.6rem;
    border-radius: 6px;
    background: $surface;
  }

  &__sep {
    width: 1px;
    height: 1.6rem;
    margin-inline: 0.2rem;
    background: rgba($paper, 0.3);
  }

  &__card {
    height: 1.9rem;
    width: auto;
    border-radius: 4px;
  }

  &__box-text {
    margin-top: 0.6rem;
    font-size: $text-sm;
  }

  &__transfer {
    @include flex(row, flex-start, flex-start, 0.7rem);
    font-size: $text-sm;

    i {
      font-size: 1.5rem;
      color: $lime;
    }

    strong {
      display: block;
      color: $surface;
    }
  }

  &__other {
    color: rgba($paper, 0.85);
    @include flex(row, center, flex-start, 0.6rem);
    margin-top: 0.4rem;
    font-size: $text-sm;

    i {
      font-size: 1.6rem;
      color: $lime;
    }
  }
}
</style>
