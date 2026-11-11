<script setup lang="ts">
// Desde 12 unidades surtidas Munavi atiende por WhatsApp con precio de emprendedor o distribuidor.
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useSettingsStore } from '@/stores/settings'
import { whatsappLink } from '@/config/site'
import { cartCopy as copy } from '@/config/copy/checkout'

const WHOLESALE_UNITS = 12

const cart = useCartStore()
const settings = useSettingsStore()
const link = computed(() => whatsappLink(copy.wholesaleMessage(cart.count), settings.whatsapp))
</script>

<template>
  <aside v-if="cart.count >= WHOLESALE_UNITS" class="wholesale">
    <i class="fa-solid fa-store wholesale__icon" aria-hidden="true"></i>
    <div class="wholesale__body">
      <strong>{{ copy.wholesaleTitle }}</strong>
      <p>{{ copy.wholesaleText }}</p>
      <a :href="link" target="_blank" rel="noopener" class="wholesale__cta">
        <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
        {{ copy.wholesaleCta }}
      </a>
    </div>
  </aside>
</template>

<style scoped lang="scss">
.wholesale {
  @include flex(row, flex-start, flex-start, 0.8rem);
  padding: 0.9rem 1rem;
  border-radius: $radius-md;
  background: rgba($accent, 0.08);
  border: 1px solid rgba($accent, 0.2);
  font-size: $text-sm;

  &__icon {
    color: $accent;
    font-size: 1.1rem;
    margin-top: 0.15rem;
  }

  &__body {
    @include flex(column, flex-start, flex-start, 0.25rem);
    color: $ink-soft;

    strong {
      color: $ink;
    }
  }

  &__cta {
    @include flex(row, center, flex-start, 0.35rem);
    font-weight: 700;
    color: $accent-deep;
    text-decoration: underline;
  }
}
</style>
