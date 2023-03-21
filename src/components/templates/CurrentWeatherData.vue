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
  <div>
    <div>
      <p>
        {{ formatDate1(currentWeatherData.dt, currentWeatherData.timezone) }}
      </p>
      <p>
        {{ currentWeatherData.name ? currentWeatherData.name : 'unknown' }}
        {{
          currentWeatherData.sys.country
            ? `, ${currentWeatherData.sys.country}`
            : ''
        }}
      </p>
    </div>

    <div>
      <p>
        <img
          :src="getWeatherIconPath(currentWeatherData.weather[0].icon, '@4x')"
          alt="Weather Icon"
        />
      </p>

      <p>{{ formatkelvinToCelsius(currentWeatherData.main.temp) }}°C</p>
    </div>

    <div>
      <p>
        Feels like
        {{ formatkelvinToCelsius(currentWeatherData.main.feels_like) }}°C.
      </p>
      <p>{{ currentWeatherData.weather[0].description }}.</p>
      <!-- <p>Gentle Breeze.（そよ風）</p> -->
    </div>

    <ul>
      <li>
        風速：{{ currentWeatherData.wind.speed }}m/s
        {{ formatWindDirection(currentWeatherData.wind.deg) }}
      </li>

      <li>気圧：{{ currentWeatherData.main.pressure }}hPa</li>

      <li>湿度：{{ currentWeatherData.main.humidity }}%</li>

      <!-- <li>UV：？？？？？？</li> -->

      <li>
        露点：{{
          formatDewPoint(
            formatkelvinToCelsius(currentWeatherData.main.temp),
            currentWeatherData.main.humidity
          )
        }}
      </li>

      <li>視程：{{ formatMeters(currentWeatherData.visibility) }}m</li>
    </ul>
  </div>

  <!-- <p>{{ currentWeatherData }}</p> -->
</template>

<style scoped></style>
