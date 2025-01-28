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

const API_URL_DEV: RequestInfo = "http://localhost:6969/v1/mopsflWeather/",
    API_URL_PROD: RequestInfo = "https://api.mopsfl.de/v1/mopsflWeather/"

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
    _uvIndexValue = $(".uvindex-value"),
    _weatherAlert = $(".weather-alert")

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

        return await fetch((!_dev ? API_URL_PROD : API_URL_DEV) + `data/forecast?${query}&alerts=yes${_settings?.setting_language ? `&lang=${Languages[_settings?.setting_language]}` : ""}&days=2`).catch(err => {
            notifications.error("ApiError", err)
            console.error(err)
        })
    },

    async UpdateOpenWeatherData(weatherDataResponse: Response, cityName?: string, notFromCityList?: boolean) {
        if (!weatherDataResponse.ok) return self.HandleFailedRequest(weatherDataResponse)
        const weatherData: OpenWeatherData = await weatherDataResponse.json()

        if (weatherData.code !== 200 && weatherData.internal_error) return notifications.error(weatherData.internal_error.code, "%weatherData.message%")
        const _settings: SettingsValues = LocalStorage.GetKey(localStorageKey, "settings"),
            wind = Util.CalculateWind(weatherData.data.weather.wind)

        _cityName.text(`${(!notFromCityList && cityName || weatherData.data.name)}, ${weatherData.data.country}`)
        _temperatureValue.text(`${lodash.round(weatherData.data.weather.temp.cur)}°C`)
        _weatherDescription.html(`${Util.CapitalizeFirstLetter(weatherData.data.weather.description)} &bull; &ShortUpArrow; ${lodash.round(weatherData.data.weather.temp.max)}°C &bull; &ShortDownArrow; ${lodash.round(weatherData.data.weather.temp.min)}°C`)
        _windSpeedValue.html(`${wind.speed} <span class="smallgray">km/h</span>`)
        _windGustSpeedValue.html(wind.gust ? `${wind.gust} <span class="smallgray">km/h</span>` : "N/A")
        _windDirectionDeg.html(Util.GetWindDirection(wind.deg).replace(/\s/, "<br>"))
        _windDirectionIcon.css("transform", `rotate(${wind.deg + 180}deg)`)
        _sunriseValue.text(Time.UnixTimestampToDateString(weatherData.data.astronomical.sunriseRaw, weatherData.data.timezoneOffset))
        _sunsetValue.text(Time.UnixTimestampToDateString(weatherData.data.astronomical.sunsetRaw, weatherData.data.timezoneOffset))
        _sunriseInValue.text(Time.TimeUntil(weatherData.data.astronomical.sunriseRaw, weatherData.data.timezoneOffset, true))
        _sunsetInValue.text(Time.TimeUntil(weatherData.data.astronomical.sunsetRaw, weatherData.data.timezoneOffset, true))
        _weatherIcon.attr("src", WeatherIcons.GetIcon(WeatherIcons.Icons[weatherData.data.weather.conditionId], weatherData.data.timezoneOffset, _settings.animated_weather_icons))
        _currentTime.text(Time.GetCurrentTimeWithTimezone(weatherData.data.timezoneOffset, 0))
        _humidityValue.html(`${weatherData.data.weather.humidity} <span class="smallgray">%</span>`)
        _airpressureValue.html(`${Util.NumberToFloatingPoint(weatherData.data.weather.pressure)} <span class="smallgray">mbar</span>`)
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
        _weatherForecastMiscItems.empty()
        _weatherForecastItems.get(0).scrollLeft = 0
        _weatherForecastMiscItems.get(0).scrollLeft = 0

        weatherApiData.data?.forecast?.forecastday.forEach((forecastday, index) => {
            forecastday.hour.forEach(hourWeatherData => {
                const _dataHour = new Date(hourWeatherData.time).getHours()

                // Hourly Weather Forecast Details (Temperature, ...)
                if (index === 0 && _dataHour >= _currentHour) {
                    const [_forecastItem, _forecastTemperatureValue, _forecastIcon, _forecastTimeValue, _rainChanceValue] = self.CreateForecastItem()
                    if (_dataHour === _currentHour) {
                        _forecastTimeValue.text(Strings[Languages[_settings.setting_language]]?.WEATHER_HOURLY_FORECAST_NOW)
                        _forecastTemperatureValue.text(`${lodash.round(_openWeatherData.data.weather.temp.cur || hourWeatherData.temp_c)}°C`)
                        _forecastIcon.attr("src", WeatherIcons.GetIcon(WeatherIcons.Icons[_openWeatherData.data.weather.conditionId], _openWeatherData.data.timezoneOffset, _settings.animated_weather_icons))
                    } else {
                        _forecastTemperatureValue.text(`${lodash.round(hourWeatherData.temp_c)}°C`)
                        _forecastTimeValue.text(Time.GetHourString(hourWeatherData.time, _openWeatherData.data.timezoneOffset))
                        _forecastIcon.attr("src", WeatherIcons.GetIcon(WeatherIcons.Icons[hourWeatherData.condition.code], _openWeatherData.data.timezoneOffset, _settings.animated_weather_icons, !!hourWeatherData.is_day))
                    }
                    if (hourWeatherData.chance_of_rain > 0) {
                        _rainChanceValue.html(`<span class="material-symbols-outlined">water_drop</span>${hourWeatherData.chance_of_rain} %`)
                    } else _rainChanceValue.html(`&zwnj;`)

                    _forecastItem.appendTo(_weatherForecastItems)
                } else if (index === 1) {
                    const [_forecastItem, _forecastTemperatureValue, _forecastIcon, _forecastTimeValue, _rainChanceValue] = self.CreateForecastItem()

                    _forecastTemperatureValue.text(`${lodash.round(hourWeatherData.temp_c)}°C`)
                    _forecastTimeValue.text(Time.GetHourString(hourWeatherData.time, _openWeatherData.data.timezoneOffset))
                    _forecastIcon.attr("src", WeatherIcons.GetIcon(WeatherIcons.Icons[hourWeatherData.condition.code], _openWeatherData.data.timezoneOffset, _settings.animated_weather_icons, !!hourWeatherData.is_day))
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
                        _forecastTimeValue.text(Time.GetHourString(hourWeatherData.time, _openWeatherData.data.timezoneOffset))
                    }

                    _forecastDetailItem.appendTo(_weatherForecastMiscItems)
                } else if (index === 1) {
                    const [_forecastDetailItem, _forecastWindspeedValue, _forecastWindDirectionIcon, _forecastTimeValue] = self.CreateForecastDetailItem()
                    _forecastWindspeedValue.html(`${lodash.round(hourWeatherData.wind_kph)}<span class="smallgray unitText">km/h</span>`)
                    _forecastWindDirectionIcon.css("transform", `rotate(${hourWeatherData.wind_degree + 180}deg)`)
                    _forecastTimeValue.text(Time.GetHourString(hourWeatherData.time, _openWeatherData.data.timezoneOffset))

                    _forecastDetailItem.appendTo(_weatherForecastMiscItems)
                }
            })
        })

        if (weatherApiData.data.alerts.alert.length > 0) {
            const alert: WeatherApiAlert = Util.RemoveDuplicatesByKey(weatherApiData.data.alerts.alert, "headline")[0]

            _weatherAlert.find(".weather-alert-headline").text(alert.headline.replace(/\(Alert\)/gm, ""))
            _weatherAlert.find(".weather-alert-desc").text(alert.desc)
            _weatherAlert.find(".weather-alert-time").text(`bis ${Time.ConvertIsoToReadableTime(alert.expires)}`)

            $(".weather-alert").removeClass("hide")

            _weatherAlert.find(".close-button").off("click")
            _weatherAlert.find(".close-button").on("click", () => {
                _weatherAlert.addClass("hide")
            })
        } else $(".weather-alert").addClass("hide")
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
        if (internal_error.internal_error) return notifications.error(`ApiError - ${response.status}`, `${internal_error.internal_error.message?.de || internal_error.internal_error.message}`)
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
    code: number,
    cached: boolean,
    internal_error?: InternalError,
    data: {
        lat: number;
        lon: number;
        dt: Date;
        dtRaw: number;
        name: string,
        country: string,
        timezoneOffset: number;
        weather: {
            temp: { cur: number, max: number, min: number };
            feelsLike: { cur: number };
            pressure: number;
            humidity: number;
            dewPoint: number | undefined;
            clouds: number;
            uvi: number | undefined;
            visibility: number;
            wind: WindData;
            rain: number;
            snow: number;
            conditionId: number;
            main: string;
            description: string;
            icon: {
                url: string;
                raw: string;
            };
        },
        astronomical: {
            sunrise: Date;
            sunriseRaw: number;
            sunset: Date;
            sunsetRaw: number;
        }
    }
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