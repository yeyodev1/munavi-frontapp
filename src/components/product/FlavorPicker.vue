<script setup lang="ts">
import type { Variant } from '@/types'
import { productCopy, productDetailCopy as copy } from '@/config/copy/product'

defineProps<{ variants: Variant[] }>()
const model = defineModel<string>({ required: true })

const isAvailable = (v: Variant) => v.inStock !== false && (v.stock == null || v.stock > 0)
</script>

<template>
  <fieldset class="flavors">
    <legend class="flavors__label">
      {{ copy.flavor }}:
      <strong>{{ variants.find((v) => v.slug === model)?.name }}</strong>
    </legend>
    <div class="flavors__list">
      <label
        v-for="variant in variants"
        :key="variant.slug"
        class="flavors__option"
        :class="{
          'flavors__option--active': variant.slug === model,
          'flavors__option--out': !isAvailable(variant),
        }"
      >
        <input v-model="model" type="radio" :value="variant.slug" class="visually-hidden" name="flavor" />
        <img v-if="variant.image" :src="variant.image.url" alt="" class="flavors__thumb" />
        <span>{{ variant.name }}</span>
        <span v-if="!isAvailable(variant)" class="flavors__out">{{ productCopy.outOfStock }}</span>
      </label>
    </div>
  </fieldset>
</template>

<style scoped lang="scss">
.flavors {
  border: none;

  &__label {
    font-size: $text-sm;
    color: $ink-soft;
    margin-bottom: 0.6rem;

    strong {
      color: $ink;
      font-weight: 600;
    }
  }

  &__list {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
  }

  &__option {
    @include flex(row, center, flex-start, 0.45rem);
    margin: 0;
    font-size: $text-sm;
    font-weight: 500;
    color: $ink;
    padding: 0.45rem 0.95rem;
    border: 1.5px solid $line;
    border-radius: $radius-pill;
    background: $surface;
    cursor: pointer;
    @include transition;

    &:hover {
      border-color: rgba($accent, 0.5);
    }

    &:has(input:focus-visible) {
      outline: 2px solid $accent;
      outline-offset: 2px;
    }

    &--active {
      border-color: $accent;
      background: rgba($accent, 0.07);
      color: $accent-deep;
    }

    &--out {
      color: $ink-muted;

      span:first-of-type {
        text-decoration: line-through;
      }
    }
  }

  &__thumb {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    object-fit: contain;
    background: $surface;
    margin-left: -0.45rem;
  }

  &__out {
    font-size: 0.62rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
}
</style>
