<script setup lang="ts">
import AdminField from '@/components/admin/AdminField.vue'
import type { TrackingIds } from '@/types'

const model = defineModel<TrackingIds>({ required: true })
</script>

<template>
  <div class="tracking">
    <div class="tracking__row">
      <AdminField
        label="Meta Pixel"
        for="t-pixel"
        hint="Solo números. Está en el Administrador de eventos de Meta."
      >
        <input
          id="t-pixel"
          v-model="model.metaPixelId"
          inputmode="numeric"
          placeholder="123456789012345"
        />
      </AdminField>
      <AdminField label="Google Analytics 4" for="t-ga" hint="El ID de medición del flujo web.">
        <input id="t-ga" v-model="model.ga4Id" class="tracking__upper" placeholder="G-XXXXXXXXXX" />
      </AdminField>
    </div>
    <div class="tracking__row">
      <AdminField
        label="Google Ads"
        for="t-ads"
        hint="El ID de la etiqueta de Google de tu cuenta de Ads."
      >
        <input
          id="t-ads"
          v-model="model.googleAdsId"
          class="tracking__upper"
          placeholder="AW-123456789"
        />
      </AdminField>
      <AdminField
        label="Etiqueta de conversión de compra"
        for="t-ads-label"
        hint="Lo que va después de la barra en send_to (AW-…/esto)."
      >
        <input
          id="t-ads-label"
          v-model="model.googleAdsPurchaseLabel"
          placeholder="AbCdEfGhIj123"
        />
      </AdminField>
    </div>
    <p class="tracking__note">
      <i class="fa-solid fa-circle-info"></i>
      Se miden vistas de producto, agregados al carrito, inicio de pago y compras. Deja vacío lo que
      no uses.
    </p>
  </div>
</template>

<style scoped lang="scss">
.tracking {
  @include flex(column, stretch, flex-start, 1rem);

  &__row {
    @include flex(row, flex-start, flex-start, 1rem);
    flex-wrap: wrap;
  }

  &__upper {
    text-transform: uppercase;
  }

  &__note {
    @include flex(row, baseline, flex-start, 0.4rem);
    font-size: $text-sm;
    color: $ink-soft;
  }
}
</style>
