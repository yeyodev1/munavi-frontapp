<template>
  <div class="skeleton" aria-hidden="true">
    <div class="skeleton__media"></div>
    <div class="skeleton__body">
      <span class="skeleton__line skeleton__line--xs"></span>
      <span class="skeleton__line"></span>
      <span class="skeleton__line skeleton__line--md"></span>
      <span class="skeleton__line skeleton__line--price"></span>
      <span class="skeleton__btn"></span>
    </div>
  </div>
</template>

<style scoped lang="scss">
%shine {
  background: linear-gradient(90deg, #f3edf6 25%, #faf6fb 50%, #f3edf6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.6s linear infinite;
}

.skeleton {
  background: $surface;
  border-radius: $radius-md;
  border: 1px solid rgba($line, 0.7);
  overflow: hidden;

  &__media {
    @extend %shine;
    aspect-ratio: 1;
  }

  &__body {
    @include flex(column, stretch, flex-start, 0.6rem);
    padding: 1rem;
  }

  &__line {
    @extend %shine;
    display: block;
    height: 0.8rem;
    border-radius: $radius-pill;
    width: 85%;

    &--xs {
      width: 35%;
      height: 0.6rem;
    }

    &--md {
      width: 55%;
    }

    &--price {
      width: 45%;
      height: 1.3rem;
    }
  }

  &__btn {
    @extend %shine;
    display: block;
    height: 2.4rem;
    border-radius: $radius-pill;
    margin-top: 0.4rem;
  }
}
</style>
