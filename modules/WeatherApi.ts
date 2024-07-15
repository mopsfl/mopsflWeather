import { _dev, languageStrings, localStorageKey } from ".."
import Time from "./Time";
import self from "./WeatherApi"
import * as lodash from "lodash"
import WeatherIcons from "./WeatherIcons";
import LocalStorage from "./LocalStorage";
import { SettingsValues } from "./Settings";
import Languages from "./Languages";
import Util from "./Util";

const API_URL_DEV: RequestInfo = "http://localhost:6968/v1/",
    API_URL_PROD: RequestInfo = "https://mopsflweather.mopsfl.de/v1/"

const windDirections = {
    en: ["from the North", "from the North-Northeast", "from the Northeast", "from the East-Northeast", "from the East", "from the East-Southeast", "from the Southeast", "from the South-Southeast", "from the South", "from the South-Southwest", "from the Southwest", "from the West-Southwest", "from the West", "from the West-Northwest", "from the Northwest", "from the North-Northwest"],
    de: ["aus Norden", "aus Nord-Nordosten", "aus Nordosten", "aus Ost-Nordosten", "aus Osten", "aus Ost-Südosten", "aus Südosten", "aus Süd-Südosten", "aus Süden", "aus Süd-Südwesten", "aus Südwesten", "aus West-Südwesten", "aus Westen", "aus West-Nordwesten", "aus Nordwesten", "aus Nord-Nordwesten"]
};
const _weatherData = $(".weather-data"),
    _cityName = $(".weather-data-city-name"),
    _temperatureValue = $(".temperature-value"),
    _weatherDescription = $(".weather-description"),
    _windSpeedValue = $(".wind-speed-value"),
    _windGustSpeedValue = $(".windgust-speed-value"),
    _windDirectionIcon = $(".wind-direction-icon"),
    _windDirectionDeg = $(".wind-directiondeg"),
    _sunriseValue = $(".sunrise-value"),
    _sunsetValue = $(".sunset-value"),
    _sunriseInValue = $(".sunrise-in-value"),
    _sunsetInValue = $(".sunset-in-value"),
    _weatherIcon = $(".main-info-weather-icon"),
    _currentTime = $(".weather-data-current-time"),
    _humidityValue = $(".humidity-value"),
    _airpressureValue = $(".airpressure-value"),
    _uvIndexValue = $(".uvindex-value")

