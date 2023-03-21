<script setup lang="ts">
import HeadingLevel1 from '../parts/heading/HeadingLevel1.vue'
import CoordinateView from '../views/CoordinateView.vue'
</script>

<template>
  <div class="home">
    <header class="home__header">
      <HeadingLevel1
        class="home__header__heading"
        tag="h1"
        text="World weather"
      />

      <p class="home__lead">
        Please click or tap on the region on the map to select the area for
        which you would like to know the weather.
      </p>
    </header>

    <main class="home__main">
      <CoordinateView />
    </main>
  </div>
</template>

<style lang="scss" scoped>
.home {
  &__header {
    padding: 4rem 1.6rem;
    max-width: 900px;
    margin: 0 auto;

    &__heading {
      margin-bottom: 1rem;
    }
  }

  &__main {
    max-width: 900px;
    margin: 0 auto;
    padding-bottom: 4rem;
  }

  &__lead {
    font-size: 1.6rem;
  }
}

@media screen and (max-width: 750px) {
  .home {
    &__header {
      padding: 4rem 1.6rem 0;

      &__heading {
        margin-bottom: 0.8rem;
      }
    }

    // &__main {
    // }

    &__lead {
      font-size: 1.4rem;
      line-height: 1.5;
    }
  }
}
</style>
