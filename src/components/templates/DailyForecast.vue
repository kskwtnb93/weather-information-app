<script setup lang="ts">
import { ref, watch, defineProps } from 'vue'
// import axios from 'axios'

import {
	formatDate2,
	formatkelvinToCelsius
} from '../../mixins/formatWeatherData'
import { getWeatherIconPath } from '../../mixins/getWeatherIcon'

import type { DailyForecast } from '../../types/DailyForecast'

import HeadingLevel2 from '../parts/heading/HeadingLevel2.vue'

import dummyDailyForecast from '../../dummy/dailyForecast'

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

const currentWeatherData = ref<DailyForecast>(dummyDailyForecast)

// const API_URL = import.meta.env.VITE_OW_API_URL
// const API_KEY = import.meta.env.VITE_OW_API_KEY

// データ取得日数
// const cnt = 8

// 天気データの再取得
const getWeatherData = () => {
  // axios
  //   .get(`${API_URL}forecast/daily?lat=${props.lat}&lon=${props.lon}&cnt=${cnt}&appid=${API_KEY}`)
  //   .then((response) => {
  //     currentWeatherData.value = response.data
  //   })
  //   .catch((error) => console.log('error', error))
}

// 本日から８日間分のUNIX時間を取得（ ※API取得できるまでの暫定的な処理 ）
// 今日の日付を取得
const today = new Date();
// 7日分のUNIX時間を格納する配列を宣言
const unixTimes: number[] = [];
// 7日分のUNIX時間を計算し、配列に追加
for (let i = 0; i < 8; i++) {
  const date = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
  const unixTime = Math.floor(date.getTime() / 1000);
  unixTimes.push(unixTime);
}

watch(
  () => [props.lat, props.lon],
  () => {
    // 天気データを再取得
    getWeatherData()
    console.log(currentWeatherData.value)
  },
  { immediate: true }
)
</script>

<template>
  <div class="df">
    <HeadingLevel2
      tag="h2"
      text="Daily Forecast"
    />

    <div class="df__main">
      <ul class="df__main__list">
        <li
          v-for="(oneDay, index) in currentWeatherData.list"
          :key="oneDay.dt"
          class="df__main__list__item"
        >
          <!-- <p class="df__main__date">{{ formatDate2(oneDay.dt) }}</p> -->
          <p class="df__main__date">{{ formatDate2(unixTimes[index]) }}</p>
					
          <div class="df__main__mid">
            <p class="df__main__mid__icon">
              <img
                :src="getWeatherIconPath(oneDay.weather[0].icon, '@4x')"
                alt="Weather Icon"
              />
            </p>
							
            <p class="df__main__mid__temp">
              {{ formatkelvinToCelsius(oneDay.temp.max) }} / 
              {{ formatkelvinToCelsius(oneDay.temp.min) }}°C
            </p>
          </div>
							
          <p class="df__main__description">{{ oneDay.weather[0].description }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.df {
	&__main {
		&__list {
			&__item {
				display: flex;
				justify-content: space-between;
				align-items: center;

			}
		}

		&__date {

		}

		&__mid {
			display: flex;
			justify-content: space-between;
			align-items: center;

			&__icon {

			}

			&__temp {

			}
		}

		&__description {
			
		}
	}
}
</style>
