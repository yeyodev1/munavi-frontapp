<script setup lang="ts">
// Si Nathalie cargó banners en el panel, se muestran; si no, el hero de marca.
import { computed } from 'vue'
import HeroSlides from './HeroSlides.vue'
import HeroBrand from './HeroBrand.vue'
import { useSettingsStore } from '@/stores/settings'

const settings = useSettingsStore()
const hasSlides = computed(() => settings.heroSlides.some((s) => s.image?.url))
</script>

<template>
  <HeroSlides v-if="hasSlides" />
  <HeroBrand v-else />
</template>
