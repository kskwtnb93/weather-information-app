<script setup lang="ts">
import { Ref, ref, watch } from 'vue'
// import axios from 'axios'
import { Chart, registerables } from 'chart.js'
import { Line } from 'vue-chartjs'

import type { ChartData, ChartOptions } from 'chart.js'
import type { HourlyForecast } from '../../types/HourlyForecast'

import {
  // formatDate,
  // formatWindDirection,
  formatkelvinToCelsius,
  // formatDewPoint,
  // formatMeters,
} from '../../mixins/formatWeatherData'

import HeadingLevel2 from '../parts/heading/HeadingLevel2.vue'

import dummyHourlyForecast from '../../dummy/hourlyForecast'

Chart.register(...registerables)

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

// APIが有料のため、一旦ダミーデータ（dummyHourlyForecast）を利用
const hourlyForecast: Ref<HourlyForecast> = ref(dummyHourlyForecast)

// const API_URL = import.meta.env.VITE_OW_API_URL
// const API_URL = 'https://pro.openweathermap.org/data/2.5/'
// const API_KEY = import.meta.env.VITE_OW_API_KEY

// 天気データの取得・更新処理
const getWeatherData = () => {
  // console.log('HourlyForecast: データ更新')
  // axios
  //   .get(
  //     `${API_URL}forecast/hourly?lat=${props.lat}&lon=${props.lon}&appid=${API_KEY}`
  //   )
  //   .then((response) => {
  //     HourlyForecast.value = response.data
  //   })
  //   .catch((error) => console.log('error', error))
}

const chartData: Ref<ChartData<'line'>> = ref({
  labels: [],
  datasets: [
    {
      data: [],
    },
  ],
})

const chartOptions: Ref<ChartOptions<'line'>> = ref({
  responsive: true,
  scales: {
    y: {
      ticks: {
        stepSize: 5,
      },
    },
  },
})

// x軸、bottomのラベルを作成する処理
// const createLabels1 = (): string[] => {
// 	console.log('createLabels')
// 	const arr = hourlyForecast.value.list
// 	const result = []

// 	for(let i = 0; i < arr.length; i++) {
// 		const item = arr[i].weather[0].description.replace(' ', '\n')
// 		result.push(item)
// 	}

// 	return result
// }

// x軸、topのラベルを作成する処理
const createLabels2 = (): string[] => {
  // console.log('createLabels')
  // const arr = hourlyForecast.value.list
  // 上記の代わりに96時間分のダミーデータを生成
  const current_time = Math.floor(Date.now() / 1000)
  const end_time = current_time + 96 * 60 * 60
  const arr = []
  for (let i = current_time; i <= end_time; i += 60 * 60) {
    arr.push(i)
  }

  const result = []

  for (let i = 0; i < arr.length; i++) {
    // const item = arr[i].dt
    // const date = new Date(arr[i].dt * 1000)
    const date = new Date(arr[i] * 1000)
    const hour = date.getHours()
    const ampm = hour < 12 ? 'am' : 'pm'
    const hour12 = hour % 12 || 12
    let item = `${hour12}${ampm}`

    // 12amの時、日付を表示
    if (item === '12am') {
      const month = date.toLocaleString('en-US', { month: 'short' })
      const day = date.getDate()
      item = `${month} ${day}`
    }

    result.push(item)
  }

  return result
}

const createData = (): number[] => {
  // console.log('createData')
  const arr = hourlyForecast.value.list
  const result = []

  for (let i = 0; i < arr.length; i++) {
    const item = formatkelvinToCelsius(arr[i].main.temp)
    result.push(item)
  }

  return result
}

const updateLineChartData = (
  // updateLabels1: string[],
  updateLabels2: string[],
  updateData: number[]
): ChartData<'line'> => {
  const labels2 = updateLabels2
  const data = updateData

  const newData = {
    // labels: {
    // 	x: labels1,
    // 	x1: labels2,
    // },
    labels: labels2,
    datasets: [
      {
        data: data,
        borderColor: '#eb6e4c',
        pointStyle: 'circle',
        pointRadius: 0,
        lineTension: 0.3,
      },
    ],
  }

  return newData
}

const updateLineChartOptions = (updateData: number[]): object => {
  const minTemp = Math.min(...updateData)
  const maxTemp = Math.max(...updateData)

  const newOptions = {
    responsive: true,
    maintainAspectRatio: true,
    tooltips: {
      display: false,
      enabled: false,
    },
    scales: {
      y: {
        // 最大の気温に+10℃
        max: maxTemp + 10,
        // 最小の気温に-10℃
        min: minTemp - 10,
        ticks: {
          font: {
            size: 12,
          },
          stepSize: 5,
          callback: (value: number) => `${value}°`,
        },
        grid: {
          // display: false
        },
      },
      x: {
        type: 'category',
        position: 'bottom',
        ticks: {
          font: {
            size: 10,
          },
          // callback: function(val: any, index: any): any {
          //   return this.getLabelForValue(val)
          // },
          maxRotation: 0,
          minRotation: 0,
          autoSkip: false,
          beginAtZero: false,
        },
        grid: {
          display: false,
        },
      },
      // x1: {
      // 	type: 'category',
      // 	position: 'top',
      // 	ticks: {
      // 		// callback: function(value, index, ticks) {
      // 		// 	console.log(ticks)
      // 		// 	return ticks
      // 		// },
      // 		maxRotation: 0,
      // 		minRotation: 0,
      // 		autoSkip: true,
      // 		beginAtZero: false
      // 	},
      // 	grid: {
      // 		display: true
      // 	}
      // },
    },
    plugins: {
      tooltip: {
        enabled: false,
      },
      legend: {
        display: false,
      },
    },
  }

  return newOptions
}

watch(
  () => [props.lat, props.lon],
  () => {
    // hourlyForecastを更新
    getWeatherData()

    // const newLabels1 = createLabels1()
    const newLabels2 = createLabels2()
    const newData = createData()

    chartData.value = updateLineChartData(
      // newLabels1,
      newLabels2,
      newData
    )
    chartOptions.value = updateLineChartOptions(newData)
  },
  { immediate: true }
)
</script>

<template>
  <div class="hf">
    <HeadingLevel2
      class="hf__heading"
      tag="h2"
      text="Hourly forecast"
    />

    <div class="hf__chart">
      <div
        class="hf__chart__wrapper"
        style="width: 4800px; height: 100%"
      >
        <Line
          style="width: 4800px; height: 100%"
          :data="chartData"
          :options="chartOptions"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hf {
  width: 100%;

  &__heading {
    margin-bottom: 2.7rem;
  }

  &__chart {
    width: 100%;
    height: 39rem;
    padding-bottom: 3rem;
    overflow-x: scroll;

    // &__wrapper {
    // }
  }
}

@media screen and (max-width: 750px) {
  .hf {
    &__heading {
      margin-bottom: 2rem;
    }

    &__chart {
      height: 32rem;
      padding-bottom: 2rem;

      // &__wrapper {
      // }
    }
  }
}
</style>
