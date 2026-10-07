<script setup lang="ts">
import { computed } from 'vue'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminCard from '@/components/admin/AdminCard.vue'
import AdminField from '@/components/admin/AdminField.vue'
import MoneyInput from '@/components/admin/MoneyInput.vue'
import HeroSlidesEditor from '@/components/admin/HeroSlidesEditor.vue'
import { useAdminSettings } from '@/composables/admin/useAdminSettings'
import { money } from '@/composables/admin/money'

const { form, loading, saving, save } = useAdminSettings()

// Resumen en palabras de la regla de envío, para que se entienda qué va a pasar.
const shippingSummary = computed(() => {
  const { flatRate, freeShippingThreshold } = form.value.shipping
  if (!flatRate) return 'El envío es gratis en todos los pedidos.'
  if (freeShippingThreshold === null) return `Todos los pedidos pagan ${money(flatRate)} de envío.`
  return `Se cobran ${money(flatRate)} de envío; desde ${money(freeShippingThreshold)} en productos, es gratis.`
})
</script>

<template>
  <section class="settings">
    <AdminPageHeader
      title="Ajustes"
      subtitle="Datos de la tienda que ven las clientas. Los cambios se aplican al guardar."
    />

    <p v-if="loading" class="settings__loading">
      <i class="fa-solid fa-spinner fa-spin"></i> Cargando…
    </p>

    <form v-else class="settings__form" @submit.prevent="save">
      <AdminCard title="Envío" icon="fa-solid fa-truck" :description="shippingSummary">
        <div class="settings__row">
          <AdminField
            label="Costo de envío"
            for="s-rate"
            hint="Pon 0 si el envío siempre es gratis."
          >
            <MoneyInput
              id="s-rate"
              :model-value="form.shipping.flatRate"
              @update:model-value="form.shipping.flatRate = $event ?? 0"
            />
          </AdminField>
          <AdminField
            label="Envío gratis desde"
            for="s-free"
            hint="Monto mínimo en productos. Vacío = nunca es gratis."
          >
            <MoneyInput
              id="s-free"
              v-model="form.shipping.freeShippingThreshold"
              nullable
              placeholder="Nunca"
            />
          </AdminField>
        </div>
        <AdminField
          label="Nota de envío"
          for="s-note"
          hint="Ej. Envíos a todo Ecuador con Servientrega"
          grow
        >
          <input id="s-note" v-model="form.shipping.note" />
        </AdminField>
      </AdminCard>

      <AdminCard title="Anuncio y suscripción" icon="fa-solid fa-bullhorn">
        <AdminField
          label="Barra de anuncio"
          for="s-announcement"
          hint="El texto que aparece arriba de toda la tienda. Vacío = sin barra."
          grow
        >
          <input
            id="s-announcement"
            v-model="form.announcement"
            placeholder="Ej. Envío gratis desde $50"
          />
        </AdminField>
        <AdminField
          label="Cupón de regalo al suscribirse"
          for="s-coupon"
          hint="Debe existir en Cupones y estar activo. Vacío = no se regala cupón."
        >
          <input id="s-coupon" v-model="form.subscribeCouponCode" class="settings__upper" />
        </AdminField>
      </AdminCard>

      <AdminCard title="Contacto y redes" icon="fa-brands fa-whatsapp">
        <div class="settings__row">
          <AdminField
            label="WhatsApp de ventas"
            for="s-wa"
            hint="Con código de país. Ej. 593991234567"
          >
            <input id="s-wa" v-model="form.whatsapp" inputmode="tel" placeholder="593…" />
          </AdminField>
          <AdminField
            label="Correo para avisos de pedidos"
            for="s-notify"
            hint="Aquí llega un correo por cada pedido nuevo."
          >
            <input id="s-notify" v-model="form.notifyEmail" type="email" placeholder="tucorreo@…" />
          </AdminField>
        </div>
        <div class="settings__row">
          <AdminField label="Instagram" for="s-ig">
            <input
              id="s-ig"
              v-model="form.instagram"
              type="url"
              placeholder="https://instagram.com/…"
            />
          </AdminField>
          <AdminField label="Facebook" for="s-fb">
            <input
              id="s-fb"
              v-model="form.facebook"
              type="url"
              placeholder="https://facebook.com/…"
            />
          </AdminField>
          <AdminField label="TikTok" for="s-tt">
            <input id="s-tt" v-model="form.tiktok" type="url" placeholder="https://tiktok.com/@…" />
          </AdminField>
        </div>
      </AdminCard>

      <AdminCard
        title="Datos para transferencia"
        icon="fa-solid fa-building-columns"
        description="Se muestran al cliente que elige pagar por transferencia y van en el correo de su pedido."
      >
        <AdminField label="Datos bancarios" for="s-bank" grow>
          <textarea
            id="s-bank"
            v-model="form.bankTransferInfo"
            rows="5"
            placeholder="Banco Pichincha&#10;Cuenta de ahorros 2200…&#10;Titular …&#10;RUC / Cédula …"
          ></textarea>
        </AdminField>
      </AdminCard>

      <AdminCard
        title="Banners del inicio"
        icon="fa-solid fa-panorama"
        description="Las imágenes grandes que rotan al abrir la tienda. Se muestran en este orden."
      >
        <HeroSlidesEditor v-model="form.heroSlides" />
      </AdminCard>

      <div class="settings__bar">
        <button class="btn btn--primary" type="submit" :disabled="saving">
          <i :class="saving ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-floppy-disk'"></i>
          {{ saving ? 'Guardando…' : 'Guardar ajustes' }}
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped lang="scss">
.settings {
  max-width: 860px;

  &__loading {
    color: $ink-soft;
  }

  &__form {
    @include flex(column, stretch, flex-start, 1.2rem);
    padding-bottom: 5rem;
  }

  &__row {
    @include flex(row, flex-start, flex-start, 1rem);
    flex-wrap: wrap;
  }

  &__upper {
    text-transform: uppercase;
  }

  textarea {
    resize: vertical;
  }

  &__bar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 30;
    @include flex(row, center, flex-end);
    padding: 0.8rem 1rem;
    background: rgba($surface, 0.96);
    backdrop-filter: blur(6px);
    border-top: 1px solid $line;

    @include from('lg') {
      left: 250px;
      padding-inline: 2rem;
    }
  }
}
</style>
