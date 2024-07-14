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
const __1 = require("..");
const Time_1 = __importDefault(require("./Time"));
const WeatherApi_1 = __importDefault(require("./WeatherApi"));
const lodash = __importStar(require("lodash"));
const API_URL_DEV = "http://localhost:6968/v1/", API_URL_PROD = "https://mopsflweather.mopsfl.de/v1/";
const windDirections = {
    en: ["from the North", "from the North-Northeast", "from the Northeast", "from the East-Northeast", "from the East", "from the East-Southeast", "from the Southeast", "from the South-Southeast", "from the South", "from the South-Southwest", "from the Southwest", "from the West-Southwest", "from the West", "from the West-Northwest", "from the Northwest", "from the North-Northwest"],
    de: ["aus Norden", "aus Nord-Nordosten", "aus Nordosten", "aus Ost-Nordosten", "aus Osten", "aus Ost-Südosten", "aus Südosten", "aus Süd-Südosten", "aus Süden", "aus Süd-Südwesten", "aus Südwesten", "aus West-Südwesten", "aus Westen", "aus West-Nordwesten", "aus Nordwesten", "aus Nord-Nordwesten"]
};
const _weatherData = $(".weather-data"), _cityName = $(".weather-data-city-name"), _temperatureValue = $(".temperature-value"), _weatherDescription = $(".weather-description"), _windSpeedValue = $(".wind-speed-value"), _windGustSpeedValue = $(".windgust-speed-value"), _windDirectionIcon = $(".wind-direction-icon"), _windDirectionDeg = $(".wind-directiondeg"), _sunriseValue = $(".sunrise-value"), _sunsetValue = $(".sunset-value"), _sunriseInValue = $(".sunrise-in-value"), _sunsetInValue = $(".sunset-in-value");
exports.default = {
    async SearchCity(name) {
        return await fetch((!__1._dev ? API_URL_PROD : API_URL_DEV) + `data/searchcity?name=${name}`).then(res => res.json()).catch(err => {
            window.toastr.error(err, "ApiError");
            console.error(err);
        });
    },
    async GetWeatherData(args) {
        if (!(args))
            throw new Error("Missing <WeatherRequestArguments>");
        return await fetch((!__1._dev ? API_URL_PROD : API_URL_DEV) + `data/currentweather?${(args.lat && args.lon) ? `lat=${args.lat}&lon=${args.lon}` : `name=${args.name}`}`).then(res => res.json()).catch(err => {
            window.toastr.error(err, "ApiError");
            console.error(err);
        });
    },
    UpdateWeatherData(weatherData, cityName) {
        if (weatherData.code !== 200 && weatherData.internal_error)
            return window.toastr.error(weatherData.internal_error.message.en, weatherData.internal_error.error);
        const wind = WeatherApi_1.default.CalculateWind(weatherData.data.wind);
        _cityName.text(`${cityName || weatherData.data.name}, ${weatherData.data.sys.country}`);
        _temperatureValue.text(`${lodash.round(weatherData.data.main.temp)}°C`);
        _weatherDescription.text(weatherData.data.weather[0].description);
        _windSpeedValue.text(`${wind.speed}km/h`);
        _windGustSpeedValue.text(wind.gust ? `${wind.gust}km/h` : "N/A");
        _windDirectionDeg.html(WeatherApi_1.default.GetWindDirection(wind.deg).replace(/\s/, "<br>"));
        _windDirectionIcon.css("transform", `rotate(${wind.deg + 180}deg)`);
        _sunriseValue.text(WeatherApi_1.default.UnixTimestampToDateString(weatherData.data.sys.sunrise));
        _sunsetValue.text(WeatherApi_1.default.UnixTimestampToDateString(weatherData.data.sys.sunset));
        _sunriseInValue.text(Time_1.default.TimeUntil(weatherData.data.sys.sunrise, true));
        _sunsetInValue.text(Time_1.default.TimeUntil(weatherData.data.sys.sunset, true));
        _weatherData.removeClass("hide");
    },
    CalculateWind(windData) {
        const calc_wd = lodash.clone(windData);
        calc_wd.speed = lodash.round(calc_wd.speed * 3.16, 0);
        calc_wd.gust = lodash.round(calc_wd.gust * 3.16, 0);
        return calc_wd;
    },
    GetWindDirection(degrees) {
        return __1.languageStrings.WEATHER_INFO_WIND_DIRECTIONS[Math.round(degrees % 360 / 22.5) % 16];
    },
    UnixTimestampToDateString(unixTimestamp, full) {
        const date = new Date(unixTimestamp * 1000);
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);
        const seconds = ('0' + date.getSeconds()).slice(-2);
        return full ? `${year}-${month}-${day} ${hours}:${minutes}:${seconds}` : `${hours}:${minutes}`;
    }
};
