<script setup lang="ts">
import { computed, watch } from 'vue'
import { useProducts } from '@/composables/useCatalog'
import { homeCopy } from '@/config/copy/home'

const emit = defineEmits<{ empty: [] }>()

const copy = homeCopy.hero
const { items, loading } = useProducts(() => ({ featured: true, limit: 3 }))

const picks = computed(() =>
  items.value
    .map((p) => ({ slug: p.slug, name: p.name, image: p.image || p.variants.find((v) => v.image?.url)?.image?.url || '' }))
    .filter((p) => p.image)
    .slice(0, 3),
)

// Sin destacados con foto, el hero vuelve a su versión de solo texto.
watch(
  () => !loading.value && picks.value.length === 0,
  (empty) => empty && emit('empty'),
  { immediate: true },
)
</script>

<template>
  <div v-if="loading || picks.length" class="showcase" :aria-label="copy.showcaseLabel" :aria-busy="loading">
    <span class="showcase__halo" aria-hidden="true"></span>

    <template v-if="loading">
      <span v-for="n in 3" :key="n" class="showcase__item showcase__item--ghost" :class="`showcase__item--${n - 1}`"></span>
    </template>

    <RouterLink
      v-for="(p, i) in picks"
      v-else
      :key="p.slug"
      :to="{ name: 'Product', params: { slug: p.slug } }"
      class="showcase__item"
      :class="`showcase__item--${i}`"
    >
      <img :src="p.image" :alt="p.name" class="showcase__img" :fetchpriority="i === 0 ? 'high' : 'low'" />
      <span class="showcase__name">{{ p.name }}</span>
    </RouterLink>
  </div>
</template>

<style scoped lang="scss">
.showcase {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 520px;
  aspect-ratio: 5 / 4;
  margin-inline: auto;

  @include from('md') {
    flex: 1 1 46%;
  }

  &__halo {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 78%;
    aspect-ratio: 1;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: radial-gradient(circle at 40% 35%, rgba($surface, 0.95), rgba($surface, 0.35) 55%, transparent 72%);
  }

  &__item {
    position: absolute;
    bottom: 10%;
    aspect-ratio: 3 / 4;
    @include flex(column, center, flex-end);
    animation: showcase-float 7s ease-in-out infinite alternate;

    // Sombra de "piso" para que el envase flote sobre algo.
    &::after {
      content: '';
      position: absolute;
      bottom: -4%;
      left: 12%;
      width: 76%;
      height: 9%;
      border-radius: 50%;
      background: radial-gradient(ellipse, rgba($accent-deep, 0.22), transparent 70%);
      z-index: -1;
    }

    &--0 {
      left: 30%;
      width: 40%;
      z-index: 2;
    }

    &--1 {
      left: 2%;
      width: 31%;
      bottom: 16%;
      animation-delay: -2.5s;
    }

    &--2 {
      right: 2%;
      width: 31%;
      bottom: 20%;
      animation-delay: -5s;
    }

    &--ghost {
      border-radius: $radius-md;
      background: linear-gradient(90deg, rgba($surface, 0.5) 25%, rgba($surface, 0.85) 50%, rgba($surface, 0.5) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.6s linear infinite;

      &::after {
        display: none;
      }
    }
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: bottom;
    filter: drop-shadow(0 18px 20px rgba($ink, 0.16));
    transition: transform 0.5s $ease;
  }

  &__item:hover &__img,
  &__item:focus-visible &__img {
    transform: translateY(-6px) scale(1.04);
  }

  &__name {
    position: absolute;
    bottom: -2.2rem;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    font-size: $text-xs;
    font-weight: 600;
    color: $accent-deep;
    background: rgba($surface, 0.9);
    padding: 0.3rem 0.75rem;
    border-radius: $radius-pill;
    opacity: 0;
    @include transition;
  }

  &__item:hover &__name,
  &__item:focus-visible &__name {
    opacity: 1;
  }

  @include reduced-motion {
    &__item {
      animation: none;
    }
  }
}

@keyframes showcase-float {
  to {
    transform: translateY(-12px);
  }
}
</style>
