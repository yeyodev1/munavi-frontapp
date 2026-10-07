<script setup lang="ts">
import { ref } from 'vue'
import ImageUploader from './ImageUploader.vue'
import ToggleSwitch from './ToggleSwitch.vue'
import type { AdminCategory, CategoryInput } from '@/services/adminCategories.service'

const props = defineProps<{ category: AdminCategory; busy: boolean }>()
const emit = defineEmits<{ save: [input: Partial<CategoryInput>]; remove: [] }>()

const editing = ref(false)
const draft = ref<CategoryInput>(snapshot())

function snapshot(): CategoryInput {
  const { name, description, image, order, isActive } = props.category
  return { name, description, image, order, isActive }
}

function startEdit() {
  draft.value = snapshot()
  editing.value = true
}

function submit() {
  emit('save', { ...draft.value })
  editing.value = false
}

function toggleActive(value: boolean) {
  emit('save', { isActive: value })
}
</script>

<template>
  <article class="crow">
    <template v-if="!editing">
      <div class="crow__view">
        <span class="crow__thumb">
          <img v-if="category.image" :src="category.image.url" alt="" loading="lazy" />
          <i v-else class="fa-solid fa-folder"></i>
        </span>
        <div class="crow__info">
          <p class="crow__name">{{ category.name }}</p>
          <p class="crow__meta">
            {{ category.productCount }}
            {{ category.productCount === 1 ? 'producto' : 'productos' }} · orden
            {{ category.order }}
          </p>
        </div>
      </div>
      <div class="crow__actions">
        <ToggleSwitch
          :model-value="category.isActive"
          label="Visible"
          :disabled="busy"
          @update:model-value="toggleActive"
        />
        <button class="crow__btn" type="button" @click="startEdit">
          <i class="fa-solid fa-pen"></i> Editar
        </button>
        <button
          class="crow__btn crow__btn--danger"
          type="button"
          :disabled="busy"
          @click="emit('remove')"
        >
          <i class="fa-solid fa-trash-can"></i> Eliminar
        </button>
      </div>
    </template>

    <form v-else class="crow__form" @submit.prevent="submit">
      <div class="crow__fields">
        <div class="crow__field crow__field--wide">
          <label :for="`cat-name-${category._id}`">Nombre</label>
          <input :id="`cat-name-${category._id}`" v-model="draft.name" required />
        </div>
        <div class="crow__field">
          <label :for="`cat-order-${category._id}`">Orden</label>
          <input
            :id="`cat-order-${category._id}`"
            v-model.number="draft.order"
            type="number"
            step="1"
          />
        </div>
      </div>
      <div class="crow__field">
        <label :for="`cat-desc-${category._id}`">Descripción (opcional)</label>
        <textarea :id="`cat-desc-${category._id}`" v-model="draft.description" rows="2"></textarea>
      </div>
      <ImageUploader v-model="draft.image" compact label="Foto de la categoría" />
      <div class="crow__actions">
        <button class="btn btn--ghost" type="button" @click="editing = false">Cancelar</button>
        <button class="btn btn--primary" type="submit" :disabled="busy">Guardar</button>
      </div>
    </form>
  </article>
</template>

<style scoped lang="scss">
.crow {
  @include card;
  @include flex(column, stretch, flex-start, 0.9rem);
  padding: 1rem;

  @include from('md') {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  &__view {
    @include flex(row, center, flex-start, 0.85rem);
    min-width: 0;
  }

  &__thumb {
    flex: none;
    @include flex(row, center, center);
    width: 48px;
    height: 48px;
    border-radius: $radius-sm;
    background: $accent-soft;
    color: $accent;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__name {
    font-weight: 700;
  }

  &__meta {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__actions {
    @include flex(row, center, flex-start, 0.6rem);
    flex-wrap: wrap;
  }

  &__btn {
    @include flex(row, center, center, 0.4rem);
    padding: 0.5rem 0.9rem;
    border: 1px solid $line;
    border-radius: $radius-pill;
    font-size: 0.82rem;
    font-weight: 600;

    &:hover {
      border-color: $accent;
      color: $accent;
    }

    &--danger:hover {
      border-color: $danger;
      color: $danger;
    }
  }

  &__form {
    @include flex(column, stretch, flex-start, 0.9rem);
    width: 100%;
  }

  &__fields {
    @include flex(row, flex-end, flex-start, 0.8rem);
    flex-wrap: wrap;
  }

  &__field {
    flex: 1 1 120px;
    min-width: 0;

    &--wide {
      flex-basis: 240px;
    }

    textarea {
      resize: vertical;
    }
  }
}
</style>
