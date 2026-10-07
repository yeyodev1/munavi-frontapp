<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Product } from '@/types'
import { productDetailCopy } from '@/config/copy/product'

const props = defineProps<{ product: Product }>()

type Key = keyof typeof productDetailCopy.sections
const textKeys: Exclude<Key, 'benefits'>[] = ['description', 'presentation', 'usage', 'ingredients', 'nutritionInfo', 'warnings']
const order: Key[] = ['description', 'benefits', 'presentation', 'usage', 'ingredients', 'nutritionInfo', 'warnings']

// Solo se muestran las secciones con contenido: una pestaña vacía resta confianza.
const sections = computed(() =>
  order
    .map((key) => {
      if (key === 'benefits') return { key, list: props.product.benefits.filter(Boolean), text: '' }
      const text = textKeys.includes(key) ? (props.product[key] || '').trim() : ''
      return { key, list: [] as string[], text }
    })
    .filter((s) => s.text || s.list.length),
)

const open = ref<Key | null>('description')
const toggle = (key: Key) => (open.value = open.value === key ? null : key)
</script>

<template>
  <div v-if="sections.length" class="details">
    <section v-for="section in sections" :key="section.key" class="details__item">
      <h3>
        <button
          type="button"
          class="details__head"
          :aria-expanded="open === section.key"
          :aria-controls="`detail-${section.key}`"
          @click="toggle(section.key)"
        >
          {{ productDetailCopy.sections[section.key] }}
          <i class="fa-solid fa-plus details__icon" aria-hidden="true"></i>
        </button>
      </h3>
      <div v-show="open === section.key" :id="`detail-${section.key}`" class="details__body">
        <ul v-if="section.list.length" class="details__list">
          <li v-for="item in section.list" :key="item">
            <i class="fa-solid fa-circle-check" aria-hidden="true"></i>
            {{ item }}
          </li>
        </ul>
        <p v-else class="details__text">{{ section.text }}</p>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.details {
  border-top: 1px solid $line;

  &__item {
    border-bottom: 1px solid $line;
  }

  &__head {
    @include flex(row, center, space-between, 1rem);
    width: 100%;
    padding: 1.1rem 0;
    font-family: $font-display;
    font-size: $text-lg;
    font-weight: 500;
    text-align: left;
    color: $ink;

    &:hover {
      color: $accent;
    }
  }

  &__icon {
    font-size: 0.8rem;
    color: $accent;
    @include transition(transform);
  }

  &__head[aria-expanded='true'] &__icon {
    transform: rotate(45deg);
  }

  &__body {
    padding-bottom: 1.3rem;
    color: $ink-soft;
    font-size: $text-sm;
  }

  &__text {
    white-space: pre-line;
    max-width: 68ch;
  }

  &__list {
    list-style: none;
    @include flex(column, flex-start, flex-start, 0.55rem);

    li {
      @include flex(row, baseline, flex-start, 0.55rem);
    }

    i {
      color: $accent;
    }
  }
}
</style>
