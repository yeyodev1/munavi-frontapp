<script setup lang="ts">
import HomeHero from '@/components/home/HomeHero.vue'
import SomosBlock from '@/components/home/SomosBlock.vue'
import HomeTrust from '@/components/home/HomeTrust.vue'
import HomeCategories from '@/components/home/HomeCategories.vue'
import HomeProducts from '@/components/home/HomeProducts.vue'
import HomePromos from '@/components/home/HomePromos.vue'
import HomeFlavors from '@/components/home/HomeFlavors.vue'
import HomeSubscribe from '@/components/home/HomeSubscribe.vue'
import HomeHelp from '@/components/home/HomeHelp.vue'
import { homeCopy } from '@/config/copy/home'

const { featured, bestSellers } = homeCopy
</script>

<template>
  <div class="home">
    <HomeHero />
    <SomosBlock />
    <HomeTrust />
    <HomeProducts
      :eyebrow="featured.eyebrow"
      :title="featured.title"
      :link-label="featured.link"
      :query="{ featured: true }"
      primary
    />
    <HomeCategories />
    <HomePromos />
    <HomeProducts
      :eyebrow="bestSellers.eyebrow"
      :title="bestSellers.title"
      :link-label="bestSellers.link"
      :query="{ bestSeller: true }"
    />
    <HomeFlavors />
    <HomeSubscribe />
    <HomeHelp />
  </div>
</template>
