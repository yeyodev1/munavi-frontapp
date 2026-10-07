import { onMounted, onUnmounted, ref, watch, type Ref } from 'vue'

/** Índice que avanza solo y se pausa al interactuar o con la pestaña oculta. */
export function useCarousel(length: Ref<number>, interval = 6000) {
  const index = ref(0)
  let timer: ReturnType<typeof setInterval> | undefined
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const go = (next: number) => {
    const n = length.value
    if (!n) return
    index.value = ((next % n) + n) % n
  }
  const next = () => go(index.value + 1)
  const prev = () => go(index.value - 1)

  function stop() {
    clearInterval(timer)
    timer = undefined
  }

  function start() {
    stop()
    if (reduced || length.value < 2) return
    timer = setInterval(() => {
      if (!document.hidden) next()
    }, interval)
  }

  watch(length, () => {
    if (index.value >= length.value) index.value = 0
    start()
  })
  onMounted(start)
  onUnmounted(stop)

  return { index, go, next, prev, start, stop }
}
