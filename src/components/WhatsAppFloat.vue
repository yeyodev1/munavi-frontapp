<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { whatsappLink } from '@/config/site'
import { layoutCopy } from '@/config/copy/layout'
import { useSettingsStore } from '@/stores/settings'

const copy = layoutCopy.whatsapp
const route = useRoute()
const settings = useSettingsStore()

// En el checkout estorba sobre el botón de pago; ahí la ayuda ya está en la página.
const hidden = computed(() => route.name === 'Checkout')
const href = computed(() => whatsappLink(copy.message, settings.whatsapp))
</script>

<template>
  <a v-if="!hidden && href !== '#'" :href="href" target="_blank" rel="noopener" class="wa" :aria-label="copy.aria">
    <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
    <span class="wa__label">{{ copy.label }}</span>
  </a>
</template>

<style scoped lang="scss">

.wa {
  position: fixed;
  right: 1rem;
  bottom: calc(1rem + env(safe-area-inset-bottom));
  z-index: 90;
  @include flex(row, center, center, 0.6rem);
  height: 3.4rem;
  min-width: 3.4rem;
  padding-inline: 0;
  border-radius: $radius-pill;
  background: $whatsapp;
  color: $surface;
  box-shadow: 0 10px 30px rgba(#128c4a, 0.35);
  @include transition;

  i {
    font-size: 1.7rem;
  }

  &__label {
    display: none;
    font-size: $text-sm;
    font-weight: 600;
    white-space: nowrap;
  }

  &:hover {
    transform: translateY(-2px) scale(1.03);
  }

  @include from('md') {
    right: 1.5rem;
    bottom: 1.5rem;
    padding-inline: 1.2rem 1.4rem;

    &__label {
      display: inline;
    }
  }
}
</style>
