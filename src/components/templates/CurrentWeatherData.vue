<script setup lang="ts">
import { ref, watch } from 'vue'
import axios from 'axios'

import {
  formatDate1,
  formatWindDirection,
  formatkelvinToCelsius,
  formatDewPoint,
  formatMeters,
} from '../../mixins/formatWeatherData'
import { getWeatherIconPath } from '../../mixins/getWeatherIcon'

import type { CurrentWeatherData } from '../../types/CurrentWeatherData'

const props = defineProps({
  lat: {
    type: Number,
    default: 0,
    required: true,
  },
  lon: {
    type: Number,
    default: 0,
    required: true,
  },
})

const currentWeatherData = ref<CurrentWeatherData>({
  coord: {
    lon: 0,
    lat: 0,
  },
  weather: [
    {
      id: 0,
      main: '',
      description: '',
      icon: '',
    },
  ],
  base: '',
  main: {
    temp: 0,
    feels_like: 0,
    temp_min: 0,
    temp_max: 0,
    pressure: 0,
    humidity: 0,
  },
  visibility: 0,
  wind: {
    speed: 0,
    deg: 0,
  },
  clouds: {
    all: 0,
  },
  dt: 0,
  sys: {
    type: 0,
    id: 0,
    country: '',
    sunrise: 0,
    sunset: 0,
  },
  timezone: 0,
  id: 0,
  name: '',
  cod: 0,
})

const API_URL = import.meta.env.VITE_OW_API_URL
const API_KEY = import.meta.env.VITE_OW_API_KEY

// 天気データの再取得
const getWeatherData = () => {
  axios
    .get(`${API_URL}weather?lat=${props.lat}&lon=${props.lon}&appid=${API_KEY}`)
    .then((response) => {
      currentWeatherData.value = response.data
    })
    .catch((error) => console.log('error', error))
}

watch(
  () => [props.lat, props.lon],
  () => {
    // 天気データを再取得
    getWeatherData()
    // console.log(currentWeatherData.value)
  },
  { immediate: true }
)
</script>

<template>
  <div class="cwd">
    <div class="cwd__section">
      <div class="cwd__header">
        <p class="cwd__header__datetime">
          {{ formatDate1(currentWeatherData.dt, currentWeatherData.timezone) }}
        </p>
        <p class="cwd__header__region">
          {{
            currentWeatherData.name
              ? currentWeatherData.name
              : 'Could not get region name.'
          }}{{
            currentWeatherData.sys.country
              ? `, ${currentWeatherData.sys.country}`
              : ''
          }}
        </p>
      </div>

      <div class="cwd__summary1">
        <p class="cwd__summary1__icon">
          <img
            :src="getWeatherIconPath(currentWeatherData.weather[0].icon, '@4x')"
            alt="Weather Icon"
          />
        </p>

        <p class="cwd__summary1__temp">
          {{ formatkelvinToCelsius(currentWeatherData.main.temp) }}°C
        </p>
      </div>

      <p class="cwd__summary2">
        <span class="cwd__summary2__feels">
          Feels like
          {{ formatkelvinToCelsius(currentWeatherData.main.feels_like) }}°C.
        </span>
        <span class="cwd__summary2__description">{{ currentWeatherData.weather[0].description }}.</span>
        <!-- <p>Gentle Breeze.</p> -->
      </p>
    </div>

    <div class="cwd__details">
      <ul class="cwd__details__list">
        <li class="cwd__details__list__item">
          <span class="bold">Wind:</span> {{ currentWeatherData.wind.speed }}m/s
          {{ formatWindDirection(currentWeatherData.wind.deg) }}
        </li>

        <li class="cwd__details__list__item">
          <span class="bold">Pressure:</span>
          {{ currentWeatherData.main.pressure }}hPa
        </li>

        <li class="cwd__details__list__item">
          <span class="bold">Humidity:</span>
          {{ currentWeatherData.main.humidity }}%
        </li>

        <!-- <li class="cwd__details__list__item"><span class="bold">UV：</span> ？？？？？？</li> -->

        <li class="cwd__details__list__item">
          <span class="bold">Dew point:</span>
          {{
            formatDewPoint(
              formatkelvinToCelsius(currentWeatherData.main.temp),
              currentWeatherData.main.humidity
            )
          }}
        </li>

        <li class="cwd__details__list__item">
          <span class="bold">Visibility:</span>
          {{ formatMeters(currentWeatherData.visibility) }}m
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cwd {
  // &__section {
  // }

  &__header {
    &__datetime {
      font-size: 1.6rem;
      color: #eb6e4c;
      margin-bottom: 1.2rem;
    }

    &__region {
      font-size: 3rem;
      font-weight: bold;
    }
  }

  &__summary1 {
    display: flex;
    align-items: center;
    min-height: 10rem;

    &__icon {
      width: 100px;
      margin-right: 0.6rem;
    }

    &__temp {
      font-size: 2.8rem;
    }
  }

  &__summary2 {
    font-size: 1.6rem;
    font-weight: bold;
  }

  &__details {
    margin-top: 2rem;

    &__list {
      display: flex;
      flex-wrap: wrap;
      max-width: 300px;

      &__item {
        width: 50%;
        font-size: 1.4rem;
        margin-bottom: 1rem;
        padding-right: 1.5rem;

        // & + & {
        // 	margin-top: 1rem;
        // }

        // > .bold {
        // }
      }
    }
  }
}

@media screen and (max-width: 750px) {
  .cwd {
    // &__section {
    // }

    &__header {
      &__datetime {
        font-size: 1.6rem;
        margin-bottom: 0.8rem;
      }

      &__region {
        font-size: 2.4rem;
        font-weight: bold;
      }
    }

    &__summary1 {
      display: flex;
      align-items: center;
      // margin: -1rem 0;

      &__icon {
        width: 7.5rem;
        margin-right: 0.6rem;
      }

      &__temp {
        font-size: 2.8rem;
      }
    }

    &__summary2 {
      font-size: 1.6rem;
      font-weight: bold;
    }

    &__details {
      margin-top: 1.6rem;

      &__list {
        display: flex;
        flex-wrap: wrap;
        max-width: 100%;

        &__item {
          width: 50%;
          font-size: 1.4rem;
          margin-bottom: 1rem;
          padding-right: 1.5rem;

          // & + & {
          // 	margin-top: 1rem;
          // }

          // > .bold {
          // }
        }
      }
    }
  }
}
</style>
