<script setup lang="ts">
// Pie en cuatro columnas según la referencia "opción 2" de Munavi (11 nov 2026):
// marca y redes, categorías, ayuda y pagos seguros con los logos oficiales.
import { computed } from 'vue'
import MunaviLogo from '@/components/brand/MunaviLogo.vue'
import FooterPayments from '@/components/layout/FooterPayments.vue'
import { site, whatsappLink } from '@/config/site'
import { layoutCopy } from '@/config/copy/layout'
import { useCategories } from '@/composables/useCatalog'
import { useSettingsStore } from '@/stores/settings'

const copy = layoutCopy.footer
const settings = useSettingsStore()
const { categories } = useCategories()
const year = new Date().getFullYear()

const socials = computed(() =>
  [
    { key: 'Instagram', icon: 'fa-brands fa-instagram', url: settings.social.instagram },
    { key: 'Facebook', icon: 'fa-brands fa-facebook-f', url: settings.social.facebook },
    { key: 'TikTok', icon: 'fa-brands fa-tiktok', url: settings.social.tiktok },
  ].filter((s) => s.url),
)
</script>

<template>
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__col footer__brand">
        <RouterLink to="/" class="footer__logo" :aria-label="site.name"><MunaviLogo /></RouterLink>
        <p class="footer__tagline">{{ site.brand.promise }}</p>
        <p class="footer__origin">
          <i class="fa-solid fa-location-dot" aria-hidden="true"></i> {{ site.brand.origin }}.
        </p>
        <template v-if="socials.length">
          <hr class="footer__rule" />
          <p class="footer__follow">{{ copy.follow }}</p>
          <div class="footer__socials">
            <a
              v-for="s in socials"
              :key="s.key"
              :href="s.url"
              target="_blank"
              rel="noopener"
              :aria-label="s.key"
            >
              <i :class="s.icon" aria-hidden="true"></i>
            </a>
          </div>
        </template>
      </div>

      <nav v-if="categories.length" class="footer__col" :aria-label="copy.categories">
        <h3 class="footer__heading">{{ copy.categories }}</h3>
        <RouterLink v-for="cat in categories" :key="cat._id" :to="`/tienda/${cat.slug}`">{{
          cat.name
        }}</RouterLink>
      </nav>

      <div class="footer__col">
        <h3 class="footer__heading">{{ copy.help }}</h3>
        <RouterLink
          v-for="link in copy.links"
          :key="link.to"
          :to="link.to"
          class="footer__icon-link"
        >
          <i :class="link.icon" aria-hidden="true"></i> {{ link.label }}
        </RouterLink>
        <a
          :href="whatsappLink(undefined, settings.whatsapp)"
          target="_blank"
          rel="noopener"
          class="footer__icon-link"
        >
          <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ copy.whatsapp }}
        </a>
        <a :href="`mailto:${site.email}`" class="footer__icon-link">
          <i class="fa-solid fa-envelope" aria-hidden="true"></i> {{ site.email }}
        </a>
      </div>

      <div class="footer__col footer__pay">
        <h3 class="footer__heading">{{ copy.payments }}</h3>
        <FooterPayments />
      </div>
    </div>

    <div class="footer__bar">
      <span>© {{ year }} {{ site.name }} – {{ site.tagline }}.</span>
      <span class="footer__bar-links">
        <RouterLink to="/admin/login" class="footer__admin">{{ copy.admin }}</RouterLink>
        <span
          >{{ copy.credit }}
          <a href="https://bakano.ec" target="_blank" rel="noopener">Bakano</a></span
        >
      </span>
    </div>
  </footer>
</template>

<style scoped lang="scss">
// Verde lima de los títulos e íconos de la referencia, sobre el verde profundo de la marca.
$lime: #b5e06a;

.footer {
  background: $ink-brand;
  color: rgba($paper, 0.85);
  margin-top: auto;

  // Franja de los secundarios del manual de marca.
  &::before {
    content: '';
    display: block;
    height: 4px;
    @include brand-stripe;
  }

  &__inner {
    @include container;
    @include flex(column, stretch, flex-start, 2.2rem);
    padding-block: $space-xl $space-lg;

    @include from('md') {
      flex-direction: row;
      flex-wrap: wrap;
    }

    @include from('lg') {
      flex-wrap: nowrap;
      gap: 0;
    }
  }

  &__col {
    @include flex(column, flex-start, flex-start, 0.55rem);

    @include from('md') {
      flex: 1 1 40%;
    }

    @include from('lg') {
      flex: 1 1 0;
      padding-inline: 2rem;

      & + & {
        border-left: 1px solid rgba($paper, 0.18);
      }

      &:first-child {
        padding-left: 0;
      }

      &:last-child {
        padding-right: 0;
      }
    }

    > a {
      color: rgba($paper, 0.85);
      @include transition(color);

      &:hover {
        color: $lime;
      }
    }
  }

  &__brand,
  &__pay {
    @include from('lg') {
      flex: 1.35 1 0;
    }
  }

  &__logo {
    font-size: 2.6rem;
    color: $surface;
    margin-bottom: 0.4rem;
  }

  &__tagline {
    font-size: $text-base;
    color: $surface;
    max-width: 26ch;
  }

  &__origin {
    @include flex(row, flex-start, flex-start, 0.5rem);
    font-weight: 700;
    color: $surface;
    max-width: 30ch;

    i {
      margin-top: 0.25rem;
      color: $lime;
    }
  }

  &__rule {
    width: 100%;
    border: 0;
    border-top: 1px solid rgba($paper, 0.25);
    margin-block: 0.6rem;
  }

  &__follow {
    font-size: $text-sm;
  }

  &__socials {
    @include flex(row, center, flex-start, 0.8rem);

    a {
      @include flex(row, center, center);
      width: 2.6rem;
      height: 2.6rem;
      border-radius: 50%;
      background: $surface;
      color: $ink-brand;
      font-size: 1.2rem;
      @include transition(transform);

      &:hover {
        transform: translateY(-2px);
      }
    }
  }

  &__heading {
    @include eyebrow;
    color: $lime;
    margin-bottom: 0.4rem;
  }

  &__icon-link {
    @include flex(row, center, flex-start, 0.6rem);

    i {
      width: 1.2rem;
      color: $lime;
      text-align: center;
    }
  }

  &__bar {
    @include container;
    @include flex(row, center, space-between, 0.8rem);
    flex-wrap: wrap;
    padding-block: 1.2rem 5.5rem;
    border-top: 1px solid rgba($paper, 0.18);
    font-size: $text-sm;
    color: rgba($paper, 0.75);

    @include from('md') {
      padding-bottom: 1.2rem;
    }

    a {
      color: rgba($paper, 0.75);
    }
  }

  &__bar-links {
    @include flex(row, center, flex-end, 1.2rem);
    font-size: $text-xs;
  }

  &__admin {
    opacity: 0.6;

    &:hover {
      opacity: 1;
    }
  }
}
</style>
