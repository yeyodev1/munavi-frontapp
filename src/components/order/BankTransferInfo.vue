<script setup lang="ts">
import { computed, ref } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useToastStore } from '@/stores/toast'
import { whatsappLink } from '@/config/site'
import { money } from '@/utils/price'
import { orderCopy as copy } from '@/config/copy/checkout'

const props = defineProps<{ orderNumber: string; total: number; info: string }>()

const settings = useSettingsStore()
const toast = useToastStore()
const copied = ref(false)

const proofLink = computed(() => whatsappLink(copy.proofMessage(props.orderNumber), settings.whatsapp))

async function copyInfo() {
  try {
    await navigator.clipboard.writeText(copy.clipboard(props.info, money(props.total), props.orderNumber))
    copied.value = true
    toast.success(copy.copied)
    setTimeout(() => (copied.value = false), 2500)
  } catch {
    toast.error(copy.copyError)
  }
}
</script>

<template>
  <section class="bank">
    <h2 class="bank__title">
      <i class="fa-solid fa-building-columns" aria-hidden="true"></i>
      {{ copy.bankTitle }}
    </h2>
    <p class="bank__text">{{ copy.instructions.transfer }}</p>

    <template v-if="info">
      <pre class="bank__info">{{ info }}</pre>
      <p class="bank__amount">
        {{ money(total) }} <span>· {{ orderNumber }}</span>
      </p>
    </template>
    <p v-else class="bank__text">{{ copy.bankMissing }}</p>

    <div class="bank__actions">
      <button v-if="info" type="button" class="btn btn--ghost" @click="copyInfo">
        <i :class="copied ? 'fa-solid fa-check' : 'fa-regular fa-copy'" aria-hidden="true"></i>
        {{ copied ? copy.copied : copy.copy }}
      </button>
      <a :href="proofLink" target="_blank" rel="noopener" class="btn bank__whatsapp">
        <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
        {{ copy.sendProof }}
      </a>
    </div>
  </section>
</template>

<style scoped lang="scss">
.bank {
  @include flex(column, stretch, flex-start, 0.8rem);
  padding: 1.25rem;
  border-radius: $radius-md;
  background: linear-gradient(160deg, rgba($accent, 0.06), rgba($sage, 0.18));
  border: 1px solid rgba($accent, 0.15);

  &__title {
    @include flex(row, center, flex-start, 0.55rem);
    @include display($text-xl, 700);

    i {
      font-size: 1rem;
      color: $accent;
    }
  }

  &__text {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__info {
    margin: 0;
    padding: 1rem;
    border-radius: $radius-sm;
    background: $surface;
    font-family: $font-principal;
    font-size: $text-sm;
    line-height: 1.6;
    white-space: pre-wrap;
    word-break: break-word;
  }

  &__amount {
    font-size: $text-lg;
    font-weight: 700;

    span {
      font-size: $text-sm;
      font-weight: 500;
      color: $ink-muted;
    }
  }

  &__actions {
    @include flex(row, stretch, flex-start, 0.6rem);
    flex-wrap: wrap;

    .btn {
      flex: 1 1 180px;
    }
  }

  &__whatsapp {
    background: $whatsapp;
    color: $ink;

    &:hover {
      background: darken($whatsapp, 6%);
    }
  }
}
</style>
