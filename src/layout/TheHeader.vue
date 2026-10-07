<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import HeaderSearch from '@/components/layout/HeaderSearch.vue'
import { site, whatsappLink } from '@/config/site'
import { layoutCopy } from '@/config/copy/layout'
import { useCartStore } from '@/stores/cart'
import { useSettingsStore } from '@/stores/settings'
import { useBodyScroll } from '@/composables/useBodyScroll'
import { trackPageView } from '@/composables/useTracking'

const copy = layoutCopy.header
const route = useRoute()
const cart = useCartStore()
const settings = useSettingsStore()
const mobileOpen = ref(false)
const searchOpen = ref(false)

useBodyScroll(mobileOpen)
onMounted(() => settings.load())

// Al navegar se cierran menú y buscador, y se registra la vista de página.
// El header vive en todas las páginas de la tienda, por eso mide desde aquí.
watch(
  () => route.path,
  (path) => {
    mobileOpen.value = false
    searchOpen.value = false
    // START_LOCATION (antes de resolver la primera ruta) no tiene matched.
    if (route.matched.length) setTimeout(() => trackPageView(path), 0)
  },
  { immediate: true },
)

function toggleSearch() {
  mobileOpen.value = false
  searchOpen.value = !searchOpen.value
}
</script>

<template>
  <header class="header">
    <p v-if="settings.announcement" class="header__announce">{{ settings.announcement }}</p>

    <div class="header__bar">
      <div class="header__inner">
        <button
          class="header__icon header__burger"
          :aria-label="mobileOpen ? copy.closeMenu : copy.openMenu"
          :aria-expanded="mobileOpen"
          @click="mobileOpen = !mobileOpen"
        >
          <i :class="mobileOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'" aria-hidden="true"></i>
        </button>

        <RouterLink to="/" class="header__logo" :aria-label="site.name">
          {{ site.name.toLowerCase() }}<span class="header__dot" aria-hidden="true">.</span>
        </RouterLink>

        <nav class="header__nav" aria-label="Principal">
          <RouterLink v-for="link in site.nav" :key="link.to" :to="link.to" class="header__link">
            {{ link.label }}
          </RouterLink>
        </nav>

        <div class="header__actions">
          <button class="header__icon" :aria-label="searchOpen ? copy.closeSearch : copy.openSearch" @click="toggleSearch">
            <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
          </button>
          <button class="header__icon header__cart" :aria-label="`${copy.cart} (${cart.count})`" @click="cart.open()">
            <i class="fa-solid fa-bag-shopping" aria-hidden="true"></i>
            <Transition name="fade">
              <span v-if="cart.count" :key="cart.count" class="header__count">{{ cart.count }}</span>
            </Transition>
          </button>
        </div>
      </div>

      <HeaderSearch v-model="searchOpen" />

      <Transition name="fade">
        <nav v-if="mobileOpen" class="header__mobile" aria-label="Menú">
          <RouterLink v-for="link in site.nav" :key="link.to" :to="link.to" class="header__mlink">
            {{ link.label }}
            <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
          </RouterLink>
          <div class="header__mhelp">
            <p>{{ copy.menuHelp }}</p>
            <a :href="whatsappLink(undefined, settings.whatsapp)" target="_blank" rel="noopener" class="btn btn--primary">
              <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ copy.menuWhatsapp }}
            </a>
          </div>
        </nav>
      </Transition>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header {
  position: sticky;
  top: 0;
  z-index: 100;

  &__announce {
    background: $accent;
    color: $surface;
    text-align: center;
    font-size: $text-xs;
    font-weight: 600;
    letter-spacing: 0.04em;
    padding: 0.5rem 1rem;
  }

  &__bar {
    position: relative;
    background: rgba($paper, 0.94);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid $line;
  }

  &__inner {
    @include container;
    @include flex(row, center, space-between, 0.5rem);
    min-height: 4rem;
  }

  &__logo {
    font-family: $font-display;
    font-size: 1.75rem;
    font-weight: 600;
    font-style: italic;
    letter-spacing: -0.03em;
    color: $accent;
    line-height: 1;

    @include until('md') {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  &__dot {
    color: $rose;
  }

  &__nav {
    display: none;

    @include from('md') {
      @include flex(row, center, center, 2rem);
      flex: 1;
    }
  }

  &__link {
    font-size: $text-sm;
    font-weight: 500;
    color: $ink-soft;
    padding-block: 0.4rem;
    border-bottom: 2px solid transparent;
    @include transition;

    &:hover,
    &.router-link-exact-active {
      color: $accent;
      border-color: $accent;
    }
  }

  &__actions {
    @include flex(row, center, flex-end, 0.15rem);
  }

  &__icon {
    position: relative;
    @include flex(row, center, center);
    width: 2.6rem;
    height: 2.6rem;
    border-radius: 50%;
    font-size: 1.1rem;
    color: $ink;
    @include transition(background);

    &:hover {
      background: rgba($accent, 0.08);
    }
  }

  &__burger {
    @include from('md') {
      display: none;
    }
  }

  &__count {
    position: absolute;
    top: 0.15rem;
    right: 0.05rem;
    min-width: 1.2rem;
    height: 1.2rem;
    padding-inline: 0.3rem;
    border-radius: $radius-pill;
    background: $rose;
    color: $surface;
    font-size: 0.66rem;
    font-weight: 700;
    line-height: 1.2rem;
    text-align: center;
  }

  &__mobile {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    height: calc(100dvh - 100%);
    overflow-y: auto;
    background: $paper;
    padding: 1rem 1.25rem 2rem;
    @include flex(column, stretch, flex-start);

    @include from('md') {
      display: none;
    }
  }

  &__mlink {
    @include flex(row, center, space-between);
    font-family: $font-display;
    font-size: $text-xl;
    padding: 1rem 0;
    border-bottom: 1px solid $line;

    i {
      font-size: 0.8rem;
      color: $accent;
    }

    &.router-link-exact-active {
      color: $accent;
    }
  }

  &__mhelp {
    @include flex(column, stretch, flex-start, 0.75rem);
    margin-top: $space-lg;
    padding: 1.25rem;
    border-radius: $radius-md;
    background: rgba($accent, 0.06);
    font-size: $text-sm;
    color: $ink-soft;
  }
}
</style>
