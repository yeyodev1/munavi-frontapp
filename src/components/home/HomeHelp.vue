<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings'
import { whatsappLink } from '@/config/site'
import { homeCopy } from '@/config/copy/home'

const copy = homeCopy.help
const settings = useSettingsStore()
</script>

<template>
  <section class="help">
    <div class="help__card">
      <span class="help__icon"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i></span>
      <div class="help__copy">
        <h2 class="help__title">{{ copy.title }}</h2>
        <p class="help__text">{{ copy.text }}</p>
      </div>
      <a :href="whatsappLink(copy.message, settings.whatsapp)" target="_blank" rel="noopener" class="btn help__btn">
        {{ copy.cta }}
      </a>
    </div>
  </section>
</template>

<style scoped lang="scss">

.help {
  @include container;
  padding-block: $space-section;

  &__card {
    @include flex(column, flex-start, flex-start, 1rem);
    padding: 1.6rem 1.5rem;
    border-radius: $radius-lg;
    border: 1px solid $line;
    background: $surface;

    @include from('md') {
      flex-direction: row;
      align-items: center;
      gap: 1.5rem;
      padding: 2rem 2.5rem;
    }
  }

  &__icon {
    @include flex(row, center, center);
    flex: 0 0 3.4rem;
    width: 3.4rem;
    height: 3.4rem;
    border-radius: 50%;
    background: rgba($whatsapp, 0.14);
    color: #128c4a;
    font-size: 1.6rem;
  }

  &__copy {
    flex: 1;
  }

  &__title {
    @include display($text-xl, 500);
    margin-bottom: 0.3rem;
  }

  &__text {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__btn {
    background: $whatsapp;
    color: #0b3d1f;

    &:hover {
      background: #1fb457;
      transform: translateY(-1px);
    }
  }
}
</style>
