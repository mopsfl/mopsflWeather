"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._weatherForecastItems = void 0;
const __1 = require("..");
const Time_1 = __importDefault(require("./Time"));
const WeatherApi_1 = __importDefault(require("./WeatherApi"));
const lodash = __importStar(require("lodash"));
const WeatherIcons_1 = __importDefault(require("./WeatherIcons"));
const LocalStorage_1 = __importDefault(require("./LocalStorage"));
const Languages_1 = __importDefault(require("./Languages"));
const Util_1 = __importDefault(require("./Util"));
const Strings_1 = __importDefault(require("./Strings"));
const API_URL_DEV = "http://localhost:6969/v1/mopsflWeather/", API_URL_PROD = "https://api.mopsfl.de/v1/mopsflWeather/";
const _weatherData = $(".weather-data"), _cityName = $(".weather-data-city-name"), _temperatureValue = $(".temperature-value"), _weatherDescription = $(".weather-description"), _windSpeedValue = $(".wind-speed-value"), _windGustSpeedValue = $(".windgust-speed-value"), _windDirectionIcon = $(".wind-direction-icon"), _windDirectionDeg = $(".wind-directiondeg"), _sunriseValue = $(".sunrise-value"), _sunsetValue = $(".sunset-value"), _sunriseInValue = $(".sunrise-in-value"), _sunsetInValue = $(".sunset-in-value"), _weatherIcon = $(".main-info-weather-icon"), _currentTime = $(".weather-data-current-time"), _humidityValue = $(".humidity-value"), _airpressureValue = $(".airpressure-value"), _uvIndexValue = $(".uvindex-value");
const _weatherForecastItems = $(".weather-forecast-items"), _weatherForecastMiscItems = $(".weather-forecast-misc-items"), _weatherForecastItemTemplate = $(".weather-forecast-item-template"), _weatherForecastMiscItemTemplate = $(".weather-forecast-misc-item-template");
exports._weatherForecastItems = _weatherForecastItems;
exports.default = {
    async SearchCity(name) {
        return await fetch((!__1._dev ? API_URL_PROD : API_URL_DEV) + `data/searchcity?name=${name}`).then(res => res.json()).catch(err => {
            __1.notifications.error("ApiError", err);
            console.error(err);
        });
    },
    async GetOpenWeatherData(args, useDefault) {
        if (!(args) && !useDefault)
            throw new Error("Missing <WeatherRequestArguments>");
        let _settings = LocalStorage_1.default.GetKey(__1.localStorageKey, "settings"), query = !useDefault ? `${(args.lat && args.lon) ? `lat=${args.lat}&lon=${args.lon}` : `location=${args.name}`}` : "";
        return await fetch((!__1._dev ? API_URL_PROD : API_URL_DEV) + `data/currentweather?${query}${_settings?.setting_language ? `&lang=${Languages_1.default[_settings?.setting_language]}` : ""}`).catch(err => {
            __1.notifications.error("ApiError", err);
            console.error(err);
        });
    },
    async GetWeatherApiData(args) {
        if (!(args))
            throw new Error("Missing <WeatherRequestArguments>");
        let _settings = LocalStorage_1.default.GetKey(__1.localStorageKey, "settings"), query = `${(args.lat && args.lon) ? `q=${args.lat},${args.lon}` : `q=${args.name}`}`;
        return await fetch((!__1._dev ? API_URL_PROD : API_URL_DEV) + `data/forecast?${query}&alerts=yes${_settings?.setting_language ? `&lang=${Languages_1.default[_settings?.setting_language]}` : ""}&days=2`).catch(err => {
            __1.notifications.error("ApiError", err);
            console.error(err);
        });
    },
    async UpdateOpenWeatherData(weatherDataResponse, cityName, notFromCityList) {
        if (!weatherDataResponse.ok)
            return WeatherApi_1.default.HandleFailedRequest(weatherDataResponse);
        const weatherData = await weatherDataResponse.json();
        if (weatherData.code !== 200 && weatherData.internal_error)
            return __1.notifications.error(weatherData.internal_error.code, "%weatherData.message%");
        const _settings = LocalStorage_1.default.GetKey(__1.localStorageKey, "settings"), wind = Util_1.default.CalculateWind(weatherData.data.weather.wind);
        _cityName.text(`${(!notFromCityList && cityName || weatherData.data.name)}, ${weatherData.data.country}`);
        _temperatureValue.text(`${lodash.round(weatherData.data.weather.temp.cur)}°C`);
        _weatherDescription.html(`${Util_1.default.CapitalizeFirstLetter(weatherData.data.weather.description)} &bull; &ShortUpArrow; ${lodash.round(weatherData.data.weather.temp.max)}°C &bull; &ShortDownArrow; ${lodash.round(weatherData.data.weather.temp.min)}°C`);
        _windSpeedValue.html(`${wind.speed} <span class="smallgray">km/h</span>`);
        _windGustSpeedValue.html(wind.gust ? `${wind.gust} <span class="smallgray">km/h</span>` : "N/A");
        _windDirectionDeg.html(Util_1.default.GetWindDirection(wind.deg).replace(/\s/, "<br>"));
        _windDirectionIcon.css("transform", `rotate(${wind.deg + 180}deg)`);
        _sunriseValue.text(Time_1.default.UnixTimestampToDateString(weatherData.data.astronomical.sunriseRaw, weatherData.data.timezoneOffset));
        _sunsetValue.text(Time_1.default.UnixTimestampToDateString(weatherData.data.astronomical.sunsetRaw, weatherData.data.timezoneOffset));
        _sunriseInValue.text(Time_1.default.TimeUntil(weatherData.data.astronomical.sunriseRaw, weatherData.data.timezoneOffset, true));
        _sunsetInValue.text(Time_1.default.TimeUntil(weatherData.data.astronomical.sunsetRaw, weatherData.data.timezoneOffset, true));
        _weatherIcon.attr("src", WeatherIcons_1.default.GetIcon(WeatherIcons_1.default.Icons[weatherData.data.weather.conditionId], weatherData.data.timezoneOffset, _settings.animated_weather_icons));
        _currentTime.text(Time_1.default.GetCurrentTimeWithTimezone(weatherData.data.timezoneOffset, 0));
        _humidityValue.html(`${weatherData.data.weather.humidity} <span class="smallgray">%</span>`);
        _airpressureValue.html(`${Util_1.default.NumberToFloatingPoint(weatherData.data.weather.pressure)} <span class="smallgray">mbar</span>`);
        _weatherData.removeClass("hide");
        LocalStorage_1.default.Set(__1.localStorageKey, "_openWeatherData", weatherData);
    },
    async UpdateWeatherApiData(weatherDataResponse) {
        if (!weatherDataResponse.ok)
            return WeatherApi_1.default.HandleFailedRequest(weatherDataResponse);
        const weatherData = await weatherDataResponse.json();
        _uvIndexValue.text(weatherData.data.current.uv);
        WeatherApi_1.default.UpdateForecastData(weatherData);
        LocalStorage_1.default.Set(__1.localStorageKey, "_weatherApiData", weatherData);
    },
    UpdateForecastData(weatherApiData) {
        const _settings = LocalStorage_1.default.GetKey(__1.localStorageKey, "settings");
        const _openWeatherData = LocalStorage_1.default.GetKey(__1.localStorageKey, "_openWeatherData");
        const _currentHour = new Date().getHours();
        _weatherForecastItems.empty();
        _weatherForecastItems.get(0).scrollLeft = 0;
        weatherApiData.data?.forecast?.forecastday.forEach((forecastday, index) => {
            forecastday.hour.forEach(hourWeatherData => {
                const _dataHour = new Date(hourWeatherData.time).getHours();
                // Hourly Weather Forecast Details (Temperature, ...)
                if (index === 0 && _dataHour >= _currentHour) {
                    const [_forecastItem, _forecastTemperatureValue, _forecastIcon, _forecastTimeValue, _rainChanceValue] = WeatherApi_1.default.CreateForecastItem();
                    if (_dataHour === _currentHour) {
                        _forecastTimeValue.text(Strings_1.default[Languages_1.default[_settings.setting_language]]?.WEATHER_HOURLY_FORECAST_NOW);
                        _forecastTemperatureValue.text(`${lodash.round(_openWeatherData.data.weather.temp.cur || hourWeatherData.temp_c)}°C`);
                        _forecastIcon.attr("src", WeatherIcons_1.default.GetIcon(WeatherIcons_1.default.Icons[_openWeatherData.data.weather.conditionId], _openWeatherData.data.timezoneOffset, _settings.animated_weather_icons));
                    }
                    else {
                        _forecastTemperatureValue.text(`${lodash.round(hourWeatherData.temp_c)}°C`);
                        _forecastTimeValue.text(Time_1.default.GetHourString(hourWeatherData.time, _openWeatherData.data.timezoneOffset));
                        _forecastIcon.attr("src", WeatherIcons_1.default.GetIcon(WeatherIcons_1.default.Icons[hourWeatherData.condition.code], _openWeatherData.data.timezoneOffset, _settings.animated_weather_icons, !!hourWeatherData.is_day));
                    }
                    if (hourWeatherData.chance_of_rain > 0) {
                        _rainChanceValue.html(`<span class="material-symbols-outlined">water_drop</span>${hourWeatherData.chance_of_rain} %`);
                    }
                    else
                        _rainChanceValue.html(`&zwnj;`);
                    _forecastItem.appendTo(_weatherForecastItems);
                }
                else if (index === 1) {
                    const [_forecastItem, _forecastTemperatureValue, _forecastIcon, _forecastTimeValue, _rainChanceValue] = WeatherApi_1.default.CreateForecastItem();
                    _forecastTemperatureValue.text(`${lodash.round(hourWeatherData.temp_c)}°C`);
                    _forecastTimeValue.text(Time_1.default.GetHourString(hourWeatherData.time, _openWeatherData.data.timezoneOffset));
                    _forecastIcon.attr("src", WeatherIcons_1.default.GetIcon(WeatherIcons_1.default.Icons[hourWeatherData.condition.code], _openWeatherData.data.timezoneOffset, _settings.animated_weather_icons, !!hourWeatherData.is_day));
                    if (hourWeatherData.chance_of_rain > 0) {
                        _rainChanceValue.html(`<span class="material-symbols-outlined">water_drop</span>${hourWeatherData.chance_of_rain} %`);
                    }
                    else
                        _rainChanceValue.html(`&zwnj;`);
                    _forecastItem.appendTo(_weatherForecastItems);
                }
                // Hourly Misc Forecast Details (Temperature, ...)
                if (index === 0 && _dataHour >= _currentHour) {
                    const [_forecastDetailItem, _forecastWindspeedValue, _forecastWindDirectionIcon, _forecastTimeValue] = WeatherApi_1.default.CreateForecastDetailItem();
                    _forecastWindspeedValue.html(`${lodash.round(hourWeatherData.wind_kph)}<span class="smallgray unitText">km/h</span>`);
                    _forecastWindDirectionIcon.css("transform", `rotate(${hourWeatherData.wind_degree + 180}deg)`);
                    if (_dataHour === _currentHour) {
                        _forecastTimeValue.text(Strings_1.default[Languages_1.default[_settings.setting_language]]?.WEATHER_HOURLY_FORECAST_NOW);
                    }
                    else {
                        _forecastTimeValue.text(Time_1.default.GetHourString(hourWeatherData.time, _openWeatherData.data.timezoneOffset));
                    }
                    _forecastDetailItem.appendTo(_weatherForecastMiscItems);
                }
                else if (index === 1) {
                    const [_forecastDetailItem, _forecastWindspeedValue, _forecastWindDirectionIcon, _forecastTimeValue] = WeatherApi_1.default.CreateForecastDetailItem();
                    _forecastWindspeedValue.html(`${lodash.round(hourWeatherData.wind_kph)}<span class="smallgray unitText">km/h</span>`);
                    _forecastWindDirectionIcon.css("transform", `rotate(${hourWeatherData.wind_degree + 180}deg)`);
                    _forecastTimeValue.text(Time_1.default.GetHourString(hourWeatherData.time, _openWeatherData.data.timezoneOffset));
                    _forecastDetailItem.appendTo(_weatherForecastMiscItems);
                }
            });
        });
    },
    CreateForecastItem() {
        const _forecastDetailItem = _weatherForecastItemTemplate.contents().clone(), _forecastTemperatureValue = _forecastDetailItem.find(".weather-forecast-temperature-value"), _forecastIcon = _forecastDetailItem.find(".weather-forecast-icon"), _forecastTimeValue = _forecastDetailItem.find(".weather-forecast-time-value"), _rainChanceValue = _forecastDetailItem.find(".weather-forecast-rain-chance");
        return [_forecastDetailItem, _forecastTemperatureValue, _forecastIcon, _forecastTimeValue, _rainChanceValue];
    },
    CreateForecastDetailItem() {
        const _forecastItem = _weatherForecastMiscItemTemplate.contents().clone(), _forecastWindspeedValue = _forecastItem.find(".weather-forecast-misc-windspeed-value"), _forecastWindDirectionIcon = _forecastItem.find(".weather-forecast-misc-wind-direction-icon"), _forecastTimeValue = _forecastItem.find(".weather-forecast-misc-time-value");
        return [_forecastItem, _forecastWindspeedValue, _forecastWindDirectionIcon, _forecastTimeValue];
    },
    async HandleFailedRequest(response) {
        const isJSON = response.headers.get("content-type").includes("application/json");
        if (!isJSON)
            return __1.notifications.error(`ApiError - ${response.status}`, `${response.statusText}`);
        const internal_error = await response.json();
        if (internal_error.internal_error)
            return __1.notifications.error(`ApiError - ${response.status}`, `${internal_error.internal_error.message?.de || internal_error.internal_error.message}`);
    }
};
