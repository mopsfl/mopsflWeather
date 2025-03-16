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
const _weatherData = $(".weather-data"), _cityName = $(".weather-data-city-name"), _temperatureValue = $(".temperature-value"), _weatherDescription = $(".weather-description"), _windSpeedValue = $(".wind-speed-value"), _windGustSpeedValue = $(".windgust-speed-value"), _windDirectionIcon = $(".wind-direction-icon"), _windDirectionDeg = $(".wind-directiondeg"), _sunriseValue = $(".sunrise-value"), _sunsetValue = $(".sunset-value"), _sunriseInValue = $(".sunrise-in-value"), _sunsetInValue = $(".sunset-in-value"), _weatherIcon = $(".main-info-weather-icon"), _currentTime = $(".weather-data-current-time"), _humidityValue = $(".humidity-value"), _airpressureValue = $(".airpressure-value"), _uvIndexValue = $(".uvindex-value"), _weatherAlert = $(".weather-alert");
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
        const _settings = LocalStorage_1.default.GetKey(__1.localStorageKey, "settings"), wind = Util_1.default.CalculateWind(weatherData.data.weather.wind), temperature = WeatherApi_1.default.FormatTemperature(weatherData.data.weather.temp.cur, _settings);
        _cityName.text(`${(!notFromCityList && cityName || weatherData.data.name)}, ${weatherData.data.country}`);
        _temperatureValue.html(`<span class="__tempvalue" data-temperature="${weatherData.data.weather.temp.cur}">${temperature}</span>`);
        _weatherDescription.html(`${Util_1.default.CapitalizeFirstLetter(weatherData.data.weather.description)} &bull; &ShortUpArrow;
            <span class="__tempvalue smallgray tooltipped" data-stringname="TOOLTIP_HIGHEST_TEMPERATURE" data-temperature="${weatherData.data.weather.temp.max}">${WeatherApi_1.default.FormatTemperature(weatherData.data.weather.temp.max)}</span> &bull; &ShortDownArrow;
            <span class="__tempvalue smallgray tooltipped" data-stringname="TOOLTIP_LOWEST_TEMPERATURE" data-temperature="${weatherData.data.weather.temp.min}">${WeatherApi_1.default.FormatTemperature(weatherData.data.weather.temp.min)}</span>`);
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
        WeatherApi_1.default.UpdatePercentageDisplay("humidity-value", weatherData.data.weather.humidity);
        WeatherApi_1.default.UpdatePercentageDisplay("airpressure-value", WeatherApi_1.default.AirPressureToPercentage(weatherData.data.weather.pressure));
        LocalStorage_1.default.Set(__1.localStorageKey, "_openWeatherData", weatherData);
        M.Tooltip.init(_weatherDescription.find(".tooltipped"));
        Languages_1.default.UpdateStrings();
    },
    async UpdateWeatherApiData(weatherDataResponse) {
        if (!weatherDataResponse.ok)
            return WeatherApi_1.default.HandleFailedRequest(weatherDataResponse);
        const weatherData = await weatherDataResponse.json(), _settings = LocalStorage_1.default.GetKey(__1.localStorageKey, "settings");
        const [uvIndexLevel, keyIndex] = WeatherApi_1.default.GetUVIndexLevel(weatherData.data.current.uv, _settings);
        _uvIndexValue.html(`${lodash.round(weatherData.data.current.uv)} <span class="smallgray" data-stringname="WEATHER_INFO_UVINDEX_LEVELS" data-stringindex="${keyIndex}">${uvIndexLevel}</span>`);
        WeatherApi_1.default.UpdatePercentageDisplay("uvindex-value", (weatherData.data.current.uv / 11) * 100);
        WeatherApi_1.default.UpdateForecastData(weatherData);
        LocalStorage_1.default.Set(__1.localStorageKey, "_weatherApiData", weatherData);
    },
    UpdateForecastData(weatherApiData) {
        const _settings = LocalStorage_1.default.GetKey(__1.localStorageKey, "settings");
        const _openWeatherData = LocalStorage_1.default.GetKey(__1.localStorageKey, "_openWeatherData");
        const _currentHour = new Date().getHours();
        _weatherForecastItems.empty();
        _weatherForecastMiscItems.empty();
        _weatherForecastItems.get(0).scrollLeft = 0;
        _weatherForecastMiscItems.get(0).scrollLeft = 0;
        weatherApiData.data?.forecast?.forecastday.forEach((forecastday, index) => {
            forecastday.hour.forEach(hourWeatherData => {
                const _dataHour = new Date(hourWeatherData.time).getHours();
                // Hourly Weather Forecast Details (Temperature, ...)
                if (index === 0 && _dataHour >= _currentHour) {
                    const [_forecastItem, _forecastTemperatureValue, _forecastIcon, _forecastTimeValue, _rainChanceValue] = WeatherApi_1.default.CreateForecastItem(), temperatureValue = _dataHour === _currentHour ? (_openWeatherData.data.weather.temp.cur || hourWeatherData.temp_c) : hourWeatherData.temp_c;
                    let temperature = WeatherApi_1.default.FormatTemperature(temperatureValue, _settings);
                    if (_dataHour === _currentHour) {
                        _forecastTimeValue.text(Strings_1.default[Languages_1.default[_settings.setting_language]]?.WEATHER_HOURLY_FORECAST_NOW);
                        _forecastTemperatureValue.html(`<span class="__tempvalue" data-temperature="${temperatureValue}">${temperature}</span>`);
                        _forecastIcon.attr("src", WeatherIcons_1.default.GetIcon(WeatherIcons_1.default.Icons[_openWeatherData.data.weather.conditionId], _openWeatherData.data.timezoneOffset, _settings.animated_weather_icons));
                    }
                    else {
                        _forecastTemperatureValue.html(`<span class="__tempvalue" data-temperature="${temperatureValue}">${temperature}</span>`);
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
                    let temperature = WeatherApi_1.default.FormatTemperature(hourWeatherData.temp_c, _settings);
                    _forecastTemperatureValue.html(`<span class="__tempvalue" data-temperature="${hourWeatherData.temp_c}">${temperature}</span>`);
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
        if (weatherApiData.data.alerts.alert.length > 0) {
            const alert = Util_1.default.RemoveDuplicatesByKey(weatherApiData.data.alerts.alert, "headline")[0];
            _weatherAlert.find(".weather-alert-headline").text(alert.headline.replace(/\(Alert\)/gm, ""));
            _weatherAlert.find(".weather-alert-desc").text(alert.desc);
            _weatherAlert.find(".weather-alert-time").text(`bis ${Time_1.default.ConvertIsoToReadableTime(alert.expires)}`);
            $(".weather-alert").removeClass("hide");
            _weatherAlert.find(".close-button").off("click");
            _weatherAlert.find(".close-button").on("click", () => {
                _weatherAlert.addClass("hide");
            });
        }
        else
            $(".weather-alert").addClass("hide");
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
    },
    FormatTemperature(temperature, settings) {
        return (settings?.setting_tempunit || "Celsius") ===
            "Celsius" ? `${lodash.round(temperature)}°C` :
            `${lodash.round(Util_1.default.CelsiusToFahrenheit(temperature))}°F`;
    },
    UpdatePercentageDisplay(id, value) {
        const percentageDisplayElement = $(`#${id}`), percentageValueElement = percentageDisplayElement.find(".percentage");
        if (!percentageDisplayElement || !percentageValueElement)
            return;
        percentageValueElement.css("height", `${value}%`).css("background-color", percentageValueElement.attr("data-bgcolor"));
    },
    AirPressureToPercentage(pressure) {
        // no clue if this makes sense displaying "low" and "high" air pressure ;-;
        const minPressure = 950;
        const maxPressure = 1060;
        if (pressure < minPressure)
            pressure = minPressure;
        if (pressure > maxPressure)
            pressure = maxPressure;
        return ((pressure - minPressure) / (maxPressure - minPressure)) * 100;
    },
    GetUVIndexLevel(uvindex, settings) {
        const language = Languages_1.default[settings?.setting_language] || "de", levels = Strings_1.default[language].WEATHER_INFO_UVINDEX_LEVELS;
        if (uvindex <= 2)
            return [levels[2], 2];
        if (uvindex <= 5)
            return [levels[5], 5];
        if (uvindex <= 7)
            return [levels[7], 7];
        if (uvindex <= 10)
            return [levels[10], 10];
        return [levels[11], 11];
    }
};
