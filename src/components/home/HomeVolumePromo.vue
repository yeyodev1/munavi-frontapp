<script setup lang="ts">
import { computed } from 'vue'
import LeafDecor from '@/components/decor/LeafDecor.vue'
import { useSettingsStore } from '@/stores/settings'
import { homeCopy } from '@/config/copy/home'

const copy = homeCopy.volumePromo
const settings = useSettingsStore()
settings.load()

// Niveles ordenados por cantidad; el último se lee como "N o más".
const tiers = computed(() => {
  const sorted = [...settings.volumePromo.tiers]
    .filter((tier) => tier.minQty > 1 && tier.percent > 0)
    .sort((a, b) => a.minQty - b.minQty)
  return sorted.map((tier, index) => ({
    key: tier.minQty,
    qty: index === sorted.length - 1 ? copy.lastQty(tier.minQty) : copy.qty(tier.minQty),
    label: copy.save(tier.percent),
    icon: copy.tierIcons[Math.min(index, copy.tierIcons.length - 1)],
  }))
})

const visible = computed(() => settings.volumePromo.isActive && tiers.value.length > 0)
</script>

<template>
  <section v-if="visible" class="vpromo">
    <div class="vpromo__band">
      <LeafDecor variant="palm" class="vpromo__leaf vpromo__leaf--a" />
      <LeafDecor variant="frond" tone="fresh" class="vpromo__leaf vpromo__leaf--b" />

      <div class="vpromo__copy">
        <span class="vpromo__icon"><i :class="copy.icon" aria-hidden="true"></i></span>
        <div class="vpromo__text">
          <h2 class="vpromo__title">
            {{ copy.title }} <strong>{{ copy.highlight }}</strong>
          </h2>
          <p class="vpromo__lead">{{ copy.text }}</p>
          <RouterLink :to="copy.to" class="btn btn--primary vpromo__cta">{{ copy.cta }}</RouterLink>
        </div>
      </div>

      <ul class="vpromo__tiers">
        <li class="tier">
          <i :class="copy.base.icon" class="tier__icon" aria-hidden="true"></i>
          <span class="tier__qty">{{ copy.base.qty }}</span>
          <span class="tier__label tier__label--muted">{{ copy.base.label }}</span>
        </li>
        <li v-for="tier in tiers" :key="tier.key" class="tier">
          <i :class="tier.icon" class="tier__icon" aria-hidden="true"></i>
          <span class="tier__qty">{{ tier.qty }}</span>
          <span class="tier__label">{{ tier.label }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped lang="scss">
.vpromo {
  @include container;
  padding-top: $space-section;

  &__band {
    position: relative;
    overflow: hidden;
    @include flex(column, stretch, flex-start, $space-md);
    padding: $space-lg 1.25rem;
    border-radius: $radius-lg;
    background: linear-gradient(120deg, $sage-soft, rgba($sage, 0.35));

    @include from('lg') {
      flex-direction: row;
      align-items: center;
      gap: $space-lg;
      padding: $space-lg $space-xl;
    }
  }

  &__leaf {
    position: absolute;
    z-index: 0;
    opacity: 0.35;
    pointer-events: none;

    &--a {
      width: clamp(90px, 14vw, 180px);
      top: -40px;
      left: -30px;
      transform: rotate(25deg);
    }

    &--b {
      width: clamp(80px, 12vw, 160px);
      bottom: -50px;
      right: -20px;
      transform: rotate(-30deg);
    }
  }

  &__copy {
    position: relative;
    z-index: 1;
    @include flex(row, flex-start, flex-start, 1rem);

    @include from('lg') {
      flex: 1 1 40%;
    }
  }

  &__icon {
    @include flex(row, center, center);
    flex: 0 0 3.2rem;
    height: 3.2rem;
    border-radius: 50%;
    background: $surface;
    color: $accent;
    font-size: 1.3rem;
    box-shadow: $shadow-sm;
  }

  &__text {
    @include flex(column, flex-start, flex-start, 0.6rem);
  }

  &__title {
    @include display($display-sm);
    color: $ink;

    strong {
      color: $accent;
    }
  }

  &__lead {
    color: $ink-soft;
    max-width: 40ch;
  }

  &__cta {
    margin-top: 0.4rem;
  }

  &__tiers {
    position: relative;
    z-index: 1;
    list-style: none;
    @include flex(row, stretch, flex-start, 0.75rem);
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding-inline: 1.25rem;
    padding-bottom: 0.4rem;
    margin-inline: -1.25rem;
    padding-inline: 1.25rem;

    @include from('md') {
      overflow: visible;
      margin-inline: 0;
      padding-inline: 0;
    }

    @include from('lg') {
      flex: 1 1 60%;
      justify-content: flex-end;
    }
  }
}

.tier {
  flex: 0 0 9.5rem;
  scroll-snap-align: start;
  @include flex(column, center, center, 0.35rem);
  padding: 1.2rem 0.9rem;
  border-radius: $radius-md;
  background: $surface;
  box-shadow: $shadow-sm;
  text-align: center;

  @include from('md') {
    flex: 1 1 0;
    max-width: 12rem;
  }

  &__icon {
    font-size: 1.4rem;
    color: $accent;
    margin-bottom: 0.2rem;
  }

  &__qty {
    font-weight: 700;
    color: $ink;
  }

  &__label {
    font-size: $text-sm;
    font-weight: 700;
    color: $accent;

    &--muted {
      font-weight: 500;
      color: $ink-muted;
    }
  }
}

// Fondo verde con hojas que entregó la diseñadora para esta franja (1920×800).
.vpromo__band {
  @include from('md') {
    background-image: url('/brand/fondo-verde.webp');
    background-size: cover;
    background-position: center;
  }
}
</style>
