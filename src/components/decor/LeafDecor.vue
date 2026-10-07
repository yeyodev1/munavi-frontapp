<script setup lang="ts">
// Hojas tropicales dibujadas a mano en SVG (sin imágenes remotas). Decorativas:
// el tamaño y la posición los decide quien las usa, con CSS sobre la raíz.
import { computed, useId } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'monstera' | 'frond'
    tone?: 'deep' | 'fresh'
  }>(),
  { variant: 'monstera', tone: 'deep' },
)

const uid = useId()
const gradId = `leaf-g-${uid}`
const maskId = `leaf-m-${uid}`

// Hendiduras de la monstera: entran desde el borde hacia la nervadura.
const slits = [
  'M -6 58 Q 40 66 80 80',
  'M -10 104 Q 40 104 78 112',
  'M -4 150 Q 44 146 80 140',
  'M 18 200 Q 56 184 84 164',
  'M 206 58 Q 160 66 120 80',
  'M 210 104 Q 160 104 122 112',
  'M 204 150 Q 156 146 120 140',
  'M 182 200 Q 144 184 116 164',
]

// Palma: folíolos a ambos lados de un tallo curvo, más largos al centro.
const frond = computed(() => {
  if (props.variant !== 'frond') return []
  const out: string[] = []
  const n = 13
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1)
    const y = 26 + t * 168
    const x = 100 + Math.sin(t * Math.PI) * 6
    const len = 22 + Math.sin(Math.PI * (0.12 + 0.82 * t)) * 62
    for (const side of [-1, 1]) {
      const tipX = x + side * len
      const tipY = y - len * 0.42
      const midX = (x + tipX) / 2
      const midY = (y + tipY) / 2
      const w = 7 + len * 0.06
      out.push(
        `M ${x} ${y} Q ${midX} ${midY - w} ${tipX} ${tipY} Q ${midX + side * 2} ${midY + w} ${x} ${y + 3} Z`,
      )
    }
  }
  return out
})
</script>

<template>
  <svg
    class="leaf"
    :class="`leaf--${tone}`"
    viewBox="0 0 200 220"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient :id="gradId" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" class="leaf__stop-a" />
        <stop offset="1" class="leaf__stop-b" />
      </linearGradient>
      <mask v-if="variant === 'monstera'" :id="maskId">
        <rect x="-20" y="-20" width="240" height="260" fill="#fff" />
        <path
          v-for="d in slits"
          :key="d"
          :d="d"
          stroke="#000"
          stroke-width="9"
          stroke-linecap="round"
          fill="none"
        />
        <ellipse cx="86" cy="96" rx="5" ry="9" fill="#000" transform="rotate(-20 86 96)" />
        <ellipse cx="114" cy="126" rx="5" ry="9" fill="#000" transform="rotate(20 114 126)" />
      </mask>
    </defs>

    <g v-if="variant === 'monstera'">
      <path
        :fill="`url(#${gradId})`"
        :mask="`url(#${maskId})`"
        d="M100 42 C 85 18, 40 14, 18 50 C 0 85, 8 150, 50 185 C 70 202, 90 212, 100 216 C 110 212, 130 202, 150 185 C 192 150, 200 85, 182 50 C 160 14, 115 18, 100 42 Z"
      />
      <path class="leaf__rib" d="M100 44 Q 102 120 100 210" />
      <path class="leaf__rib leaf__rib--stem" d="M100 44 Q 96 20 84 -10" />
    </g>

    <g v-else>
      <path v-for="d in frond" :key="d" :d="d" :fill="`url(#${gradId})`" />
      <path class="leaf__rib leaf__rib--frond" d="M100 214 Q 108 110 100 18" />
    </g>
  </svg>
</template>

<style scoped lang="scss">
.leaf {
  display: block;
  overflow: visible;
  pointer-events: none;

  &--deep {
    .leaf__stop-a {
      stop-color: $accent;
    }
    .leaf__stop-b {
      stop-color: $ink-brand;
    }
  }

  &--fresh {
    .leaf__stop-a {
      stop-color: $sage;
    }
    .leaf__stop-b {
      stop-color: $accent;
    }
  }

  &__rib {
    fill: none;
    stroke: rgba($sage, 0.55);
    stroke-width: 2.5;
    stroke-linecap: round;

    &--stem {
      stroke: $accent-deep;
      stroke-width: 4;
    }

    &--frond {
      stroke: $accent-deep;
      stroke-width: 3;
    }
  }
}
</style>
