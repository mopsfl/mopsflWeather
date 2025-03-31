"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Time_1 = __importDefault(require("../Misc/Time"));
const Util_1 = __importDefault(require("../Misc/Util"));
const Global_1 = require("../Types/Global");
const Icons_1 = __importDefault(require("./Icons"));
const Loading_1 = __importDefault(require("./Loading"));
const Page_1 = __importDefault(require("./Page"));
const Strings_1 = __importDefault(require("./Strings"));
exports.default = {
    DisplayWeatherData(weatherData) {
        const wind = Util_1.default.CalculateWind(weatherData.current.weather.wind), temperature = Page_1.default.FormatTemperature(weatherData.current.weather.temp.cur);
        Global_1.App.elements.Values.CITY_NAME.text(`${weatherData.current.name}, ${weatherData.current.country}`);
        Global_1.App.elements.Values.TEMPERATURE_VALUE.html(Page_1.default.CreateTemperatureElement(weatherData.current.weather.temp.cur, temperature));
        Global_1.App.elements.Values.CURRENT_TIME.text(Time_1.default.GetCurrentTimeWithTimezone(weatherData.current.timezoneOffset, 0));
        Global_1.App.elements.Values.WIND_SPEED_VALUE.html(`${wind.speed} <span class="smallgray">km/h</span>`);
        Global_1.App.elements.Values.WIND_GUST_SPEED_VALUE.html(`${wind.gust} <span class="smallgray">km/h</span>`);
        Global_1.App.elements.Values.WIND_DIRECTION_ICON.css("transform", `rotate(${wind.deg + (wind.deg > 180 ? -180 : 180)}deg)`);
        Global_1.App.elements.Values.SUNRISE_VALUE.text(Time_1.default.UnixTimestampToDateString(weatherData.current.astronomical.sunriseRaw, weatherData.current.timezoneOffset));
        Global_1.App.elements.Values.SUNSET_VALUE.text(Time_1.default.UnixTimestampToDateString(weatherData.current.astronomical.sunsetRaw, weatherData.current.timezoneOffset));
        Global_1.App.elements.Values.UV_INDEX_VALUE.html(Page_1.default.CreateUVIndexElement(weatherData.current.weather.uvi));
        Global_1.App.elements.Values.HUMIDITY_VALUE.html(`${weatherData.current.weather.humidity} <span class="smallgray">%</span>`);
        Global_1.App.elements.Values.AIRPRESSURE_VALUE.html(`${Util_1.default.NumberToFloatingPoint(weatherData.current.weather.pressure)} <span class="smallgray">mbar</span>`);
        Global_1.App.elements.Values.WEATHER_ICON.attr("src", Icons_1.default.GetIcon(Icons_1.default.Icons[weatherData.current.weather.conditionId], weatherData.current.timezoneOffset));
        Global_1.App.elements.Values.SUNRISE_IN_VALUE.text(Time_1.default.TimeUntil(weatherData.current.astronomical.sunriseRaw, weatherData.current.timezoneOffset, true));
        Global_1.App.elements.Values.SUNSET_IN_VALUE.text(Time_1.default.TimeUntil(weatherData.current.astronomical.sunsetRaw, weatherData.current.timezoneOffset, true));
        Global_1.App.elements.Values.WEATHER_DESCRIPTION.html(`
            ${Util_1.default.CapitalizeFirstLetter(weatherData.current.weather.description)}
            ${Page_1.default.CreateWeatherDescriptionElement(weatherData.forecast[1].day.maxtemp_c, weatherData.forecast[1].day.mintemp_c)}
        `);
        Global_1.App.elements.Containers.WEATHER_DATA.removeClass("blur");
        Page_1.default.DisplayForecastData(weatherData.forecast, weatherData);
        Loading_1.default.Toggle(Global_1.App.elements.Misc.WEATHER_DATA_LOADING, false);
        M.Tooltip.init(Global_1.App.elements.Values.WEATHER_DESCRIPTION.find(".tooltipped"));
        Strings_1.default.Update();
    },
    DisplayForecastData(forecastData, weatherData) {
        const currentHour = new Date().getHours();
        const { FORECAST_ITEMS, FORECAST_MISC_ITEMS } = Global_1.App.elements.Forecast;
        FORECAST_ITEMS.empty();
        FORECAST_MISC_ITEMS.empty();
        FORECAST_ITEMS.get(0).scrollLeft = 0;
        FORECAST_MISC_ITEMS.get(0).scrollLeft = 0;
        forecastData.forEach((forecast, index) => {
            forecast.hour.forEach(hourData => {
                const dataHourTime = new Date(hourData.time).getHours();
                const isCurrentHour = dataHourTime === currentHour;
                const temperatureValue = isCurrentHour ? (weatherData.current.weather.temp.cur || hourData.temp_c) : hourData.temp_c;
                const formattedTemperature = Page_1.default.FormatTemperature(temperatureValue);
                if ((index === 0 && dataHourTime >= currentHour) || (index === 1 && dataHourTime < 24)) {
                    const [_forecastItem, _tempValue, _icon, _timeValue, _rainChance] = Page_1.default.CreateForecastItem();
                    _timeValue.text(isCurrentHour && index === 0 ? "Jetzt" : Time_1.default.GetHourString(hourData.time, weatherData.current.timezoneOffset));
                    _icon.attr("src", Page_1.default.CreateWeatherIcon(isCurrentHour && index === 0 ? weatherData.current.weather.conditionId : hourData.condition.code, weatherData.current.timezoneOffset, !!hourData.is_day));
                    _icon.attr("data-tooltip", Util_1.default.CapitalizeFirstLetter(hourData.condition.text));
                    _tempValue.html(Page_1.default.CreateTemperatureElement(temperatureValue, formattedTemperature));
                    _rainChance.html(Page_1.default.CreateRainChanceElement(hourData.chance_of_rain));
                    _forecastItem.appendTo(FORECAST_ITEMS);
                }
            });
        });
    },
    FormatTemperature(temperature) {
        const settings = Global_1.App.settings.GetSettings();
        return (settings.setting_tempunit || "Celsius") ===
            "Celsius" ? `${Math.round(temperature)}°C` :
            `${Math.round(Util_1.default.CelsiusToFahrenheit(temperature))}°F`;
    },
    UpdateTemperatureValues() {
        $(".__tempvalue").each((i, e) => {
            const element = $(e);
            element.text(Page_1.default.FormatTemperature(parseFloat(element.attr("data-temperature")) || 0));
        });
    },
    GetUVIndexLevel(uvindex) {
        const levels = Strings_1.default.Languages[Global_1.App.client.language].WEATHER_INFO_UVINDEX_LEVELS;
        if (uvindex <= 2)
            return [levels[2], 2];
        if (uvindex <= 5)
            return [levels[5], 5];
        if (uvindex <= 7)
            return [levels[7], 7];
        if (uvindex <= 10)
            return [levels[10], 10];
        return [levels[2], 2];
    },
    CreateForecastItem() {
        const _forecastDetailItem = Global_1.App.elements.Templates.FORECAST_ITEM.contents().clone(), _forecastTemperatureValue = _forecastDetailItem.find(".weather-forecast-temperature-value"), _forecastIcon = _forecastDetailItem.find(".weather-forecast-icon"), _forecastTimeValue = _forecastDetailItem.find(".weather-forecast-time-value"), _rainChanceValue = _forecastDetailItem.find(".weather-forecast-rain-chance");
        M.Tooltip.init(_forecastIcon);
        return [_forecastDetailItem, _forecastTemperatureValue, _forecastIcon, _forecastTimeValue, _rainChanceValue];
    },
    CreateTemperatureElement(rawTemperature, formattedTemperature) {
        return `<span class="__tempvalue" data-temperature="${rawTemperature}">${formattedTemperature}</span>`;
    },
    CreateRainChanceElement(chanceOfRain) {
        return chanceOfRain > 0 ? `<span class="material-symbols-outlined">water_drop</span>${chanceOfRain} %` : `&zwnj;`;
    },
    CreateUVIndexElement(uvi) {
        const [uvIndexLevel, keyIndex] = Page_1.default.GetUVIndexLevel(uvi);
        return `${Math.round(uvi)} <span class="smallgray" data-stringname="WEATHER_INFO_UVINDEX_LEVELS" data-stringindex="${keyIndex}">${uvIndexLevel}</span>`;
    },
    CreateWeatherDescriptionElement(maxTemp, minTemp) {
        return `&bull; &ShortUpArrow;
        <span class="__tempvalue smallgray tooltipped" data-stringname="TOOLTIP_HIGHEST_TEMPERATURE" data-temperature="${maxTemp}">${Page_1.default.FormatTemperature(maxTemp)}</span>
        &bull; &ShortDownArrow;
        <span class="__tempvalue smallgray tooltipped" data-stringname="TOOLTIP_LOWEST_TEMPERATURE" data-temperature="${minTemp}">${Page_1.default.FormatTemperature(minTemp)}</span>`;
    },
    CreateWeatherIcon(conditionId, timezoneOffset, isDay) {
        return Icons_1.default.GetIcon(Icons_1.default.Icons[conditionId], timezoneOffset, isDay);
    }
};
