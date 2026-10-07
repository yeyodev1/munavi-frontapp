<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import AdminCard from './AdminCard.vue'
import AdminField from './AdminField.vue'
import StatusChip from './StatusChip.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import { statusLabel, statusOptions } from '@/composables/admin/orderStatus'
import type { OrderPatch } from '@/services/adminOrders.service'
import type { Order, OrderStatus } from '@/types'

const props = defineProps<{ order: Order; saving: boolean }>()
const emit = defineEmits<{ update: [patch: OrderPatch, success: string] }>()

const next = ref<OrderStatus>(props.order.status)
const tracking = ref(props.order.trackingUrl ?? '')
const confirming = ref(false)

watch(
  () => props.order,
  (order) => {
    next.value = order.status
    tracking.value = order.trackingUrl ?? ''
  },
)

const needsTracking = computed(() => next.value === 'shipped' && !tracking.value.trim())
const statusChanged = computed(() => next.value !== props.order.status)
const trackingChanged = computed(() => tracking.value.trim() !== (props.order.trackingUrl ?? ''))

// Avisos de lo que pasa "por detrás" al cambiar a ciertos estados.
const consequence = computed(() => {
  if (next.value === 'shipped') return 'La clienta recibe un correo con la guía de envío.'
  if (next.value === 'canceled') return 'Las unidades vuelven al inventario.'
  if (next.value === 'paid' || next.value === 'confirmed')
    return 'Se descuentan las unidades del inventario si aún no se había hecho.'
  return ''
})

function apply() {
  confirming.value = false
  const patch: OrderPatch = {}
  if (statusChanged.value) patch.status = next.value
  if (trackingChanged.value || next.value === 'shipped') patch.trackingUrl = tracking.value.trim()
  emit(
    'update',
    patch,
    statusChanged.value
      ? `Pedido marcado como ${statusLabel(next.value)}`
      : 'Guía de envío guardada',
  )
}

function submit() {
  if (needsTracking.value) return
  if (statusChanged.value) confirming.value = true
  else apply()
}
</script>

<template>
  <AdminCard title="Estado del pedido" icon="fa-solid fa-truck-fast">
    <p class="spanel__now">Ahora: <StatusChip :status="order.status" /></p>

    <AdminField label="Cambiar a" for="order-status">
      <select id="order-status" v-model="next">
        <option v-for="option in statusOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </AdminField>

    <AdminField
      label="Guía de envío (enlace de rastreo)"
      for="order-tracking"
      :hint="
        next === 'shipped'
          ? 'Obligatoria para marcar como Enviado.'
          : 'El enlace que da Servientrega u otra empresa.'
      "
      :warning="needsTracking ? 'Pega la guía de envío para poder marcarlo como Enviado.' : ''"
    >
      <input id="order-tracking" v-model="tracking" type="url" placeholder="https://…" />
    </AdminField>

    <button
      class="btn btn--primary"
      type="button"
      :disabled="saving || needsTracking || (!statusChanged && !trackingChanged)"
      @click="submit"
    >
      <i :class="saving ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-check'"></i>
      {{ statusChanged ? 'Cambiar estado' : 'Guardar guía' }}
    </button>

    <BaseModal
      :open="confirming"
      :title="`¿Marcar como ${statusLabel(next)}?`"
      :message="
        consequence ||
        `El pedido ${order.orderNumber} pasará de ${statusLabel(order.status)} a ${statusLabel(next)}.`
      "
      confirm-label="Sí, cambiar"
      :danger="next === 'canceled'"
      @confirm="apply"
      @cancel="confirming = false"
    />
  </AdminCard>
</template>

<style scoped lang="scss">
.spanel__now {
  @include flex(row, center, flex-start, 0.5rem);
  font-size: $text-sm;
  color: $ink-soft;
}
</style>
