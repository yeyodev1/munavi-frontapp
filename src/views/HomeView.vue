<script setup lang="ts">
// Orden de la "Arquitectura Comercial – Propuesta 03" aprobada por la clienta.
import HomeHero from '@/components/home/HomeHero.vue'
import HomeCategories from '@/components/home/HomeCategories.vue'
import HomeProducts from '@/components/home/HomeProducts.vue'
import HomeVolumePromo from '@/components/home/HomeVolumePromo.vue'
import HomeTrust from '@/components/home/HomeTrust.vue'
import HomeFlavors from '@/components/home/HomeFlavors.vue'
import HomeCommunity from '@/components/home/HomeCommunity.vue'
import HomeHelp from '@/components/home/HomeHelp.vue'
import { homeCopy } from '@/config/copy/home'

const { featured, newArrivals } = homeCopy
</script>

<template>
  <div class="home">
    <HomeHero />
    <HomeCategories />
    <HomeProducts
      :eyebrow="featured.eyebrow"
      :title="featured.title"
      :link-label="featured.link"
      :query="{ featured: true }"
      primary
    />
    <HomeVolumePromo />
    <HomeTrust />
    <!-- Sin productos marcados como novedad, la sección no aparece. -->
    <HomeProducts
      :eyebrow="newArrivals.eyebrow"
      :title="newArrivals.title"
      :link-label="newArrivals.link"
      :query="{ newArrival: true }"
    />
    <HomeFlavors />
    <HomeCommunity />
    <HomeHelp />
  </div>
</template>
