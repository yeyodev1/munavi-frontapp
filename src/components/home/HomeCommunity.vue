<script setup lang="ts">
import { computed } from 'vue'
import SectionHead from './SectionHead.vue'
import SubscribeForm from '@/components/SubscribeForm.vue'
import { useSettingsStore } from '@/stores/settings'
import { homeCopy } from '@/config/copy/home'

const copy = homeCopy.community
const subscribe = homeCopy.subscribe
const settings = useSettingsStore()
settings.load()

const photos = computed(() =>
  settings.communityPhotos
    .filter((photo) => photo.image?.url)
    .map((photo) => ({
      url: photo.image!.url,
      link: photo.link || settings.social.instagram,
    })),
)

const networks = computed(() =>
  copy.social
    .map((net) => ({ ...net, href: settings.social[net.key] }))
    .filter((net) => net.href),
)
</script>

<template>
  <section id="suscribete" class="community">
    <SectionHead :eyebrow="copy.eyebrow" :title="copy.title" :text="photos.length ? copy.text : ''" />

    <ul v-if="photos.length" class="community__gallery">
      <li v-for="(photo, index) in photos" :key="photo.url + index">
        <component
          :is="photo.link ? 'a' : 'div'"
          :href="photo.link || undefined"
          :target="photo.link ? '_blank' : undefined"
          :rel="photo.link ? 'noopener' : undefined"
          class="community__photo"
        >
          <img :src="photo.url" :alt="copy.photoAlt" loading="lazy" />
        </component>
      </li>
    </ul>

    <div v-if="networks.length" class="community__follow">
      <p v-if="!photos.length" class="community__follow-text">{{ copy.follow }}</p>
      <div class="community__networks">
        <a
          v-for="net in networks"
          :key="net.key"
          :href="net.href"
          target="_blank"
          rel="noopener"
          class="btn community__net"
        >
          <i :class="net.icon" aria-hidden="true"></i> {{ net.label }}
        </a>
      </div>
    </div>

    <div class="community__sub">
      <span class="community__badge" aria-hidden="true">20%</span>
      <div class="community__sub-copy">
        <p class="community__sub-eyebrow">{{ subscribe.eyebrow }}</p>
        <h3 class="community__sub-title">{{ subscribe.title }}</h3>
        <p class="community__sub-text">{{ subscribe.text }}</p>
      </div>
      <SubscribeForm source="home" tone="dark" class="community__form" />
    </div>
  </section>
</template>

<style scoped lang="scss">
.community {
  @include container;
  padding-top: $space-section;
  scroll-margin-top: 5rem;

  &__gallery {
    list-style: none;
    @include flex-cards(calc(50% - 0.5rem), 0.75rem);

    @include from('md') {
      @include flex-cards(calc(33.333% - 0.75rem), 1rem);
    }

    @include from('lg') {
      @include flex-cards(calc(16.666% - 1rem), 1rem);
    }

    > li {
      flex-grow: 0;
    }
  }

  &__photo {
    display: block;
    aspect-ratio: 1;
    border-radius: $radius-md;
    overflow: hidden;
    background: $sand;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      @include transition(transform);
    }

    &:hover img {
      transform: scale(1.05);
    }
  }

  &__follow {
    @include flex(column, flex-start, flex-start, 0.9rem);
    margin-top: $space-md;
  }

  &__follow-text {
    color: $ink-soft;
    max-width: 52ch;
  }

  &__networks {
    @include flex(row, center, flex-start, 0.6rem);
    flex-wrap: wrap;
  }

  &__net {
    background: $sage-soft;
    color: $accent-deep;
    border: 1px solid $sage;

    &:hover {
      background: $sage;
    }
  }

  &__sub {
    position: relative;
    overflow: hidden;
    @include flex(column, flex-start, flex-start, 1.4rem);
    margin-top: $space-lg;
    padding: $space-lg 1.5rem;
    border-radius: $radius-lg;
    color: $surface;
    background:
      radial-gradient(circle at 100% 0%, rgba($olive, 0.55), transparent 50%),
      linear-gradient(135deg, $accent-deep, $accent);

    @include from('md') {
      flex-direction: row;
      align-items: center;
      padding: $space-xl;
      gap: $space-lg;
    }
  }

  &__badge {
    position: absolute;
    right: -0.5rem;
    top: -1.5rem;
    font-family: $font-display;
    font-size: clamp(6rem, 4rem + 10vw, 12rem);
    line-height: 1;
    color: rgba($surface, 0.08);
    pointer-events: none;
  }

  &__sub-copy {
    position: relative;
    @include flex(column, flex-start, flex-start, 0.6rem);

    @include from('md') {
      flex: 1 1 55%;
    }
  }

  &__sub-eyebrow {
    @include eyebrow;
    color: $sage;
  }

  &__sub-title {
    @include display($display-sm);
  }

  &__sub-text {
    color: rgba($surface, 0.85);
    max-width: 46ch;
  }

  &__form {
    position: relative;
    width: 100%;

    @include from('md') {
      flex: 1 1 45%;
    }
  }
}
</style>
