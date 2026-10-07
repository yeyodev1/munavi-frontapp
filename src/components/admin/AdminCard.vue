<script setup lang="ts">
defineProps<{ title?: string; description?: string; icon?: string }>()
</script>

<template>
  <section class="acard">
    <header v-if="title || $slots.actions" class="acard__head">
      <div class="acard__titles">
        <h2 v-if="title" class="acard__title"><i v-if="icon" :class="icon"></i> {{ title }}</h2>
        <p v-if="description" class="acard__description">{{ description }}</p>
      </div>
      <div v-if="$slots.actions" class="acard__actions"><slot name="actions" /></div>
    </header>
    <div class="acard__body"><slot /></div>
  </section>
</template>

<style scoped lang="scss">
.acard {
  @include card;
  padding: 1.1rem;

  @include from('md') {
    padding: 1.5rem;
  }

  &__head {
    @include flex(row, flex-start, space-between, 0.75rem);
    flex-wrap: wrap;
    margin-bottom: 1.1rem;
  }

  &__titles {
    flex: 1 1 220px;
  }

  &__title {
    font-family: $font-principal;
    font-size: 1.02rem;
    font-weight: 700;
    color: $ink;

    i {
      color: $accent;
      margin-right: 0.3rem;
    }
  }

  &__description {
    margin-top: 0.25rem;
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__actions {
    @include flex(row, center, flex-end, 0.5rem);
    flex-wrap: wrap;
  }

  &__body {
    @include flex(column, stretch, flex-start, 1rem);
  }
}
</style>
