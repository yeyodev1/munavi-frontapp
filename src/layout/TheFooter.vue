<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SubscribeForm from '@/components/SubscribeForm.vue'
import MunaviLogo from '@/components/brand/MunaviLogo.vue'
import { site, whatsappLink } from '@/config/site'
import { layoutCopy } from '@/config/copy/layout'
import { useCategories } from '@/composables/useCatalog'
import { useSettingsStore } from '@/stores/settings'

const copy = layoutCopy.footer
const route = useRoute()
const settings = useSettingsStore()
const { categories } = useCategories()
const year = new Date().getFullYear()

// El home ya tiene su propio bloque de suscripción.
const showSubscribe = computed(() => route.name !== 'Home')

const socials = computed(() =>
  [
    { key: 'instagram', icon: 'fa-brands fa-instagram', url: settings.social.instagram },
    { key: 'facebook', icon: 'fa-brands fa-facebook-f', url: settings.social.facebook },
    { key: 'tiktok', icon: 'fa-brands fa-tiktok', url: settings.social.tiktok },
  ].filter((s) => s.url),
)
const payments = Object.values(site.paymentMethods)
</script>

<template>
  <footer class="footer">
    <div v-if="showSubscribe" class="footer__sub">
      <div class="footer__sub-copy">
        <h2 class="footer__sub-title">{{ copy.subscribeTitle }}</h2>
        <p>{{ copy.subscribeText }}</p>
      </div>
      <SubscribeForm source="footer" tone="dark" class="footer__sub-form" />
    </div>

    <div class="footer__inner">
      <div class="footer__brand">
        <RouterLink to="/" class="footer__logo" :aria-label="site.name"><MunaviLogo /></RouterLink>
        <p class="footer__tagline">{{ site.brand.promise }}</p>
        <p class="footer__origin"><i class="fa-solid fa-location-dot" aria-hidden="true"></i> {{ site.brand.origin }}</p>
        <div v-if="socials.length" class="footer__socials" :aria-label="copy.follow">
          <a v-for="s in socials" :key="s.key" :href="s.url" target="_blank" rel="noopener" :aria-label="s.key">
            <i :class="s.icon" aria-hidden="true"></i>
          </a>
        </div>
      </div>

      <div v-if="categories.length" class="footer__col">
        <h3 class="footer__heading">{{ copy.categories }}</h3>
        <RouterLink v-for="cat in categories" :key="cat._id" :to="`/tienda/${cat.slug}`">{{ cat.name }}</RouterLink>
      </div>

      <div class="footer__col">
        <h3 class="footer__heading">{{ copy.help }}</h3>
        <RouterLink v-for="link in copy.links" :key="link.to" :to="link.to">
          <i :class="link.icon" aria-hidden="true"></i> {{ link.label }}
        </RouterLink>
        <a :href="whatsappLink(undefined, settings.whatsapp)" target="_blank" rel="noopener">
          <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ copy.whatsapp }}
        </a>
        <a :href="`mailto:${site.email}`"><i class="fa-solid fa-envelope" aria-hidden="true"></i> {{ site.email }}</a>
      </div>

      <div class="footer__col">
        <h3 class="footer__heading">{{ copy.payments }}</h3>
        <p v-for="method in payments" :key="method.label" class="footer__pay">
          <i :class="method.icon" aria-hidden="true"></i> {{ method.label }}
        </p>
        <p class="footer__note"><i class="fa-solid fa-lock" aria-hidden="true"></i> {{ copy.paymentsNote }}</p>
      </div>
    </div>

    <div class="footer__bar">
      <span>© {{ year }} {{ site.name }} · {{ site.tagline }}</span>
      <span class="footer__bar-links">
        <RouterLink to="/admin/login" class="footer__admin">{{ copy.admin }}</RouterLink>
        <span>{{ copy.credit }} <a href="https://bakano.ec" target="_blank" rel="noopener">Bakano</a></span>
      </span>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  background: $ink-brand;
  color: rgba($paper, 0.8);
  margin-top: auto;

  // Franja de los secundarios del manual de marca.
  &::before {
    content: '';
    display: block;
    height: 4px;
    @include brand-stripe;
  }

  &__sub {
    @include container;
    @include flex(column, flex-start, flex-start, 1.2rem);
    padding-block: $space-lg;
    border-bottom: 1px solid rgba($paper, 0.1);

    @include from('md') {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: $space-lg;
    }

    p {
      font-size: $text-sm;
      color: rgba($paper, 0.65);
    }
  }

  &__sub-title {
    @include display($text-xl, 700);
    color: $paper;
    margin-bottom: 0.35rem;
  }

  &__sub-form {
    @include from('md') {
      flex: 0 1 460px;
    }
  }

  &__inner {
    @include container;
    @include flex-cards(200px, 2.5rem);
    padding-block: $space-xl 2.5rem;
  }

  &__brand {
    flex: 2 1 260px;
    @include flex(column, flex-start, flex-start, 0.7rem);
  }

  &__logo {
    display: inline-flex;
    font-size: 2.3rem;
    color: $surface;
    line-height: 1;
  }

  &__tagline {
    font-size: $text-sm;
    color: rgba($paper, 0.65);
    max-width: 34ch;
  }

  &__origin {
    font-size: $text-xs;
    color: $sage;
  }

  &__socials {
    @include flex(row, center, flex-start, 0.5rem);

    a {
      @include flex(row, center, center);
      width: 2.4rem;
      height: 2.4rem;
      border-radius: 50%;
      border: 1px solid rgba($paper, 0.2);
      @include transition;

      &:hover {
        background: $accent;
        border-color: $accent;
      }
    }
  }

  &__col {
    @include flex(column, flex-start, flex-start, 0.6rem);
    font-size: $text-sm;

    a {
      color: rgba($paper, 0.75);
      @include transition(color);

      &:hover {
        color: $sage;
      }
    }

    i {
      width: 1.1rem;
      opacity: 0.7;
    }
  }

  &__heading {
    @include eyebrow;
    color: $sage;
    margin-bottom: 0.3rem;
  }

  &__pay {
    color: rgba($paper, 0.75);
  }

  &__note {
    font-size: $text-xs;
    color: rgba($paper, 0.5);
  }

  &__bar {
    @include container;
    @include flex(row, center, space-between, 0.8rem);
    flex-wrap: wrap;
    padding-block: 1.2rem 5.5rem;
    border-top: 1px solid rgba($paper, 0.1);
    font-size: $text-xs;
    color: rgba($paper, 0.5);

    @include from('md') {
      padding-bottom: 1.2rem;
    }

    a {
      color: rgba($paper, 0.75);
    }
  }

  &__bar-links {
    @include flex(row, center, flex-end, 1.2rem);
  }

  &__admin {
    opacity: 0.6;

    &:hover {
      opacity: 1;
    }
  }
}
</style>
