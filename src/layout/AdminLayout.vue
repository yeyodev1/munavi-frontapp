<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useBodyScroll } from '@/composables/useBodyScroll'
import MunaviLogo from '@/components/brand/MunaviLogo.vue'

const links = [
  { to: '/admin', label: 'Panel', icon: 'fa-solid fa-house', exact: true },
  { to: '/admin/pedidos', label: 'Pedidos', icon: 'fa-solid fa-bag-shopping' },
  { to: '/admin/productos', label: 'Productos', icon: 'fa-solid fa-box' },
  { to: '/admin/categorias', label: 'Categorías', icon: 'fa-solid fa-folder' },
  { to: '/admin/cupones', label: 'Cupones', icon: 'fa-solid fa-ticket' },
  { to: '/admin/suscriptores', label: 'Suscriptores', icon: 'fa-solid fa-envelope-open-text' },
  { to: '/admin/ajustes', label: 'Ajustes', icon: 'fa-solid fa-gear' },
]

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const menuOpen = ref(false)

useBodyScroll(menuOpen)
watch(
  () => route.fullPath,
  () => (menuOpen.value = false),
)

function isActive(link: (typeof links)[number]) {
  return link.exact ? route.path === link.to : route.path.startsWith(link.to)
}

function logout() {
  userStore.clear()
  router.replace({ name: 'AdminLogin' })
}
</script>

<template>
  <div class="admin">
    <header class="admin__top">
      <RouterLink to="/admin" class="admin__brand"><MunaviLogo /> <span>Panel</span></RouterLink>
      <button
        class="admin__burger"
        type="button"
        :aria-expanded="menuOpen"
        aria-controls="admin-nav"
        :aria-label="menuOpen ? 'Cerrar menú' : 'Abrir menú'"
        @click="menuOpen = !menuOpen"
      >
        <i :class="menuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'"></i>
      </button>
    </header>

    <aside id="admin-nav" class="admin__side" :class="{ 'admin__side--open': menuOpen }">
      <RouterLink to="/admin" class="admin__brand admin__brand--side"
        ><MunaviLogo /> <span>Panel</span></RouterLink
      >

      <nav class="admin__nav" aria-label="Panel de administración">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="admin__link"
          :class="{ 'admin__link--active': isActive(link) }"
        >
          <i :class="link.icon"></i> {{ link.label }}
        </RouterLink>
      </nav>

      <div class="admin__foot">
        <a href="/" target="_blank" class="admin__link">
          <i class="fa-solid fa-store"></i> Ver tienda
        </a>
        <button type="button" class="admin__link" @click="logout">
          <i class="fa-solid fa-arrow-right-from-bracket"></i> Cerrar sesión
        </button>
        <p v-if="userStore.user" class="admin__user">{{ userStore.user.email }}</p>
      </div>
    </aside>

    <Transition name="fade">
      <div v-if="menuOpen" class="admin__scrim" @click="menuOpen = false"></div>
    </Transition>

    <main class="admin__main">
      <slot />
    </main>
  </div>
</template>

<style scoped lang="scss">
$side-width: 250px;

.admin {
  min-height: 100vh;
  background: $paper;

  &__top {
    position: sticky;
    top: 0;
    z-index: 50;
    @include flex(row, center, space-between);
    height: 3.6rem;
    padding-inline: 1rem;
    background: $ink-brand;
    color: $surface;

    @include from('lg') {
      display: none;
    }
  }

  &__brand {
    display: inline-flex;
    align-items: center;
    font-size: 1.55rem;
    color: $surface;

    span {
      font-family: $font-principal;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: lighten($accent, 35%);
      margin-left: 0.3rem;
    }

    &--side {
      display: none;
      padding: 0.4rem 0.8rem 1.4rem;

      @include from('lg') {
        display: inline-flex;
      }
    }
  }

  &__burger {
    width: 2.6rem;
    height: 2.6rem;
    border-radius: 50%;
    color: $surface;
    font-size: 1.2rem;
  }

  &__side {
    position: fixed;
    top: 3.6rem;
    bottom: 0;
    left: 0;
    z-index: 60;
    width: min(82vw, 300px);
    @include flex(column, stretch, flex-start, 1rem);
    padding: 1.2rem 0.8rem;
    background: $ink-brand;
    overflow-y: auto;
    transform: translateX(-100%);
    transition: transform 0.3s $ease;

    &--open {
      transform: none;
    }

    @include from('lg') {
      top: 0;
      width: $side-width;
      transform: none;
      transition: none;
    }
  }

  &__nav {
    @include flex(column, stretch, flex-start, 0.2rem);
    flex: 1;
  }

  &__link {
    @include flex(row, center, flex-start, 0.8rem);
    width: 100%;
    padding: 0.75rem 0.9rem;
    border-radius: $radius-sm;
    color: rgba($surface, 0.72);
    font-size: 0.95rem;
    font-weight: 500;
    text-align: left;
    @include transition(background);

    i {
      width: 1.2rem;
      text-align: center;
    }

    &:hover {
      background: rgba($surface, 0.08);
      color: $surface;
    }

    &--active {
      background: $accent;
      color: $surface;

      &:hover {
        background: $accent;
      }
    }
  }

  &__foot {
    @include flex(column, stretch, flex-start, 0.2rem);
    padding-top: 1rem;
    border-top: 1px solid rgba($surface, 0.12);
  }

  &__user {
    padding: 0.6rem 0.9rem 0;
    font-size: $text-xs;
    color: rgba($surface, 0.5);
    overflow-wrap: anywhere;
  }

  &__scrim {
    position: fixed;
    inset: 3.6rem 0 0 0;
    z-index: 55;
    background: $overlay;

    @include from('lg') {
      display: none;
    }
  }

  &__main {
    padding: 1.4rem 1rem 3rem;
    min-width: 0;

    @include from('md') {
      padding: 2rem 2rem 4rem;
    }

    @include from('lg') {
      margin-left: $side-width;
      padding: 2.4rem 2.5rem 4rem;
      max-width: calc(1240px + #{$side-width});
    }
  }
}
</style>