export default {
    async SearchCity(name: string | number | string[]) {
        return await fetch((!_dev ? API_URL_PROD : API_URL_DEV) + `data/searchcity?name=${name}`).then(res => res.json()).catch(err => {
            window.toastr.error(err, "ApiError")
            console.error(err)
        })
    },

    async GetOpenWeatherData(args: WeatherRequestArguments, useDefault?: boolean): Promise<OpenWeatherData> {
        if (!(args) && !useDefault) throw new Error("Missing <WeatherRequestArguments>")
        let _settings: SettingsValues = LocalStorage.GetKey(localStorageKey, "settings"),
            query = !useDefault ? `${(args.lat && args.lon) ? `lat=${args.lat}&lon=${args.lon}` : `location=${args.name}`}` : ""

        return await fetch((!_dev ? API_URL_PROD : API_URL_DEV) + `data/currentweather?${query}${_settings?.setting_language ? `&lang=${Languages[_settings?.setting_language]}` : ""}`).then(res => res.json()).catch(err => {
            window.toastr.error(err, "ApiError")
            console.error(err)
        })
    },

    async GetWeatherApiData(args: WeatherRequestArguments) {
        if (!(args)) throw new Error("Missing <WeatherRequestArguments>")
        let _settings: SettingsValues = LocalStorage.GetKey(localStorageKey, "settings"),
            query = `${(args.lat && args.lon) ? `q=${args.lat},${args.lon}` : `q=${args.name}`}`

        return await fetch((!_dev ? API_URL_PROD : API_URL_DEV) + `data/weatherapi/current?${query}&alerts=yes${_settings?.setting_language ? `&lang=${Languages[_settings?.setting_language]}` : ""}`).then(res => res.json()).catch(err => {
            window.toastr.error(err, "ApiError")
            console.error(err)
        })
    },

    UpdateOpenWeatherData(weatherData: OpenWeatherData, cityName?: string, notFromCityList?: boolean) {
        if (weatherData.code !== 200 && weatherData.internal_error) return window.toastr.error(weatherData.internal_error.message.en, weatherData.internal_error.error)
        const _settings: SettingsValues = LocalStorage.GetKey(localStorageKey, "settings"),
            wind = self.CalculateWind(weatherData.data.wind),
            weather = weatherData.data.weather[0]

        _cityName.text(`${(!notFromCityList && cityName) || weatherData.data.name}, ${weatherData.data.sys.country}`)
        _temperatureValue.text(`${lodash.round(weatherData.data.main.temp)}°C`)
        _weatherDescription.html(`${Util.CapitalizeFirstLetter(weather.description)} &bull; &ShortUpArrow; ${lodash.round(weatherData.data.main.temp_max)}°C &bull; &ShortDownArrow; ${lodash.round(weatherData.data.main.temp_min)}°C`)
        _windSpeedValue.text(`${wind.speed}km/h`)
        _windGustSpeedValue.text(wind.gust ? `${wind.gust}km/h` : "N/A")
        _windDirectionDeg.html(self.GetWindDirection(wind.deg).replace(/\s/, "<br>"))
        _windDirectionIcon.css("transform", `rotate(${wind.deg + 180}deg)`)
        _sunriseValue.text(self.UnixTimestampToDateString(weatherData.data.sys.sunrise, weatherData.data.timezone))
        _sunsetValue.text(self.UnixTimestampToDateString(weatherData.data.sys.sunset, weatherData.data.timezone))
        _sunriseInValue.text(Time.TimeUntil(weatherData.data.sys.sunrise, weatherData.data.timezone, true))
        _sunsetInValue.text(Time.TimeUntil(weatherData.data.sys.sunset, weatherData.data.timezone, true))
        _weatherIcon.attr("src", WeatherIcons.GetIcon(WeatherIcons.Icons[weather.id], weatherData.data.timezone, _settings.animated_weather_icons))
        _currentTime.text(Time.GetCurrentTimeWithTimezone(weatherData.data.timezone, 0))
        _humidityValue.text(`${weatherData.data.main.humidity}%`)
        _airpressureValue.html(`${Util.NumberToFloatingPoint(weatherData.data.main.pressure)}<span class="smallgray">mbar</span>`)
        _weatherData.removeClass("hide")

        LocalStorage.Set(localStorageKey, "_openWeatherData", weatherData)
    },

    UpdateWeatherApiData(weatherData: WeatherApiData) {
        _uvIndexValue.text(weatherData.data.current.uv)
        LocalStorage.Set(localStorageKey, "_weatherApiData", weatherData)
    },

    CalculateWind(windData: WindData) {
        const calc_wd = lodash.clone(windData)
        calc_wd.speed = lodash.round(calc_wd.speed * 3.16, 0)
        calc_wd.gust = lodash.round(calc_wd.gust * 3.16, 0)
        return calc_wd
    },

    GetWindDirection(degrees: number) {
        return languageStrings.WEATHER_INFO_WIND_DIRECTIONS[Math.round(degrees % 360 / 22.5) % 16];
    },

    UnixTimestampToDateString(unixTimestamp: number, timezone = 0, full?: boolean) {
        const date = new Date((unixTimestamp + timezone) * 1000);
        const year = date.getUTCFullYear();
        const month = ('0' + (date.getUTCMonth() + 1)).slice(-2);
        const day = ('0' + date.getUTCDate()).slice(-2);
        const hours = ('0' + date.getUTCHours()).slice(-2);
        const minutes = ('0' + date.getUTCMinutes()).slice(-2);
        const seconds = ('0' + date.getUTCSeconds()).slice(-2);

        return full ? `${year}-${month}-${day} ${hours}:${minutes}:${seconds}` : `${hours}:${minutes}`;
    }

}

export interface CitySearchResult {
    name: string,
    lat: string,
    lng: string,
    country: string,
    admin1: string,
    admin2: string,
}

export interface ApiError {
    code: number,
    message: string,
    error: string
}

export interface WeatherRequestArguments {
    lon?: string | number,
    lat?: string | number,
    name?: string,
}

export interface OpenWeatherData {
    code?: number,
    message?: string,
    data?: {
        main: { temp: number, feels_like: number, temp_min: number, temp_max: number, pressure: number, humidity: number },
        visibility: number,
        wind: WindData,
        clouds: {},
        dt: number,
        base: string,
        sys: { type: number, id: number, country: string, sunrise: number, sunset: number },
        weather: Array<{ id: number, main: string, description: string, icon: string }>,
        timezone: number,
        id: number,
        name: string,
        cod: number
    },
    cached: boolean,
    internal_error?: InternalError
}

export interface WeatherApiData {
    code?: number,
    message?: string,
    cached: boolean,
    internal_error?: InternalError,
    data?: {
        current: {
            uv: number,
        },
        forecast: {
            forecastday: Array<{
                hour: Array<{
                    temp_c: number,
                    temp_f: number,
                    wind_mph: number,
                    wind_kph: number,
                    gust_mph: number,
                    gust_kph: number,
                    uv: number,
                    chance_of_rain: number
                }>
            }>
        },
        alerts: {
            alert: []
        }
    }
}

export interface InternalError {
    code: number,
    error: string,
    message: {
        de: string,
        en: string
    }
}

export interface WindData {
    speed: number, deg: number, gust: number,
}