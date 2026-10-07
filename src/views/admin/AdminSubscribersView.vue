<script setup lang="ts">
import { ref } from 'vue'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminPagination from '@/components/admin/AdminPagination.vue'
import AdminEmpty from '@/components/admin/AdminEmpty.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import { sourceLabel, useAdminSubscribers } from '@/composables/admin/useAdminSubscribers'
import { formatDate } from '@/utils/format'
import type { Subscriber } from '@/types'

const { items, q, page, pages, total, loading, downloading, downloadCsv, remove } =
  useAdminSubscribers()
const toDelete = ref<Subscriber | null>(null)

async function confirmDelete() {
  const subscriber = toDelete.value
  toDelete.value = null
  if (subscriber) await remove(subscriber)
}
</script>

<template>
  <section class="subs">
    <AdminPageHeader
      title="Suscriptores"
      :subtitle="`${total} ${total === 1 ? 'persona dejó' : 'personas dejaron'} su correo para recibir novedades.`"
    >
      <button
        class="btn btn--primary"
        type="button"
        :disabled="downloading || !total"
        @click="downloadCsv"
      >
        <i :class="downloading ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-file-arrow-down'"></i>
        Descargar lista (Excel / CSV)
      </button>
    </AdminPageHeader>

    <label class="subs__search">
      <i class="fa-solid fa-magnifying-glass"></i>
      <span class="visually-hidden">Buscar correo</span>
      <input v-model="q" type="search" placeholder="Buscar por correo" />
    </label>

    <p v-if="loading && !items.length" class="subs__loading">
      <i class="fa-solid fa-spinner fa-spin"></i> Cargando…
    </p>

    <AdminEmpty
      v-else-if="!items.length"
      icon="fa-solid fa-envelope-open-text"
      :title="q ? 'Ningún correo coincide' : 'Todavía no hay suscriptores'"
    />

    <ul v-else class="subs__list">
      <li v-for="subscriber in items" :key="subscriber._id" class="subs__item">
        <div class="subs__info">
          <p class="subs__email">{{ subscriber.email }}</p>
          <p class="subs__meta">
            {{ sourceLabel[subscriber.source] ?? subscriber.source }} ·
            {{ formatDate(subscriber.createdAt) }}
          </p>
        </div>
        <button
          class="subs__delete"
          type="button"
          :aria-label="`Eliminar ${subscriber.email}`"
          @click="toDelete = subscriber"
        >
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </li>
    </ul>

    <AdminPagination v-model="page" :pages="pages" />

    <BaseModal
      :open="Boolean(toDelete)"
      title="¿Eliminar este correo?"
      :message="toDelete ? `${toDelete.email} dejará de estar en la lista.` : ''"
      confirm-label="Eliminar"
      danger
      @confirm="confirmDelete"
      @cancel="toDelete = null"
    />
  </section>
</template>

<style scoped lang="scss">
.subs {
  &__search {
    position: relative;
    display: block;
    margin: 0 0 1.2rem;
    max-width: 420px;

    i {
      position: absolute;
      left: 0.9rem;
      top: 50%;
      transform: translateY(-50%);
      color: $ink-muted;
    }

    input {
      padding-left: 2.4rem;
    }
  }

  &__loading {
    color: $ink-soft;
  }

  &__list {
    list-style: none;
    @include card;
    overflow: hidden;
  }

  &__item {
    @include flex(row, center, space-between, 1rem);
    padding: 0.8rem 1rem;

    & + & {
      border-top: 1px solid $line;
    }
  }

  &__info {
    min-width: 0;
  }

  &__email {
    font-weight: 600;
    overflow-wrap: anywhere;
  }

  &__meta {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__delete {
    flex: none;
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 50%;
    color: $ink-muted;

    &:hover {
      background: $danger-bg;
      color: $danger;
    }
  }
}
</style>
