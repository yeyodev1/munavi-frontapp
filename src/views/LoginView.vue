<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import type { ApiError } from '@/types'
import MunaviLogo from '@/components/brand/MunaviLogo.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const toast = useToastStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function submit() {
  error.value = ''
  loading.value = true
  try {
    const user = await userStore.login(email.value.trim(), password.value)
    toast.success(`Hola, ${user.name || user.email}`)
    const next = typeof route.query.next === 'string' ? route.query.next : '/admin'
    router.replace(next)
  } catch (e) {
    error.value = (e as ApiError).message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="login">
    <form class="login__card" @submit.prevent="submit">
      <MunaviLogo class="login__brand" />
      <h1 class="login__title">Panel Munavi</h1>
      <p class="login__lead">Ingresa para administrar productos, pedidos y promociones.</p>

      <div class="login__field">
        <label for="email">Correo</label>
        <input id="email" v-model="email" type="email" autocomplete="email" required />
      </div>

      <div class="login__field">
        <label for="password">Contraseña</label>
        <input
          id="password"
          v-model="password"
          type="password"
          autocomplete="current-password"
          required
        />
      </div>

      <Transition name="rise">
        <p v-if="error" class="login__error">
          <i class="fa-solid fa-circle-exclamation"></i> {{ error }}
        </p>
      </Transition>

      <button class="btn btn--primary login__submit" type="submit" :disabled="loading">
        <i v-if="loading" class="fa-solid fa-spinner fa-spin"></i>
        {{ loading ? 'Ingresando…' : 'Ingresar al panel' }}
      </button>
    </form>

    <a href="/" class="login__back"><i class="fa-solid fa-arrow-left"></i> Volver a la tienda</a>
  </section>
</template>

<style scoped lang="scss">
.login {
  @include flex(column, center, center, 1.2rem);
  flex: 1;
  min-height: 100vh;
  padding: 2rem 1rem;
  background: radial-gradient(circle at 85% 10%, rgba($accent, 0.45), transparent 45%), $ink-brand;

  &__card {
    @include card;
    @include flex(column, stretch, flex-start, 1rem);
    width: 100%;
    max-width: 420px;
    padding: 2rem 1.4rem;
    box-shadow: $shadow-lg;

    @include from('sm') {
      padding: 2.4rem 2.2rem;
    }
  }

  &__brand {
    align-self: flex-start;
    font-size: 2rem;
    color: $accent;
  }

  &__title {
    @include display($display-sm, 600);
  }

  &__lead {
    font-size: $text-sm;
    color: $ink-soft;
    margin-bottom: 0.4rem;
  }

  &__back {
    @include flex(row, center, center, 0.4rem);
    font-size: $text-sm;
    color: rgba($surface, 0.7);

    &:hover {
      color: $surface;
    }
  }

  &__error {
    @include flex(row, center, flex-start, 0.5rem);
    font-size: $text-sm;
    color: $danger;
    background: $danger-bg;
    padding: 0.7rem 0.9rem;
    border-radius: $radius-sm;
  }

  &__submit {
    margin-top: 0.4rem;
  }
}
</style>
