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
const API_URL_DEV = "http://localhost:6968/v1/", API_URL_PROD = "https://mopsflweather.mopsfl.de/v1/";
const windDirections = {
    en: ["from the North", "from the North-Northeast", "from the Northeast", "from the East-Northeast", "from the East", "from the East-Southeast", "from the Southeast", "from the South-Southeast", "from the South", "from the South-Southwest", "from the Southwest", "from the West-Southwest", "from the West", "from the West-Northwest", "from the Northwest", "from the North-Northwest"],
    de: ["aus Norden", "aus Nord-Nordosten", "aus Nordosten", "aus Ost-Nordosten", "aus Osten", "aus Ost-Südosten", "aus Südosten", "aus Süd-Südosten", "aus Süden", "aus Süd-Südwesten", "aus Südwesten", "aus West-Südwesten", "aus Westen", "aus West-Nordwesten", "aus Nordwesten", "aus Nord-Nordwesten"]
};
const _weatherData = $(".weather-data"), _cityName = $(".weather-data-city-name"), _temperatureValue = $(".temperature-value"), _weatherDescription = $(".weather-description"), _windSpeedValue = $(".wind-speed-value"), _windGustSpeedValue = $(".windgust-speed-value"), _windDirectionIcon = $(".wind-direction-icon"), _windDirectionDeg = $(".wind-directiondeg"), _sunriseValue = $(".sunrise-value"), _sunsetValue = $(".sunset-value"), _sunriseInValue = $(".sunrise-in-value"), _sunsetInValue = $(".sunset-in-value"), _weatherIcon = $(".main-info-weather-icon"), _currentTime = $(".weather-data-current-time"), _humidityValue = $(".humidity-value"), _airpressureValue = $(".airpressure-value"), _uvIndexValue = $(".uvindex-value");
const _weatherForecastItems = $(".weather-forecast-items"), _weatherForecastItemTemplate = $(".weather-forecast-item-template");
exports._weatherForecastItems = _weatherForecastItems;
exports.default = {
    async SearchCity(name) {
        return await fetch((!__1._dev ? API_URL_PROD : API_URL_DEV) + `data/searchcity?name=${name}`).then(res => res.json()).catch(err => {
            toastr.error(err, "ApiError");
            console.error(err);
        });
    },
    async GetOpenWeatherData(args, useDefault) {
        if (!(args) && !useDefault)
            throw new Error("Missing <WeatherRequestArguments>");
        let _settings = LocalStorage_1.default.GetKey(__1.localStorageKey, "settings"), query = !useDefault ? `${(args.lat && args.lon) ? `lat=${args.lat}&lon=${args.lon}` : `location=${args.name}`}` : "";
        return await fetch((!__1._dev ? API_URL_PROD : API_URL_DEV) + `data/currentweather?${query}${_settings?.setting_language ? `&lang=${Languages_1.default[_settings?.setting_language]}` : ""}`).then(res => res.json()).catch(err => {
            toastr.error(err, "ApiError");
            console.error(err);
        });
    },
    async GetWeatherApiData(args) {
        if (!(args))
            throw new Error("Missing <WeatherRequestArguments>");
        let _settings = LocalStorage_1.default.GetKey(__1.localStorageKey, "settings"), query = `${(args.lat && args.lon) ? `q=${args.lat},${args.lon}` : `q=${args.name}`}`;
        return await fetch((!__1._dev ? API_URL_PROD : API_URL_DEV) + `data/weatherapi/forecast?${query}&alerts=yes${_settings?.setting_language ? `&lang=${Languages_1.default[_settings?.setting_language]}` : ""}&days=2`).then(res => res.json()).catch(err => {
            toastr.error(err, "ApiError");
            console.error(err);
        });
    },
    UpdateOpenWeatherData(weatherData, cityName, notFromCityList) {
        if (weatherData.code !== 200 && weatherData.internal_error)
            return toastr.error(weatherData.internal_error.message.en, weatherData.internal_error.error);
        const _settings = LocalStorage_1.default.GetKey(__1.localStorageKey, "settings"), wind = Util_1.default.CalculateWind(weatherData.data.wind), weather = weatherData.data.weather[0];
        _cityName.text(`${(!notFromCityList && cityName) || weatherData.data.name}, ${weatherData.data.sys.country}`);
        _temperatureValue.text(`${lodash.round(weatherData.data.main.temp)}°C`);
        _weatherDescription.html(`${Util_1.default.CapitalizeFirstLetter(weather.description)} &bull; &ShortUpArrow; ${lodash.round(weatherData.data.main.temp_max)}°C &bull; &ShortDownArrow; ${lodash.round(weatherData.data.main.temp_min)}°C`);
        _windSpeedValue.text(`${wind.speed}km/h`);
        _windGustSpeedValue.text(wind.gust ? `${wind.gust}km/h` : "N/A");
        _windDirectionDeg.html(Util_1.default.GetWindDirection(wind.deg).replace(/\s/, "<br>"));
        _windDirectionIcon.css("transform", `rotate(${wind.deg + 180}deg)`);
        _sunriseValue.text(Time_1.default.UnixTimestampToDateString(weatherData.data.sys.sunrise, weatherData.data.timezone));
        _sunsetValue.text(Time_1.default.UnixTimestampToDateString(weatherData.data.sys.sunset, weatherData.data.timezone));
        _sunriseInValue.text(Time_1.default.TimeUntil(weatherData.data.sys.sunrise, weatherData.data.timezone, true));
        _sunsetInValue.text(Time_1.default.TimeUntil(weatherData.data.sys.sunset, weatherData.data.timezone, true));
        _weatherIcon.attr("src", WeatherIcons_1.default.GetIcon(WeatherIcons_1.default.Icons[weather.id], weatherData.data.timezone, _settings.animated_weather_icons));
        _currentTime.text(Time_1.default.GetCurrentTimeWithTimezone(weatherData.data.timezone, 0));
        _humidityValue.html(`${weatherData.data.main.humidity} <span class="smallgray">%</span>`);
        _airpressureValue.html(`${Util_1.default.NumberToFloatingPoint(weatherData.data.main.pressure)} <span class="smallgray">mbar</span>`);
        _weatherData.removeClass("hide");
        LocalStorage_1.default.Set(__1.localStorageKey, "_openWeatherData", weatherData);
    },
    UpdateWeatherApiData(weatherData) {
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
                if (index === 0 && _dataHour >= _currentHour) {
                    const [_forecastItem, _forecastTemperatureValue, _forecastIcon, _weatherForecastTimeValue, _rainChanceValue] = WeatherApi_1.default.CreateForecastItem();
                    if (_dataHour === _currentHour) {
                        _weatherForecastTimeValue.text(Strings_1.default[Languages_1.default[_settings.setting_language]].WEATHER_HOURLY_FORECAST_NOW);
                        _forecastTemperatureValue.text(`${lodash.round(_openWeatherData.data.main.temp || hourWeatherData.temp_c)}°C`);
                        _forecastIcon.attr("src", WeatherIcons_1.default.GetIcon(WeatherIcons_1.default.Icons[_openWeatherData.data.weather[0].id], _openWeatherData.data.timezone, _settings.animated_weather_icons));
                    }
                    else {
                        _forecastTemperatureValue.text(`${lodash.round(hourWeatherData.temp_c)}°C`);
                        _weatherForecastTimeValue.text(Time_1.default.GetHourString(hourWeatherData.time, _openWeatherData.data.timezone));
                        _forecastIcon.attr("src", WeatherIcons_1.default.GetIcon(WeatherIcons_1.default.Icons[hourWeatherData.condition.code], _openWeatherData.data.timezone, _settings.animated_weather_icons, !!hourWeatherData.is_day));
                    }
                    if (hourWeatherData.chance_of_rain > 0) {
                        _rainChanceValue.html(`<span class="material-symbols-outlined">water_drop</span>${hourWeatherData.chance_of_rain} %`);
                    }
                    else
                        _rainChanceValue.html(`&zwnj;`);
                    _forecastItem.appendTo(_weatherForecastItems);
                }
                else if (index === 1) {
                    const [_forecastItem, _forecastTemperatureValue, _forecastIcon, _weatherForecastTimeValue, _rainChanceValue] = WeatherApi_1.default.CreateForecastItem();
                    _forecastTemperatureValue.text(`${lodash.round(hourWeatherData.temp_c)}°C`);
                    _weatherForecastTimeValue.text(Time_1.default.GetHourString(hourWeatherData.time, _openWeatherData.data.timezone));
                    _forecastIcon.attr("src", WeatherIcons_1.default.GetIcon(WeatherIcons_1.default.Icons[hourWeatherData.condition.code], _openWeatherData.data.timezone, _settings.animated_weather_icons, !!hourWeatherData.is_day));
                    if (hourWeatherData.chance_of_rain > 0) {
                        _rainChanceValue.html(`<span class="material-symbols-outlined">water_drop</span>${hourWeatherData.chance_of_rain} %`);
                    }
                    else
                        _rainChanceValue.html(`&zwnj;`);
                    _forecastItem.appendTo(_weatherForecastItems);
                }
            });
        });
    },
    CreateForecastItem() {
        const _forecastItem = _weatherForecastItemTemplate.contents().clone(), _forecastTemperatureValue = _forecastItem.find(".weather-forecast-temperature-value"), _forecastIcon = _forecastItem.find(".weather-forecast-icon"), _weatherForecastTimeValue = _forecastItem.find(".weather-forecast-time-value"), _rainChanceValue = _forecastItem.find(".weather-forecast-rain-chance");
        return [_forecastItem, _forecastTemperatureValue, _forecastIcon, _weatherForecastTimeValue, _rainChanceValue];
    },
};
