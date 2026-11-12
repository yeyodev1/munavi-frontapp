<script setup lang="ts">
// Envío, pago y origen bajo el botón de compra, y la consulta por WhatsApp.
import { productDetailCopy as copy } from '@/config/copy/product'

/** Sin enlace (producto sin precio) no se repite la consulta: ya está en el botón. */
defineProps<{ askLink: string }>()
</script>

<template>
  <ul class="perks">
    <li v-for="perk in copy.perks" :key="perk.text">
      <i :class="perk.icon" aria-hidden="true"></i>
      {{ perk.text }}
    </li>
  </ul>
  <a v-if="askLink" :href="askLink" target="_blank" rel="noopener" class="ask">
    <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
    {{ copy.ask }}
  </a>
</template>

<style scoped lang="scss">
.perks {
  list-style: none;
  @include flex(column, flex-start, flex-start, 0.55rem);
  padding: 1rem 1.1rem;
  border-radius: $radius-md;
  background: rgba($accent, 0.05);
  font-size: $text-sm;
  color: $ink-soft;

  li {
    @include flex(row, baseline, flex-start, 0.6rem);
  }

  i {
    color: $accent;
    width: 1rem;
  }
}

.ask {
  @include flex(row, center, flex-start, 0.5rem);
  font-size: $text-sm;
  font-weight: 600;
  color: #128c4a;

  &:hover {
    text-decoration: underline;
  }
}
</style>
