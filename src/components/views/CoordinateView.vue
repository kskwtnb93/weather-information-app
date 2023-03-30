<script setup lang="ts">
import { onMounted, ref } from 'vue'

// OpenLayers
import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import { transform } from 'ol/proj'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import { Icon, Style } from 'ol/style'

import CurrentWeatherData from '../templates/CurrentWeatherData.vue'
// import HourlyForecast from '../templates/HourlyForecast.vue'
// import DailyForecast from '../templates/DailyForecast.vue'

// 経度・緯度の初期値は東京駅
// const lat = ref<number>(35.680959106959)
// const lon = ref<number>(139.76730676352)
const lat = ref<number>(51.50655861215682)
const lon = ref<number>(-0.12678888321268064)

// WEB_MERCATOR: Webメルカトル図法, WGS84: 世界測地系
const WEB_MERCATOR = 'EPSG:3857'
const WGS84 = 'EPSG:4326'

// マーカーの生成処理
const vectorLayer = (epsg3857: number[]) => {
  const iconFeature = new Feature({
    geometry: new Point(epsg3857),
  })

  const iconStyle = new Style({
    image: new Icon({
      anchor: [0.5, 46],
      anchorXUnits: 'fraction',
      anchorYUnits: 'pixels',
      src: 'https://OpenLayers.org/en/latest/examples/data/icon.png',
    }),
  })

  iconFeature.setStyle(iconStyle)

  const vectorSource = new VectorSource({
    features: [iconFeature],
  })

  return new VectorLayer({
    source: vectorSource,
  })
}

onMounted(() => {
  // WGS84系で緯度経度を定義
  const coordinate = [lon.value, lat.value]
  // 経度が180を超えると、エラーになるので-360をして、値を補正
  if (coordinate[0] > 180) coordinate[0] = coordinate[0] - 360
  // WGS84系（緯度経度）をWebメルカトル図法に変換
  const coordinateEPSG3857 = transform(coordinate, WGS84, WEB_MERCATOR)

  // OpenLayers: 地図の設定
  const map = new Map({
    controls: [], // controlsが非表示になる
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
      vectorLayer(coordinateEPSG3857),
    ],
    target: 'map',
    view: new View({
      center: coordinateEPSG3857,
      zoom: 1,
    }),
  })

  // controls調整
  // const controls = map.getControls()
  // // console.log(controls)
  // controls.forEach((control) => {
  //   if (!(control instanceof Attribution)) {
  // 		console.log(control)
  //     map.removeControl(control)
  //   }
  //   // console.log(control)
  //   // map.removeControl(control)
  // })

  map.on('click', (event) => {
    // クリックした場所の座標を取得
    const coordinate = transform(event.coordinate, WEB_MERCATOR, WGS84)
    // 経度が180を超えると、エラーになるので-360をして、値を補正
    if (coordinate[0] > 180) coordinate[0] = coordinate[0] - 360
    // WGS84系（緯度経度）をWebメルカトル図法に変換
    const coordinateEPSG3857 = transform(coordinate, WGS84, WEB_MERCATOR)

    // 地図から全てのマーカーを削除
    const allLayers = map.getLayers().getArray()
    allLayers.forEach((layer) => {
      if (layer instanceof VectorLayer) {
        map.removeLayer(layer)
      }
    })

    // クリックした座標にピンを表示
    map.addLayer(vectorLayer(coordinateEPSG3857))

    // // マーカーの位置を指定
    // const markerFeature = new Feature({
    //   geometry: new Point(coordinate),
    // })
    // // マーカーの設定
    // const markerLayer = new VectorLayer({
    //   source: new VectorSource({
    //     features: [markerFeature],
    //   }),
    //   style: markerStyle,
    // })
    // map.addLayer(vectorLayer)

    // 経度・緯度を更新
    // console.log(coordinate)
    lon.value = coordinate[0]
    lat.value = coordinate[1]
  })
})
</script>

<template>
  <div class="coordinate">
    <div class="coordinate__parent">
      <div class="coordinate__children">
        <CurrentWeatherData
          :lat="lat"
          :lon="lon"
        />
      </div>

      <div class="coordinate__children">
        <div class="coordinate__map-wrapper">
          <div
            id="map"
            class="coordinate__map"
          ></div>
        </div>
      </div>

      <!-- <div class="coordinate__children">
        <HourlyForecast
          :lat="lat"
          :lon="lon"
        />
      </div>

      <div class="coordinate__children">
        <DailyForecast
          :lat="lat"
          :lon="lon"
        />
      </div> -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
.coordinate {
  &__parent {
    display: flex;
    flex-wrap: wrap;
  }

  &__children {
    position: relative;
    width: 50%;
    padding: 3.2rem 1.6rem;
  }

  // &__map-wrapper {
  // }

  &__map {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    min-height: 28rem;
    margin: 0 auto;
  }
}

@media screen and (max-width: 750px) {
  .coordinate {
    // &__parent {
    // }

    &__children {
      width: 100%;
      padding: 1.6rem;
      margin-top: 1.6rem;

      &:last-child {
        margin-top: 0;
      }
    }

    &__map-wrapper {
      height: 22rem;
    }

    &__map {
      height: 100%;
      min-height: 22rem;
    }
  }
}
</style>
