<script setup lang="ts">
import { ref, watch } from 'vue'
import OpenWeatherMap from 'openweathermap-ts'

import { CurrentWeatherData } from '../../types/CurrentWeatherData'

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

const APIKEY = import.meta.env.VITE_OW_API_KEY
const openWeather = new OpenWeatherMap({
  apiKey: APIKEY,
  units: 'standard',
  // language: 'en'
})

const updateWeatherData = () => {
  openWeather
    .getCurrentWeatherByGeoCoordinates(props.lat, props.lon)
    .then((weather) => (currentWeatherData.value = weather))
}

// 天気のアイコンのパスを生成する処理
const createIconPath = (code: string, size = '@4x') => {
  const iconUrl = 'https://openweathermap.org/img/wn/' + code + size + '.png'
  return iconUrl
}

// UNIX時間を「Mar 14, 03:55 pm」のような形式に変換する処理
const formatDate = (unixtime: number, timezone: number): string => {
  // Unix時間をDateオブジェクトに変換する
  const date = new Date(unixtime * 1000)

  // タイムゾーンを適用する
  const adjustedDate = new Date(date.getTime() + timezone * 1000)

  // 月の短い名前を取得する
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  const monthName = monthNames[adjustedDate.getUTCMonth()]

  // 日時をフォーマットする
  const hour = adjustedDate.getUTCHours()
  const ampm = hour < 12 ? 'am' : 'pm'
  const hour12 = hour % 12 || 12
  const minute = adjustedDate.getUTCMinutes()
  const formattedDate = `${monthName} ${adjustedDate.getUTCDate()}, ${hour12}:${minute
    .toString()
    .padStart(2, '0')} ${ampm}`

  return formattedDate
}

// 風向をdegから表記を直す処理
const getWindDirection = (degrees: number): string => {
  const directions = [
    'N',
    'NNE',
    'NE',
    'ENE',
    'E',
    'ESE',
    'SE',
    'SSE',
    'S',
    'SSW',
    'SW',
    'WSW',
    'W',
    'WNW',
    'NW',
    'NNW',
  ]
  const index = Math.floor(((degrees + 11.25) % 360) / 22.5)
  return directions[index]
}

// Kelvin(K) を Celsius(C) に変換する処理
const kelvinToCelsius = (kelvin: number): number => {
  const celsius = kelvin - 273.15
  return Math.floor(celsius)
}

// 露点を計算する処理
const calculateDewPoint = (temperature: number, humidity: number): string => {
  const a = 17.27
  const b = 237.7
  const alpha = (a * temperature) / (b + temperature) + Math.log(humidity / 100)
  const dewPoint = (b * alpha) / (a - alpha)
  return `${Math.round(dewPoint)}°C`
}

// m → kmになおす処理
const mToKm = (m: number): number => {
  const km = m / 1000
  return Math.round(km * 10) / 10
}

// onMounted(() => {
//   updateWeatherData()
// 	console.log('CWD: mounted!')
// })

// onUpdated(() => {
//   updateWeatherData()
// 	console.log('CWD: updated!')
// })

watch(
  () => [props.lat, props.lon],
  () => {
    updateWeatherData()
    console.log(currentWeatherData.value)
  },
  { immediate: true }
)
</script>

<template>
  <div>
    <div>
      <p>
        {{ formatDate(currentWeatherData.dt, currentWeatherData.timezone) }}
      </p>
      <p>{{ currentWeatherData.name }}, {{ currentWeatherData.sys.country }}</p>
    </div>

    <div>
      <p>
        <img
          :src="createIconPath(currentWeatherData.weather[0].icon, '@4x')"
          alt="Weather Icon"
        />
      </p>

      <p>{{ kelvinToCelsius(currentWeatherData.main.temp) }}°C</p>
    </div>

    <div>
      <p>
        Feels like {{ kelvinToCelsius(currentWeatherData.main.feels_like) }}°C.
      </p>
      <p>{{ currentWeatherData.weather[0].description }}.</p>
      <!-- <p>Gentle Breeze.（そよ風）</p> -->
    </div>

    <ul>
      <li>
        風速：{{ currentWeatherData.wind.speed }}m/s
        {{ getWindDirection(currentWeatherData.wind.deg) }}
      </li>

      <li>気圧：{{ currentWeatherData.main.pressure }}hPa</li>

      <li>湿度：{{ currentWeatherData.main.humidity }}%</li>

      <li>UV：？？？？？？</li>

      <li>
        露点：{{
          calculateDewPoint(
            kelvinToCelsius(currentWeatherData.main.temp),
            currentWeatherData.main.humidity
          )
        }}
      </li>

      <li>視程：{{ mToKm(currentWeatherData.visibility) }}m</li>
    </ul>
  </div>

  <!-- <p>{{ currentWeatherData }}</p> -->
</template>

<style scoped></style>
