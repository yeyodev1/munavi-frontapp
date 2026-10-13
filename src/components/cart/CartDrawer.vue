<script setup lang="ts">
import { onMounted, onUnmounted, toRef, watch } from 'vue'
import { useRoute } from 'vue-router'
import CartDrawerContent from '@/components/cart/CartDrawerContent.vue'
import { useCartStore } from '@/stores/cart'
import { useSettingsStore } from '@/stores/settings'
import { useBodyScroll } from '@/composables/useBodyScroll'
import { cartCopy as copy } from '@/config/copy/checkout'

const cart = useCartStore()
const settings = useSettingsStore()
const route = useRoute()

useBodyScroll(toRef(cart, 'drawerOpen'))

function onKey(event: KeyboardEvent) {
  if (event.key === 'Escape' && cart.drawerOpen) cart.close()
}

onMounted(() => {
  settings.load()
  window.addEventListener('keydown', onKey)
})
onUnmounted(() => window.removeEventListener('keydown', onKey))

// Cualquier navegación cierra el panel (links de producto, botones de abajo).
watch(() => route.fullPath, () => cart.close())
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="cart.drawerOpen" class="drawer" @click.self="cart.close()">
        <aside class="drawer__panel" role="dialog" aria-modal="true" :aria-label="copy.title">
          <header class="drawer__head">
            <h2 class="drawer__title">
              {{ copy.title }}
              <span v-if="cart.count" class="drawer__count">{{ copy.units(cart.count) }}</span>
            </h2>
            <button type="button" class="drawer__close" :aria-label="copy.close" @click="cart.close()">
              <i class="fa-solid fa-xmark" aria-hidden="true"></i>
            </button>
          </header>

          <div v-if="cart.isEmpty" class="drawer__empty">
            <span class="drawer__empty-icon"><i class="fa-solid fa-bag-shopping" aria-hidden="true"></i></span>
            <p class="drawer__empty-title">{{ copy.emptyTitle }}</p>
            <p class="drawer__empty-text">{{ copy.emptyText }}</p>
            <RouterLink to="/tienda" class="btn btn--primary">{{ copy.toShop }}</RouterLink>
          </div>

          <CartDrawerContent v-else />
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.drawer {
  position: fixed;
  inset: 0;
  z-index: 150;
  @include flex(row, stretch, flex-end);
  background: $overlay;
  backdrop-filter: blur(2px);

  &__panel {
    @include flex(column, stretch, flex-start);
    width: 100%;
    max-width: 420px;
    height: 100%;
    background: $paper;
    box-shadow: $shadow-lg;
  }

  &__head {
    @include flex(row, center, space-between, 1rem);
    padding: 1.1rem 1.25rem;
    border-bottom: 1px solid $line;
  }

  &__title {
    @include display($text-xl, 700);
    @include flex(row, baseline, flex-start, 0.6rem);
  }

  &__count {
    font-family: $font-principal;
    font-size: $text-xs;
    font-weight: 500;
    letter-spacing: 0;
    color: $ink-muted;
  }

  &__close {
    @include flex(row, center, center);
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 50%;
    @include transition(background);

    &:hover {
      background: rgba($accent, 0.08);
    }
  }

  &__empty {
    @include flex(column, center, center, 0.6rem);
    flex: 1;
    padding: $space-md;
    text-align: center;
  }

  &__empty-icon {
    @include flex(row, center, center);
    width: 3.4rem;
    height: 3.4rem;
    border-radius: 50%;
    background: $sage-soft;
    color: $accent;
    font-size: 1.2rem;
  }

  &__empty-title {
    @include display($text-xl, 700);
  }

  &__empty-text {
    font-size: $text-sm;
    color: $ink-soft;
    margin-bottom: 0.5rem;
  }
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.3s ease;

  .drawer__panel {
    transition: transform 0.35s $ease;
  }
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;

  .drawer__panel {
    transform: translateX(100%);
  }
}
</style>
