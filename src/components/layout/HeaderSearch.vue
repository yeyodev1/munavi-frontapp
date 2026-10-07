<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { layoutCopy } from '@/config/copy/layout'

const copy = layoutCopy.header
const open = defineModel<boolean>({ required: true })
const router = useRouter()
const term = ref('')
const input = ref<HTMLInputElement | null>(null)

watch(open, async (value) => {
  if (!value) return
  await nextTick()
  input.value?.focus()
})

function submit() {
  const q = term.value.trim()
  router.push({ path: '/tienda', query: q ? { q } : {} })
  open.value = false
  term.value = ''
}
</script>

<template>
  <Transition name="fade">
    <form v-if="open" class="hsearch" role="search" @submit.prevent="submit" @keydown.esc="open = false">
      <div class="hsearch__inner">
        <label for="header-search" class="visually-hidden">{{ copy.searchLabel }}</label>
        <i class="fa-solid fa-magnifying-glass hsearch__icon" aria-hidden="true"></i>
        <input
          id="header-search"
          ref="input"
          v-model="term"
          type="search"
          :placeholder="copy.searchPlaceholder"
          class="hsearch__input"
        />
        <button type="button" class="hsearch__close" :aria-label="copy.closeSearch" @click="open = false">
          <i class="fa-solid fa-xmark" aria-hidden="true"></i>
        </button>
      </div>
    </form>
  </Transition>
</template>

<style scoped lang="scss">
.hsearch {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: $surface;
  border-bottom: 1px solid $line;
  box-shadow: $shadow-md;
  padding-block: 0.8rem;

  &__inner {
    @include container(760px);
    position: relative;
    @include flex(row, center, flex-start);
  }

  &__icon {
    position: absolute;
    left: 2.25rem;
    color: $ink-muted;

    @include from('md') {
      left: 3rem;
    }
  }

  &__input {
    border-radius: $radius-pill;
    padding-left: 2.7rem;
    padding-right: 3rem;
    min-height: 3rem;
  }

  &__close {
    position: absolute;
    right: 1.65rem;
    width: 2.2rem;
    height: 2.2rem;
    color: $ink-muted;

    @include from('md') {
      right: 2.4rem;
    }
  }
}
</style>
