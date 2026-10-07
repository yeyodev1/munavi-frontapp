<script setup lang="ts">
import type { Subscriber } from '@/types'
import { useSubscribe } from '@/composables/useSubscribe'
import { subscribeCopy as copy } from '@/config/copy/home'

const props = withDefaults(defineProps<{ source: Subscriber['source']; tone?: 'light' | 'dark' }>(), {
  tone: 'light',
})

const { email, loading, error, coupon, submit, copyCode } = useSubscribe(props.source)
const inputId = `subscribe-${props.source}`
</script>

<template>
  <div class="subscribe" :class="`subscribe--${tone}`">
    <Transition name="rise" mode="out-in">
      <div v-if="coupon" class="subscribe__done" role="status">
        <p class="subscribe__done-title">
          <i class="fa-solid fa-gift" aria-hidden="true"></i>
          {{ copy.successTitle }}
        </p>
        <div class="subscribe__coupon">
          <span class="subscribe__code">{{ coupon.code }}</span>
          <span class="subscribe__percent">{{ coupon.percent }}% {{ copy.off }}</span>
          <button type="button" class="subscribe__copy" @click="copyCode">
            <i class="fa-regular fa-copy" aria-hidden="true"></i>
            {{ copy.copy }}
          </button>
        </div>
        <p class="subscribe__hint">{{ copy.successText }}</p>
      </div>

      <form v-else class="subscribe__form" novalidate @submit.prevent="submit">
        <label :for="inputId" class="visually-hidden">{{ copy.label }}</label>
        <input
          :id="inputId"
          v-model="email"
          type="email"
          autocomplete="email"
          :placeholder="copy.placeholder"
          :aria-invalid="!!error"
          class="subscribe__input"
        />
        <button type="submit" class="btn btn--primary subscribe__btn" :disabled="loading">
          {{ loading ? copy.loading : copy.submit }}
        </button>
        <p v-if="error" class="subscribe__error">{{ error }}</p>
      </form>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.subscribe {
  width: 100%;

  &__form {
    @include flex(row, stretch, flex-start, 0.5rem);
    flex-wrap: wrap;
  }

  &__input {
    flex: 1 1 200px;
    border-radius: $radius-pill;
    padding-inline: 1.2rem;
    min-height: 3rem;
  }

  &__btn {
    flex: 1 0 auto;

    @include from('sm') {
      flex-grow: 0;
    }
  }

  &__error {
    flex-basis: 100%;
    font-size: $text-xs;
    color: $danger;
    padding-left: 1rem;
  }

  &__done {
    @include flex(column, flex-start, flex-start, 0.6rem);
  }

  &__done-title {
    @include flex(row, center, flex-start, 0.5rem);
    font-weight: 600;
  }

  &__coupon {
    @include flex(row, center, flex-start, 0.75rem);
    flex-wrap: wrap;
    padding: 0.6rem 0.6rem 0.6rem 1.1rem;
    border-radius: $radius-pill;
    border: 2px dashed $accent;
    background: $surface;
  }

  &__code {
    font-weight: 700;
    letter-spacing: 0.12em;
    color: $accent-deep;
  }

  &__percent {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__copy {
    @include flex(row, center, center, 0.35rem);
    font-size: $text-xs;
    font-weight: 600;
    padding: 0.4rem 0.9rem;
    border-radius: $radius-pill;
    background: $accent;
    color: $surface;
  }

  &__hint {
    font-size: $text-xs;
    opacity: 0.8;
  }

  &--dark &__input {
    background: rgba($surface, 0.08);
    border-color: rgba($surface, 0.2);
    color: $surface;

    &::placeholder {
      color: rgba($surface, 0.5);
    }
  }

  &--dark &__error {
    color: $sage;
  }
}
</style>
