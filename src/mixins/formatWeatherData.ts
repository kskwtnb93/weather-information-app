// UNIX時間（例: 1661857200）を「Mar 14, 03:55 pm」の形式に変換する処理
export const formatDate1 = (unixtime: number, timezone: number): string => {
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

// UNIX時間（例: 1661857200）を「Sun, Mar 19」の形式に変換する処理
export const formatDate2 = (unixtime: number): string => {
  const date = new Date(unixtime * 1000)
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const monthsOfYear = [
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
  const dayOfWeek = daysOfWeek[date.getUTCDay()]
  const monthOfYear = monthsOfYear[date.getUTCMonth()]
  const dayOfMonth = date.getUTCDate().toString().padStart(2, '0')

  return `${dayOfWeek}, ${monthOfYear} ${dayOfMonth}`
}

// 風向を deg から表記を直す処理
export const formatWindDirection = (degrees: number): string => {
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
// 例:299.66 → 26
export const formatkelvinToCelsius = (kelvin: number): number => {
  const celsius = kelvin - 273.15
  return Math.floor(celsius)
}

// 露点を計算する処理
export const formatDewPoint = (
  temperature: number,
  humidity: number
): string => {
  const a = 17.27
  const b = 237.7
  const alpha = (a * temperature) / (b + temperature) + Math.log(humidity / 100)
  const dewPoint = (b * alpha) / (a - alpha)
  return `${Math.round(dewPoint)}°C`
}

// m を km 表記に変化する処理
export const formatMeters = (m: number): number => {
  const km = m / 1000
  return Math.round(km * 10) / 10
}
