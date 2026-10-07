<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminCard from '@/components/admin/AdminCard.vue'
import AdminEmpty from '@/components/admin/AdminEmpty.vue'
import GalleryEditor from '@/components/admin/GalleryEditor.vue'
import VariantsEditor from '@/components/admin/VariantsEditor.vue'
import PricesEditor from '@/components/admin/PricesEditor.vue'
import VolumeTiersEditor from '@/components/admin/VolumeTiersEditor.vue'
import ProductBasicsSection from '@/components/admin/ProductBasicsSection.vue'
import ProductSheetSection from '@/components/admin/ProductSheetSection.vue'
import ProductVisibilitySection from '@/components/admin/ProductVisibilitySection.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import { useProductForm } from '@/composables/admin/useProductForm'

const route = useRoute()
const id = computed(() => (typeof route.params.id === 'string' ? route.params.id : undefined))
const { form, categories, loading, saving, notFound, isNew, save, remove } = useProductForm(id)

const confirmDelete = ref(false)
const storeLink = computed(() => (form.value.slug ? `/producto/${form.value.slug}` : ''))

async function onDelete() {
  confirmDelete.value = false
  await remove()
}
</script>

<template>
  <section class="edit">
    <AdminPageHeader
      :title="isNew ? 'Nuevo producto' : form.name || 'Editar producto'"
      :subtitle="
        isNew
          ? 'Completa los datos y guarda. Puedes dejarlo sin publicar mientras lo preparas.'
          : undefined
      "
      back="/admin/productos"
    >
      <a
        v-if="!isNew && storeLink && form.isPublished"
        :href="storeLink"
        target="_blank"
        class="btn btn--ghost"
      >
        <i class="fa-solid fa-arrow-up-right-from-square"></i> Ver en la tienda
      </a>
    </AdminPageHeader>

    <p v-if="loading" class="edit__loading">
      <i class="fa-solid fa-spinner fa-spin"></i> Cargando…
    </p>

    <AdminEmpty
      v-else-if="notFound"
      icon="fa-solid fa-box-open"
      title="No encontramos este producto"
      text="Puede que lo hayan eliminado."
    >
      <RouterLink to="/admin/productos" class="btn btn--primary">Ir a productos</RouterLink>
    </AdminEmpty>

    <AdminEmpty
      v-else-if="!categories.length"
      icon="fa-solid fa-folder-plus"
      title="Primero crea una categoría"
      text="Cada producto pertenece a una categoría (por ejemplo, Colágenos)."
    >
      <RouterLink to="/admin/categorias" class="btn btn--primary">Crear categoría</RouterLink>
    </AdminEmpty>

    <form v-else class="edit__form" @submit.prevent="save">
      <div class="edit__main">
        <ProductBasicsSection v-model="form" :categories="categories" />

        <AdminCard
          title="Fotos"
          icon="fa-solid fa-images"
          description="La primera foto es la portada. Usa las flechas para cambiar el orden."
        >
          <GalleryEditor v-model="form.images" />
        </AdminCard>

        <AdminCard
          title="Sabores"
          icon="fa-solid fa-droplet"
          description="Cada sabor puede tener su propia foto y su propio inventario."
        >
          <VariantsEditor v-model="form.variants" />
        </AdminCard>

        <ProductSheetSection v-model="form" />
      </div>

      <aside class="edit__side">
        <AdminCard
          title="Precios"
          icon="fa-solid fa-dollar-sign"
          description="En dólares. Cada forma de pago tiene su precio."
        >
          <PricesEditor v-model:prices="form.prices" v-model:compare-at="form.compareAtPrice" />
        </AdminCard>

        <AdminCard
          title="Descuento por cantidad"
          icon="fa-solid fa-layer-group"
          description="Se aplica solo al llevar varias unidades de este producto."
        >
          <VolumeTiersEditor v-model="form.volumeDiscounts" />
        </AdminCard>

        <ProductVisibilitySection v-model="form" />

        <button v-if="!isNew" type="button" class="edit__delete" @click="confirmDelete = true">
          <i class="fa-solid fa-trash-can"></i> Eliminar producto
        </button>
      </aside>

      <div class="edit__bar">
        <p class="edit__bar-text">
          {{
            form.isPublished
              ? 'Se verá en la tienda al guardar.'
              : 'Guardado como borrador (no publicado).'
          }}
        </p>
        <button class="btn btn--primary" type="submit" :disabled="saving">
          <i :class="saving ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-floppy-disk'"></i>
          {{ saving ? 'Guardando…' : isNew ? 'Crear producto' : 'Guardar cambios' }}
        </button>
      </div>
    </form>

    <BaseModal
      :open="confirmDelete"
      title="¿Eliminar este producto?"
      message="Desaparece de la tienda y no se puede recuperar. Si solo quieres ocultarlo, apaga Publicado."
      confirm-label="Sí, eliminar"
      danger
      @confirm="onDelete"
      @cancel="confirmDelete = false"
    />
  </section>
</template>

<style scoped lang="scss">
.edit {
  &__loading {
    color: $ink-soft;
  }

  &__form {
    @include flex(column, stretch, flex-start, 1.2rem);
    padding-bottom: 5.5rem;

    @include from('lg') {
      flex-direction: row;
      flex-wrap: wrap;
      align-items: flex-start;
    }
  }

  &__main,
  &__side {
    @include flex(column, stretch, flex-start, 1.2rem);
    min-width: 0;
  }

  @include from('lg') {
    &__main {
      flex: 1 1 0;
    }

    &__side {
      flex: 0 0 360px;
      position: sticky;
      top: 1rem;
    }
  }

  &__delete {
    @include flex(row, center, center, 0.5rem);
    padding: 0.8rem;
    border-radius: $radius-pill;
    color: $danger;
    font-size: 0.85rem;
    font-weight: 600;

    &:hover {
      background: $danger-bg;
    }
  }

  &__bar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 30;
    @include flex(row, center, space-between, 0.8rem);
    padding: 0.8rem 1rem;
    background: rgba($surface, 0.96);
    backdrop-filter: blur(6px);
    border-top: 1px solid $line;
    box-shadow: 0 -8px 24px rgba($ink, 0.06);

    @include from('lg') {
      left: 250px;
      padding-inline: 2rem;
    }
  }

  &__bar-text {
    font-size: $text-sm;
    color: $ink-soft;
    display: none;

    @include from('sm') {
      display: block;
    }
  }

  .btn {
    flex: none;
  }
}
</style>
