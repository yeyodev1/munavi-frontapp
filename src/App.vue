<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import TheHeader from '@/layout/TheHeader.vue'
import TheFooter from '@/layout/TheFooter.vue'
import ToastList from '@/components/ui/ToastList.vue'
import WhatsAppFloat from '@/components/WhatsAppFloat.vue'
import CartDrawer from '@/components/cart/CartDrawer.vue'

// El panel se carga aparte: quien solo compra nunca descarga su código.
const AdminLayout = defineAsyncComponent(() => import('@/layout/AdminLayout.vue'))

const route = useRoute()
const layout = computed(() => (route.meta.layout as string | undefined) ?? 'store')
</script>

<template>
  <AdminLayout v-if="layout === 'admin'">
    <RouterView />
  </AdminLayout>

  <main v-else-if="layout === 'bare'" class="app__bare">
    <RouterView />
  </main>

  <div v-else class="app">
    <TheHeader />
    <main class="app__main">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <TheFooter />
    <CartDrawer />
    <WhatsAppFloat />
  </div>

  <ToastList />
</template>

<style scoped lang="scss">
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  &__main,
  &__bare {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  &__bare {
    min-height: 100vh;
  }
}
</style>
