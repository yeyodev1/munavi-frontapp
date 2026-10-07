<script setup lang="ts">
import { site, whatsappLink } from '@/config/site'
import { aboutCopy as copy } from '@/config/copy/about'
import { useSettingsStore } from '@/stores/settings'
import SomosBlock from '@/components/home/SomosBlock.vue'

const settings = useSettingsStore()
</script>

<template>
  <div class="about-page">
    <SomosBlock as="h1" :cta="false" />
    <div class="about">
      <p class="about__lead">{{ copy.lead }}</p>

      <section class="about__story">
        <div class="about__story-copy">
          <h2 class="about__h2">{{ copy.story.title }}</h2>
          <p v-for="p in copy.story.paragraphs" :key="p">{{ p }}</p>
        </div>
        <ul class="about__stats">
          <li v-for="stat in copy.stats" :key="stat.label">
            <strong>{{ stat.value }}</strong>
            <span>{{ stat.label }}</span>
          </li>
        </ul>
      </section>

      <section class="about__pillars">
        <h2 class="about__h2">{{ copy.pillarsTitle }}</h2>
        <div class="about__pillar-list">
          <article v-for="pillar in site.brand.pillars" :key="pillar.title" class="about__pillar">
            <span class="about__icon"><i :class="pillar.icon" aria-hidden="true"></i></span>
            <h3>{{ pillar.title }}</h3>
            <p>{{ pillar.text }}</p>
          </article>
        </div>
      </section>

      <section class="about__cta">
        <h2 class="about__h2">{{ copy.cta.title }}</h2>
        <p>{{ copy.cta.text }}</p>
        <div class="about__actions">
          <RouterLink to="/tienda" class="btn btn--primary">{{ copy.cta.shop }}</RouterLink>
          <a
            :href="whatsappLink(undefined, settings.whatsapp)"
            target="_blank"
            rel="noopener"
            class="btn btn--ghost"
          >
            <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ copy.cta.whatsapp }}
          </a>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
.about {
  @include container;
  padding-block: $space-xl $space-section;
  @include flex(column, stretch, flex-start, $space-section);

  &__lead {
    font-size: $text-xl;
    font-weight: 300;
    line-height: 1.55;
    color: $ink-soft;
    max-width: 56ch;
    margin-inline: auto;
    text-align: center;
  }

  &__h2 {
    @include display($display-sm);
    margin-bottom: 1rem;
  }

  &__story {
    @include flex(column, stretch, flex-start, $space-lg);

    @include from('md') {
      flex-direction: row;
      align-items: center;
    }
  }

  &__story-copy {
    flex: 1 1 55%;

    p {
      color: $ink-soft;
      margin-bottom: 0.9rem;
    }
  }

  &__stats {
    flex: 1 1 45%;
    list-style: none;
    @include flex-cards(140px, 0.75rem);

    li {
      @include flex(column, flex-start, flex-start, 0.2rem);
      padding: 1.3rem;
      border-radius: $radius-md;
      background: $surface;
      border: 1px solid $line;
    }

    strong {
      @include display($display-md, 700);
      color: $accent;
    }

    span {
      font-size: $text-sm;
      color: $ink-soft;
    }
  }

  &__pillar-list {
    @include flex-cards(240px, 1rem);
  }

  &__pillar {
    @include card;
    padding: 1.6rem;

    h3 {
      font-size: $text-lg;
      margin-block: 0.8rem 0.4rem;
    }

    p {
      font-size: $text-sm;
      color: $ink-soft;
    }
  }

  &__icon {
    @include flex(row, center, center);
    width: 2.8rem;
    height: 2.8rem;
    border-radius: 50%;
    background: rgba($accent, 0.09);
    color: $accent;
  }

  &__cta {
    @include flex(column, center, center, 0.5rem);
    text-align: center;
    padding: $space-xl 1.25rem;
    border-radius: $radius-lg;
    background: $sand;

    p {
      color: $ink-soft;
    }
  }

  &__actions {
    @include flex(row, center, center, 0.7rem);
    flex-wrap: wrap;
    margin-top: 0.8rem;
  }
}
</style>
