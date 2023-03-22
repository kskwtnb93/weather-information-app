# Weather information app with Vite and Vue3 and TypeScript

Clicking or tapping on the map acquires longitude and latitude.

The application obtains and displays various weather data from the acquired longitude and latitude.

# Description

OpenStreetMap by OpenLayers is used to display a map that can be clicked or tapped to obtain longitude and latitude.

By including the longitude and latitude obtained from the map in the OpenWeather API call, various types of weather information for the selected location are dynamically obtained.

Below are the types of weather information that can be retrieved within this application.

- [Current weather data](https://openweathermap.org/current)
- [Hourly forecast](https://openweathermap.org/api/hourly-forecast)
- [Daily Forecast 16 Days](https://openweathermap.org/forecast16)

# DEMO

[https://weather-information-app-blond.vercel.app/](https://weather-information-app-blond.vercel.app/)

# Requirement

- node v16.14.0
- npm 8.3.1

# Getting started

1. Clone the repository.

```bash
git clone https://github.com/kskwtnb93/weather-information-app.git
```

2. Navigate into the cloned repository.

```bash
cd weather-information-app
```

3. Install the required dependencies.

```bash
npm install
```

4. Set up the .env.local file.

```bash
touch .env.local
```

5. Update the .env.local file with your own settings.

```.env.local
VITE_OW_API_URL=https://api.openweathermap.org/data/2.5/
VITE_OW_API_KEY=your_api_key
```

6. Start the application.

```bash
npm run dev
```

# Advanced

## Code auto fix.

Both "npm run format" and "npm run lint" are executed.

```bash
npm run fix
```

# Example

To use the application, follow these steps:

1. Open the application ([DEMO](https://weather-information-app-blond.vercel.app/)) in your web browser.
2. Find the location on the map where you want to know the weather, and click or tap on it. The map can be moved and zoomed in and out by mouse or tap.
3. A marker indicating the selected location will appear where you click or tap.
4. If the API response is returned normally, weather information for the selected location will be displayed.

# Note

The following are not functional in this application because API keys are charged.

- [Hourly forecast](https://openweathermap.org/api/hourly-forecast)
- [Daily Forecast 16 Days](https://openweathermap.org/forecast16)

Therefore, dummy data is used, and for the Hourly Forecast and Daily Forecast 16 Days, the latitude and longitude do not change. The data will not be changed even if the longitude or latitude changes.

To make each of them work, you need to subscribe to a paid plan of OpenWeather API and edit the code.

# Author

- Developer: Keisuke Watanabe

# License

"Weather information app with Vite and Vue3 and TypeScript" is under [MIT license](https://en.wikipedia.org/wiki/MIT_License).
