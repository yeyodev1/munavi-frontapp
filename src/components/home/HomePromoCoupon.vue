<script setup lang="ts">
// Banner del cupón del inicio (MUNAVI20). Código, % y condiciones salen del cupón
// que Munavi configura en el panel; si no está vigente, el banner no aparece.
import { computed, ref } from 'vue'
import LeafDecor from '@/components/decor/LeafDecor.vue'
import { useSettingsStore } from '@/stores/settings'
import { useToastStore } from '@/stores/toast'
import { money } from '@/utils/price'
import { homeCopy } from '@/config/copy/home'

const copy = homeCopy.promoCoupon
const settings = useSettingsStore()
const toast = useToastStore()
settings.load()

const coupon = computed(() => settings.promoCoupon)
const copied = ref(false)

const conditions = computed(() => {
  const c = coupon.value
  if (!c) return []
  return [
    c.minSubtotal
      ? { icon: 'fa-solid fa-cart-shopping', text: copy.min(money(c.minSubtotal)) }
      : null,
    c.regularPriceOnly ? { icon: 'fa-solid fa-layer-group', text: copy.regular } : null,
    { icon: 'fa-solid fa-box-open', text: copy.combine },
    c.regularPriceOnly ? { icon: 'fa-solid fa-tag', text: copy.noStack } : null,
  ].filter((x): x is { icon: string; text: string } => !!x)
})

async function copyCode() {
  const code = coupon.value?.code
  if (!code) return
  try {
    await navigator.clipboard.writeText(code)
  } catch {
    // Sin permiso de portapapeles el código igual queda a la vista para copiarlo a mano.
  }
  copied.value = true
  toast.success(copy.copiedToast(code))
  setTimeout(() => (copied.value = false), 2500)
}
</script>

<template>
  <section v-if="coupon" class="promo" :aria-label="copy.title(coupon.percent)">
    <LeafDecor variant="frond" tone="fresh" class="promo__leaf promo__leaf--a" />
    <LeafDecor variant="palm" tone="fresh" class="promo__leaf promo__leaf--b" />

    <div class="promo__main">
      <p class="promo__eyebrow">
        {{ copy.eyebrow }} <strong>{{ copy.brand }}</strong>
      </p>
      <h2 class="promo__title">{{ copy.title(coupon.percent) }}</h2>
      <p class="promo__text">{{ coupon.regularPriceOnly ? copy.text : copy.textAny }}</p>
    </div>

    <div class="promo__code">
      <span class="promo__code-label">{{ copy.codeLabel }}</span>
      <div class="promo__code-row">
        <strong class="promo__ticket">{{ coupon.code }}</strong>
        <button type="button" class="promo__copy" @click="copyCode">
          <i :class="copied ? 'fa-solid fa-check' : 'fa-regular fa-copy'" aria-hidden="true"></i>
          {{ copied ? copy.copied : copy.copy }}
        </button>
      </div>
    </div>

    <ul class="promo__conditions">
      <li v-for="c in conditions" :key="c.text">
        <i :class="c.icon" aria-hidden="true"></i>
        <span>{{ c.text }}</span>
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
$green-deep: #2f6a1f;
$green: #4c8a2c;
$cream: #fbf8ef;

.promo {
  position: relative;
  overflow: hidden;
  @include flex(row, center, space-between, 1.5rem 2rem);
  flex-wrap: wrap;
  margin-top: $space-lg;
  padding: 2rem 1.5rem;
  border-radius: $radius-lg;
  background: linear-gradient(120deg, $green-deep, $green 60%, #6aa13e);
  color: $cream;

  @include from('md') {
    padding: 2.75rem 3rem;
  }

  &__leaf {
    position: absolute;
    pointer-events: none;
    opacity: 0.5;

    &--a {
      width: clamp(90px, 12vw, 170px);
      top: -30px;
      right: -20px;
      transform: rotate(-25deg);
    }

    &--b {
      width: clamp(80px, 10vw, 140px);
      bottom: -40px;
      left: -30px;
      transform: rotate(35deg);
    }
  }

  &__main {
    position: relative;
    flex: 1 1 22rem;
    @include flex(column, flex-start, flex-start, 0.6rem);
  }

  &__eyebrow {
    @include eyebrow;
    color: rgba($cream, 0.85);

    strong {
      color: $surface;
    }
  }

  &__title {
    @include display(clamp(2rem, 1.4rem + 2.6vw, 3.4rem));
    color: $surface;
  }

  &__text {
    font-size: $text-lg;
    max-width: 34ch;
  }

  &__code {
    position: relative;
    flex: 0 1 auto;
    @include flex(column, flex-start, flex-start, 0.5rem);
  }

  &__code-label {
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  &__code-row {
    @include flex(row, center, flex-start, 0.75rem);
    flex-wrap: wrap;
  }

  &__ticket {
    padding: 0.7rem 1.4rem;
    border-radius: $radius-md;
    border: 2px dashed rgba($green-deep, 0.45);
    outline: 4px solid $cream;
    outline-offset: -6px;
    background: $cream;
    color: $green-deep;
    font-size: clamp(1.5rem, 1.2rem + 1.4vw, 2.3rem);
    font-weight: 800;
    letter-spacing: 0.04em;
  }

  &__copy {
    @include flex(row, center, center, 0.5rem);
    padding: 0.8rem 1.3rem;
    border-radius: $radius-pill;
    border: 1px solid rgba($cream, 0.5);
    background: rgba($surface, 0.14);
    color: $surface;
    font-weight: 700;
    @include transition;

    &:hover {
      background: rgba($surface, 0.24);
    }
  }

  &__conditions {
    position: relative;
    flex: 1 1 100%;
    list-style: none;
    @include flex-cards(200px, 0.8rem 1.2rem);
    padding-top: 1.2rem;
    border-top: 1px solid rgba($cream, 0.2);

    li {
      @include flex(row, center, flex-start, 0.7rem);
      font-size: $text-sm;
      line-height: 1.35;
    }

    i {
      flex: 0 0 auto;
      font-size: 1.3rem;
      color: $surface;
    }
  }
}
</style>
