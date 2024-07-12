import { _dev } from ".."
import self from "./WeatherApi"
import * as lodash from "lodash"

const API_URL_DEV: RequestInfo = "http://localhost:6968/v1/",
    API_URL_PROD: RequestInfo = "https://mopsflweather.mopsfl.de/v1/"

const WindDirections = {
    en: ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"],
    de: ["N", "NNO", "NO", "ONO", "O", "OSO", "SO", "SSO", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]
};
const _weatherData = $(".weather-data"),
    _cityName = $(".weather-data-city-name"),
    _temperatureValue = $(".temperature-value"),
    _weatherDescription = $(".weather-description"),
    _windSpeedValue = $(".wind-speed-value"),
    _windDirectionIcon = $(".wind-direction-icon"),
    _sunriseValue = $(".sunrise-value"),
    _sunsetValue = $(".sunset-value")

export default {
    async SearchCity(name: string | number | string[]) {
        return await fetch((!_dev ? API_URL_PROD : API_URL_DEV) + `data/searchcity?name=${name}`).then(res => res.json()).catch(err => {
            window.toastr.error(err, "ApiError")
            console.error(err)
        })
    },

    async GetWeatherData(args: WeatherRequestArguments) {
        if (!(args)) throw new Error("Missing <WeatherRequestArguments>")

        if (args.lat && args.lon) {
            return await fetch((!_dev ? API_URL_PROD : API_URL_DEV) + `data/currentweather?lat=${args.lat}&lon=${args.lon}`).then(res => res.json()).catch(err => {
                window.toastr.error(err, "ApiError")
                console.error(err)
            })
        }
    },

    UpdateWeatherData(weatherData: WeatherData, cityName?: string) {
        if (weatherData.code !== 200 && weatherData.internal_error) return window.toastr.error(weatherData.internal_error.message.en, weatherData.internal_error.error)

        _cityName.text(`${cityName || weatherData.data.name}, ${weatherData.data.sys.country}`)
        _temperatureValue.text(`${lodash.round(weatherData.data.main.temp)}°C`)
        _weatherDescription.text(weatherData.data.weather[0].description)
        _windSpeedValue.text(`${weatherData.data.wind.speed}m/s ${self.GetWindDirection(weatherData.data.wind.deg)}`)
        _windDirectionIcon.css("transform", `rotate(${weatherData.data.wind.deg + 180}deg)`)
        _weatherData.removeClass("hide")
        _sunriseValue.text(self.UnixTimestampToDateString(weatherData.data.sys.sunrise))
        _sunsetValue.text(self.UnixTimestampToDateString(weatherData.data.sys.sunset))
        console.log(self.UnixTimestampToDateString(weatherData.data.sys.sunset));
    },

    CalculateWind(windData: WindData) {
        const calc_wd = lodash.clone(windData)
        calc_wd.speed = lodash.round(calc_wd.speed * 3.16, 0)
        calc_wd.gust = lodash.round(calc_wd.gust * 3.16, 0)
        return calc_wd
    },

    GetWindDirection(degrees: number) {
        return WindDirections.de[Math.round(degrees % 360 / 22.5) % 16];
    },

    UnixTimestampToDateString(unixTimestamp: number, full?: boolean) {
        const date = new Date(unixTimestamp * 1000);
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);
        const seconds = ('0' + date.getSeconds()).slice(-2);

        return full ? `${year}-${month}-${day} ${hours}:${minutes}:${seconds}` : `${hours}:${minutes}`
    }

}

export interface CitySearchResult {
    city: string,
    city_ascii: string,
    lat: string,
    lng: string,
    country: string,
    iso2: string,
    iso3: string,
    admin_name: string,
    population: string,
    id: string
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

export interface WeatherData {
    code?: number,
    message?: string,
    data: {
        main: { temp: number, feels_like: number, temp_min: number, temp_max: number, pressure: number, humidity: number },
        visibility: number,
        wind: WindData,
        clouds: {},
        dt: number,
        base: string,
        sys: { type: number, id: number, country: string, sunrise: number, sunset: number },
        weather: [{ id: number, main: string, description: string, icon: string }],
        timezone: number,
        id: number,
        name: string,
        cod: number
    },
    cached: boolean,
    internal_error?: {
        code: number,
        error: string,
        message: {
            de: string,
            en: string
        }
    }
}

export interface WindData {
    speed: number, deg: number, gust: number,
}