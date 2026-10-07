<script setup lang="ts">
import { computed } from 'vue'
import { statusLabel, statusTone } from '@/composables/admin/orderStatus'
import type { OrderStatus } from '@/types'

const props = defineProps<{ status: OrderStatus }>()
const tone = computed(() => statusTone[props.status] ?? 'muted')
</script>

<template>
  <span class="chip" :class="`chip--${tone}`">
    <span class="chip__dot" aria-hidden="true"></span>
    {{ statusLabel(status) }}
  </span>
</template>

<style scoped lang="scss">
.chip {
  @include flex(row, center, flex-start, 0.4rem);
  display: inline-flex;
  padding: 0.25rem 0.7rem;
  border-radius: $radius-pill;
  font-size: $text-xs;
  font-weight: 700;
  white-space: nowrap;

  &__dot {
    width: 0.45rem;
    height: 0.45rem;
    border-radius: 50%;
    background: currentColor;
  }

  &--warning {
    background: $warning-bg;
    color: darken($warning, 20%);
  }

  &--info {
    background: $info-bg;
    color: darken($info, 15%);
  }

  &--success {
    background: $success-bg;
    color: darken($success, 15%);
  }

  &--accent {
    background: $accent-soft;
    color: $accent-deep;
  }

  &--danger {
    background: $danger-bg;
    color: darken($danger, 8%);
  }

  &--muted {
    background: $sand;
    color: $ink-muted;
  }
}
</style>
