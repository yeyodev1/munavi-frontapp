<script setup lang="ts">
import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { layoutCopy } from '@/config/copy/layout'

const copy = layoutCopy.header
const settings = useSettingsStore()

// El anuncio se edita en el panel; cada frase separada por "·" lleva su ícono.
const announceIcon = (text: string) =>
  copy.announceIcons.find((i) => i.match.test(text))?.icon ?? copy.announceDefaultIcon
const announcements = computed(() =>
  settings.announcement
    .split('·')
    .map((text) => text.trim())
    .filter(Boolean)
    .map((text) => ({ text, icon: announceIcon(text) })),
)
</script>

<template>
  <p v-if="announcements.length" class="announce">
    <span v-for="item in announcements" :key="item.text" class="announce__item">
      <i :class="item.icon" aria-hidden="true"></i>
      {{ item.text }}
    </span>
  </p>
</template>

<style scoped lang="scss">
.announce {
  @include flex(row, center, center, 0.3rem 1.8rem);
  flex-wrap: wrap;
  background: $accent-deep;
  color: $surface;
  font-size: $text-sm;
  font-weight: 700;
  letter-spacing: 0.01em;
  padding: 0.45rem 1rem;

  &__item {
    @include flex(row, center, center, 0.5rem);

    i {
      font-size: 1.05em;
    }
  }
}
</style>
