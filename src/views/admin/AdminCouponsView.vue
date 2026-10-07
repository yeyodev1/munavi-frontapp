<script setup lang="ts">
import { ref } from 'vue'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminCard from '@/components/admin/AdminCard.vue'
import AdminField from '@/components/admin/AdminField.vue'
import AdminEmpty from '@/components/admin/AdminEmpty.vue'
import ToggleSwitch from '@/components/admin/ToggleSwitch.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import { useAdminCoupons } from '@/composables/admin/useAdminCoupons'
import { formatDate } from '@/utils/format'
import type { Coupon } from '@/types'

const { items, subscribeCode, draft, loading, busy, create, toggle, remove, isExpired } =
  useAdminCoupons()
const toDelete = ref<Coupon | null>(null)

async function confirmDelete() {
  const coupon = toDelete.value
  toDelete.value = null
  if (coupon) await remove(coupon)
}
</script>

<template>
  <section class="coupons">
    <AdminPageHeader
      title="Cupones"
      subtitle="Códigos de descuento que la clienta escribe al pagar. El porcentaje se aplica sobre el subtotal."
    />

    <AdminCard title="Nuevo cupón" icon="fa-solid fa-plus">
      <form class="coupons__form" @submit.prevent="create">
        <AdminField label="Código" for="c-code" hint="Letras y números, sin espacios. Ej. MAMA15">
          <input
            id="c-code"
            v-model="draft.code"
            class="coupons__code"
            required
            minlength="3"
            maxlength="40"
          />
        </AdminField>
        <AdminField label="Descuento (%)" for="c-percent">
          <input
            id="c-percent"
            v-model.number="draft.percent"
            type="number"
            min="1"
            max="100"
            step="1"
            required
          />
        </AdminField>
        <AdminField label="Vence el (opcional)" for="c-expires" hint="Vacío = no vence">
          <input id="c-expires" v-model="draft.expiresAt" type="date" />
        </AdminField>
        <div class="coupons__submit">
          <button class="btn btn--primary" type="submit" :disabled="busy">
            <i class="fa-solid fa-plus"></i> Crear cupón
          </button>
        </div>
      </form>
    </AdminCard>

    <p v-if="loading && !items.length" class="coupons__loading">
      <i class="fa-solid fa-spinner fa-spin"></i> Cargando…
    </p>

    <AdminEmpty
      v-else-if="!items.length"
      icon="fa-solid fa-ticket"
      title="Todavía no hay cupones"
    />

    <div v-else class="coupons__list">
      <article v-for="coupon in items" :key="coupon._id" class="coupons__item">
        <div class="coupons__info">
          <p class="coupons__name">
            {{ coupon.code }} <span class="coupons__percent">-{{ coupon.percent }}%</span>
          </p>
          <p class="coupons__meta">
            Usado {{ coupon.usageCount }} {{ coupon.usageCount === 1 ? 'vez' : 'veces' }} ·
            {{
              coupon.expiresAt
                ? `${isExpired(coupon) ? 'Venció' : 'Vence'} el ${formatDate(coupon.expiresAt)}`
                : 'Sin vencimiento'
            }}
          </p>
          <p v-if="coupon.code === subscribeCode" class="coupons__tag">
            <i class="fa-solid fa-envelope"></i> Se regala a quien se suscribe
          </p>
        </div>
        <div class="coupons__actions">
          <ToggleSwitch
            :model-value="coupon.isActive"
            label="Activo"
            @update:model-value="toggle(coupon)"
          />
          <button class="coupons__delete" type="button" @click="toDelete = coupon">
            <i class="fa-solid fa-trash-can"></i> Eliminar
          </button>
        </div>
      </article>
    </div>

    <BaseModal
      :open="Boolean(toDelete)"
      :title="`¿Eliminar el cupón ${toDelete?.code ?? ''}?`"
      :message="
        toDelete?.code === subscribeCode
          ? 'Es el cupón que se regala al suscribirse. Si lo eliminas, cambia el cupón de suscripción en Ajustes.'
          : 'Deja de funcionar de inmediato. Si solo quieres pausarlo, apaga Activo.'
      "
      confirm-label="Eliminar"
      danger
      @confirm="confirmDelete"
      @cancel="toDelete = null"
    />
  </section>
</template>

<style scoped lang="scss">
.coupons {
  @include flex(column, stretch, flex-start, 1.2rem);

  :deep(.phead) {
    margin-bottom: 0.2rem;
  }

  &__form {
    @include flex(row, flex-start, flex-start, 1rem);
    flex-wrap: wrap;
  }

  &__code {
    text-transform: uppercase;
  }

  &__submit {
    @include flex(row, flex-end, flex-start);
    flex: 1 1 100%;
  }

  &__loading {
    color: $ink-soft;
  }

  &__list {
    @include flex(column, stretch, flex-start, 0.6rem);
  }

  &__item {
    @include card;
    @include flex(column, stretch, flex-start, 0.8rem);
    padding: 1rem;

    @include from('md') {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  &__name {
    font-weight: 700;
    font-size: 1.05rem;
    letter-spacing: 0.04em;
  }

  &__percent {
    margin-left: 0.4rem;
    padding: 0.1rem 0.5rem;
    border-radius: $radius-pill;
    background: $accent-soft;
    color: $accent-deep;
    font-size: 0.8rem;
  }

  &__meta {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__tag {
    margin-top: 0.3rem;
    font-size: $text-xs;
    font-weight: 600;
    color: $accent;
  }

  &__actions {
    @include flex(row, center, flex-start, 1rem);
    flex-wrap: wrap;
  }

  &__delete {
    @include flex(row, center, center, 0.4rem);
    font-size: 0.82rem;
    font-weight: 600;
    color: $danger;
  }
}
</style>
