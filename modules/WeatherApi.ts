import { _dev, languageStrings, localStorageKey, notifications } from ".."
import Time from "./Time";
import self from "./WeatherApi"
import * as lodash from "lodash"
import WeatherIcons from "./WeatherIcons";
import LocalStorage from "./LocalStorage";
import { SettingsValues } from "./Settings";
import Languages from "./Languages";
import Util from "./Util";
import Strings from "./Strings";

const API_URL_DEV: RequestInfo = "http://localhost:6968/v1/",
    API_URL_PROD: RequestInfo = "https://mopsflweather.mopsfl.de/v1/"

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

const _weatherForecastItems = $(".weather-forecast-items"),
    _weatherForecastMiscItems = $(".weather-forecast-misc-items"),
    _weatherForecastItemTemplate = $(".weather-forecast-item-template"),
    _weatherForecastMiscItemTemplate = $(".weather-forecast-misc-item-template")

export default {
    async SearchCity(name: string | number | string[]) {
        return await fetch((!_dev ? API_URL_PROD : API_URL_DEV) + `data/searchcity?name=${name}`).then(res => res.json()).catch(err => {
            notifications.error("ApiError", err)
            console.error(err)
        })
    },

    async GetOpenWeatherData(args: WeatherRequestArguments, useDefault?: boolean): Promise<any | Response> {
        if (!(args) && !useDefault) throw new Error("Missing <WeatherRequestArguments>")
        let _settings: SettingsValues = LocalStorage.GetKey(localStorageKey, "settings"),
            query = !useDefault ? `${(args.lat && args.lon) ? `lat=${args.lat}&lon=${args.lon}` : `location=${args.name}`}` : ""

        return await fetch((!_dev ? API_URL_PROD : API_URL_DEV) + `data/currentweather?${query}${_settings?.setting_language ? `&lang=${Languages[_settings?.setting_language]}` : ""}`).catch(err => {
            notifications.error("ApiError", err)
            console.error(err)
        })
    },

    async GetWeatherApiData(args: WeatherRequestArguments): Promise<void | Response> {
        if (!(args)) throw new Error("Missing <WeatherRequestArguments>")
        let _settings: SettingsValues = LocalStorage.GetKey(localStorageKey, "settings"),
            query = `${(args.lat && args.lon) ? `q=${args.lat},${args.lon}` : `q=${args.name}`}`

        return await fetch((!_dev ? API_URL_PROD : API_URL_DEV) + `data/weatherapi/forecast?${query}&alerts=yes${_settings?.setting_language ? `&lang=${Languages[_settings?.setting_language]}` : ""}&days=2`).catch(err => {
            notifications.error("ApiError", err)
            console.error(err)
        })
    },

    async UpdateOpenWeatherData(weatherDataResponse: Response, cityName?: string, notFromCityList?: boolean) {
        if (!weatherDataResponse.ok) return self.HandleFailedRequest(weatherDataResponse)
        const weatherData: OpenWeatherData = await weatherDataResponse.json()

        if (weatherData.code !== 200 && weatherData.internal_error) return notifications.error(weatherData.internal_error.code, weatherData.message)
        const _settings: SettingsValues = LocalStorage.GetKey(localStorageKey, "settings"),
            wind = Util.CalculateWind(weatherData.data.wind),
            weather = weatherData.data.weather[0]

        _cityName.text(`${(!notFromCityList && cityName) || weatherData.data.name}, ${weatherData.data.sys.country}`)
        _temperatureValue.text(`${lodash.round(weatherData.data.main.temp)}°C`)
        _weatherDescription.html(`${Util.CapitalizeFirstLetter(weather.description)} &bull; &ShortUpArrow; ${lodash.round(weatherData.data.main.temp_max)}°C &bull; &ShortDownArrow; ${lodash.round(weatherData.data.main.temp_min)}°C`)
        _windSpeedValue.text(`${wind.speed}km/h`)
        _windGustSpeedValue.text(wind.gust ? `${wind.gust}km/h` : "N/A")
        _windDirectionDeg.html(Util.GetWindDirection(wind.deg).replace(/\s/, "<br>"))
        _windDirectionIcon.css("transform", `rotate(${wind.deg + 180}deg)`)
        _sunriseValue.text(Time.UnixTimestampToDateString(weatherData.data.sys.sunrise, weatherData.data.timezone))
        _sunsetValue.text(Time.UnixTimestampToDateString(weatherData.data.sys.sunset, weatherData.data.timezone))
        _sunriseInValue.text(Time.TimeUntil(weatherData.data.sys.sunrise, weatherData.data.timezone, true))
        _sunsetInValue.text(Time.TimeUntil(weatherData.data.sys.sunset, weatherData.data.timezone, true))
        _weatherIcon.attr("src", WeatherIcons.GetIcon(WeatherIcons.Icons[weather.id], weatherData.data.timezone, _settings.animated_weather_icons))
        _currentTime.text(Time.GetCurrentTimeWithTimezone(weatherData.data.timezone, 0))
        _humidityValue.html(`${weatherData.data.main.humidity} <span class="smallgray">%</span>`)
        _airpressureValue.html(`${Util.NumberToFloatingPoint(weatherData.data.main.pressure)} <span class="smallgray">mbar</span>`)
        _weatherData.removeClass("hide")

        LocalStorage.Set(localStorageKey, "_openWeatherData", weatherData)
    },

    async UpdateWeatherApiData(weatherDataResponse: Response) {
        if (!weatherDataResponse.ok) return self.HandleFailedRequest(weatherDataResponse)
        const weatherData: WeatherApiData = await weatherDataResponse.json()
        _uvIndexValue.text(weatherData.data.current.uv)
        self.UpdateForecastData(weatherData)

        LocalStorage.Set(localStorageKey, "_weatherApiData", weatherData)
    },

    UpdateForecastData(weatherApiData: WeatherApiData) {
        const _settings: SettingsValues = LocalStorage.GetKey(localStorageKey, "settings")
        const _openWeatherData: OpenWeatherData = LocalStorage.GetKey(localStorageKey, "_openWeatherData")
        const _currentHour = new Date().getHours()

        _weatherForecastItems.empty()
        _weatherForecastItems.get(0).scrollLeft = 0

        weatherApiData.data?.forecast?.forecastday.forEach((forecastday, index) => {
            forecastday.hour.forEach(hourWeatherData => {
                const _dataHour = new Date(hourWeatherData.time).getHours()

                // Hourly Weather Forecast Details (Temperature, ...)
                if (index === 0 && _dataHour >= _currentHour) {
                    const [_forecastItem, _forecastTemperatureValue, _forecastIcon, _forecastTimeValue, _rainChanceValue] = self.CreateForecastItem()
                    if (_dataHour === _currentHour) {
                        _forecastTimeValue.text(Strings[Languages[_settings.setting_language]]?.WEATHER_HOURLY_FORECAST_NOW)
                        _forecastTemperatureValue.text(`${lodash.round(_openWeatherData.data.main.temp || hourWeatherData.temp_c)}°C`)
                        _forecastIcon.attr("src", WeatherIcons.GetIcon(WeatherIcons.Icons[_openWeatherData.data.weather[0].id], _openWeatherData.data.timezone, _settings.animated_weather_icons))
                    } else {
                        _forecastTemperatureValue.text(`${lodash.round(hourWeatherData.temp_c)}°C`)
                        _forecastTimeValue.text(Time.GetHourString(hourWeatherData.time, _openWeatherData.data.timezone))
                        _forecastIcon.attr("src", WeatherIcons.GetIcon(WeatherIcons.Icons[hourWeatherData.condition.code], _openWeatherData.data.timezone, _settings.animated_weather_icons, !!hourWeatherData.is_day))
                    }
                    if (hourWeatherData.chance_of_rain > 0) {
                        _rainChanceValue.html(`<span class="material-symbols-outlined">water_drop</span>${hourWeatherData.chance_of_rain} %`)
                    } else _rainChanceValue.html(`&zwnj;`)

                    _forecastItem.appendTo(_weatherForecastItems)
                } else if (index === 1) {
                    const [_forecastItem, _forecastTemperatureValue, _forecastIcon, _forecastTimeValue, _rainChanceValue] = self.CreateForecastItem()

                    _forecastTemperatureValue.text(`${lodash.round(hourWeatherData.temp_c)}°C`)
                    _forecastTimeValue.text(Time.GetHourString(hourWeatherData.time, _openWeatherData.data.timezone))
                    _forecastIcon.attr("src", WeatherIcons.GetIcon(WeatherIcons.Icons[hourWeatherData.condition.code], _openWeatherData.data.timezone, _settings.animated_weather_icons, !!hourWeatherData.is_day))
                    if (hourWeatherData.chance_of_rain > 0) {
                        _rainChanceValue.html(`<span class="material-symbols-outlined">water_drop</span>${hourWeatherData.chance_of_rain} %`)
                    } else _rainChanceValue.html(`&zwnj;`)

                    _forecastItem.appendTo(_weatherForecastItems)
                }

                // Hourly Misc Forecast Details (Temperature, ...)
                if (index === 0 && _dataHour >= _currentHour) {
                    const [_forecastDetailItem, _forecastWindspeedValue, _forecastWindDirectionIcon, _forecastTimeValue] = self.CreateForecastDetailItem()
                    _forecastWindspeedValue.html(`${lodash.round(hourWeatherData.wind_kph)}<span class="smallgray unitText">km/h</span>`)
                    _forecastWindDirectionIcon.css("transform", `rotate(${hourWeatherData.wind_degree + 180}deg)`)

                    if (_dataHour === _currentHour) {
                        _forecastTimeValue.text(Strings[Languages[_settings.setting_language]]?.WEATHER_HOURLY_FORECAST_NOW)
                    } else {
                        _forecastTimeValue.text(Time.GetHourString(hourWeatherData.time, _openWeatherData.data.timezone))
                    }

                    _forecastDetailItem.appendTo(_weatherForecastMiscItems)
                } else if (index === 1) {
                    const [_forecastDetailItem, _forecastWindspeedValue, _forecastWindDirectionIcon, _forecastTimeValue] = self.CreateForecastDetailItem()
                    _forecastWindspeedValue.html(`${lodash.round(hourWeatherData.wind_kph)}<span class="smallgray unitText">km/h</span>`)
                    _forecastWindDirectionIcon.css("transform", `rotate(${hourWeatherData.wind_degree + 180}deg)`)
                    _forecastTimeValue.text(Time.GetHourString(hourWeatherData.time, _openWeatherData.data.timezone))

                    _forecastDetailItem.appendTo(_weatherForecastMiscItems)
                }
            })
        })
    },

    CreateForecastItem() {
        const _forecastDetailItem = _weatherForecastItemTemplate.contents().clone(),
            _forecastTemperatureValue = _forecastDetailItem.find(".weather-forecast-temperature-value"),
            _forecastIcon = _forecastDetailItem.find(".weather-forecast-icon"),
            _forecastTimeValue = _forecastDetailItem.find(".weather-forecast-time-value"),
            _rainChanceValue = _forecastDetailItem.find(".weather-forecast-rain-chance")

        return [_forecastDetailItem, _forecastTemperatureValue, _forecastIcon, _forecastTimeValue, _rainChanceValue]
    },

    CreateForecastDetailItem() {
        const _forecastItem = _weatherForecastMiscItemTemplate.contents().clone(),
            _forecastWindspeedValue = _forecastItem.find(".weather-forecast-misc-windspeed-value"),
            _forecastWindDirectionIcon = _forecastItem.find(".weather-forecast-misc-wind-direction-icon"),
            _forecastTimeValue = _forecastItem.find(".weather-forecast-misc-time-value")

        return [_forecastItem, _forecastWindspeedValue, _forecastWindDirectionIcon, _forecastTimeValue]
    },

    async HandleFailedRequest(response: Response) {
        const isJSON = response.headers.get("content-type").includes("application/json")
        if (!isJSON) return notifications.error(`ApiError - ${response.status}`, `${response.statusText}`)
        const internal_error: InternalError = await response.json()
        if (internal_error.internal_error) return notifications.error(`ApiError - ${response.status}`, `${internal_error.internal_error.message.de}`)
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
                date: string,
                date_epoch: number,
                hour: Array<{
                    time_epoch: number,
                    time: string,
                    temp_c: number,
                    temp_f: number,
                    wind_mph: number,
                    wind_kph: number,
                    gust_mph: number,
                    gust_kph: number,
                    wind_degree: number,
                    uv: number,
                    chance_of_rain: number,
                    condition: { text: string, code: number, icon: number },
                    cloud: number,
                    humidity: number,
                    is_day: number,
                }>,
                day: {
                    maxtemp_c: number
                    maxtemp_f: number
                    mintemp_c: number
                    mintemp_f: number
                    avgtemp_c: number
                    avgtemp_f: number
                    maxwind_mph: number
                    maxwind_kph: number
                    totalprecip_mm: number
                    totalprecip_in: number
                    totalsnow_: number
                    avgvis_km: number
                    avgvis_miles: number
                    avghumidity: number
                    daily_will_it_rain: number
                    daily_chance_of_rain: number
                    daily_will_it_snow: number
                    daily_chance_of_snow: number
                }
            }>
        },
        alerts: { alert: Array<WeatherApiAlert> }
    }
}

export interface WeatherApiAlert {
    headline: string,
    msgType: string,
    severity: string,
    urgency: string,
    areas: string,
    category: string,
    certanity: string,
    event: string,
    note: string,
    effective: string,
    expires: string,
    desc: string,
    instruction: string
}

export interface InternalError {
    code: number,
    internal_error: {
        code: number,
        message: {
            de: string,
            en: string
        }
    },
    message: string
}

export interface WindData {
    speed: number, deg: number, gust: number,
}

export { _weatherForecastItems }