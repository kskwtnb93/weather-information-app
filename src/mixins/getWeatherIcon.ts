// 天気のアイコンの画像パスを生成する処理
export const getWeatherIconPath = (code: string, size = '@4x') => {
  const iconUrl = 'https://openweathermap.org/img/wn/' + code + size + '.png'
  return iconUrl
}
