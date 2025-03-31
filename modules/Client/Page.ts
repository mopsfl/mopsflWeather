import Time from "../Misc/Time";
import Util from "../Misc/Util";
import { App } from "../Types/Global";
import { Language } from "../Types/Language";
import { ForecastData, WeatherDataResponse } from "../Types/Weather";
import Icons from "./Icons";
import Loading from "./Loading";
import self from "./Page"
import { SettingsValues } from "./Settings";
import Strings from "./Strings";

export default {
    DisplayWeatherData(weatherData: WeatherDataResponse) {
        const wind = Util.CalculateWind(weatherData.current.weather.wind),
            temperature = self.FormatTemperature(weatherData.current.weather.temp.cur)

        App.elements.Values.CITY_NAME.text(`${weatherData.current.name}, ${weatherData.current.country}`)
        App.elements.Values.TEMPERATURE_VALUE.html(self.CreateTemperatureElement(weatherData.current.weather.temp.cur, temperature))
        App.elements.Values.CURRENT_TIME.text(Time.GetCurrentTimeWithTimezone(weatherData.current.timezoneOffset, 0))
        App.elements.Values.WIND_SPEED_VALUE.html(`${wind.speed} <span class="smallgray">km/h</span>`)
        App.elements.Values.WIND_GUST_SPEED_VALUE.html(`${wind.gust} <span class="smallgray">km/h</span>`)
        App.elements.Values.WIND_DIRECTION_ICON.css("transform", `rotate(${wind.deg + (wind.deg > 180 ? -180 : 180)}deg)`)
        App.elements.Values.SUNRISE_VALUE.text(Time.UnixTimestampToDateString(weatherData.current.astronomical.sunriseRaw, weatherData.current.timezoneOffset))
        App.elements.Values.SUNSET_VALUE.text(Time.UnixTimestampToDateString(weatherData.current.astronomical.sunsetRaw, weatherData.current.timezoneOffset))
        App.elements.Values.UV_INDEX_VALUE.html(self.CreateUVIndexElement(weatherData.current.weather.uvi))
        App.elements.Values.HUMIDITY_VALUE.html(`${weatherData.current.weather.humidity} <span class="smallgray">%</span>`)
        App.elements.Values.AIRPRESSURE_VALUE.html(`${Util.NumberToFloatingPoint(weatherData.current.weather.pressure)} <span class="smallgray">mbar</span>`)
        App.elements.Values.WEATHER_ICON.attr("src", Icons.GetIcon(Icons.Icons[weatherData.current.weather.conditionId], weatherData.current.timezoneOffset))
        App.elements.Values.SUNRISE_IN_VALUE.text(Time.TimeUntil(weatherData.current.astronomical.sunriseRaw, weatherData.current.timezoneOffset, true))
        App.elements.Values.SUNSET_IN_VALUE.text(Time.TimeUntil(weatherData.current.astronomical.sunsetRaw, weatherData.current.timezoneOffset, true))
        App.elements.Values.WEATHER_DESCRIPTION.html(`
            ${Util.CapitalizeFirstLetter(weatherData.current.weather.description)}
            ${self.CreateWeatherDescriptionElement(weatherData.forecast[1].day.maxtemp_c, weatherData.forecast[1].day.mintemp_c)}
        `)

        App.elements.Containers.WEATHER_DATA.removeClass("blur")
        self.DisplayForecastData(weatherData.forecast, weatherData)
        Loading.Toggle(App.elements.Misc.WEATHER_DATA_LOADING, false)
        M.Tooltip.init(App.elements.Values.WEATHER_DESCRIPTION.find(".tooltipped"))
        Strings.Update()
    },

    DisplayForecastData(forecastData: ForecastData, weatherData: WeatherDataResponse) {
        const currentHour = new Date().getHours();
        const { FORECAST_ITEMS, FORECAST_MISC_ITEMS } = App.elements.Forecast;

        FORECAST_ITEMS.empty();
        FORECAST_MISC_ITEMS.empty();
        FORECAST_ITEMS.get(0).scrollLeft = 0;
        FORECAST_MISC_ITEMS.get(0).scrollLeft = 0;

        forecastData.forEach((forecast, index) => {
            forecast.hour.forEach(hourData => {
                const dataHourTime = new Date(hourData.time).getHours();
                const isCurrentHour = dataHourTime === currentHour;
                const temperatureValue = isCurrentHour ? (weatherData.current.weather.temp.cur || hourData.temp_c) : hourData.temp_c;
                const formattedTemperature = self.FormatTemperature(temperatureValue);

                if ((index === 0 && dataHourTime >= currentHour) || (index === 1 && dataHourTime < 24)) {
                    const [_forecastItem, _tempValue, _icon, _timeValue, _rainChance] = self.CreateForecastItem();

                    _timeValue.text(isCurrentHour && index === 0 ? "Jetzt" : Time.GetHourString(hourData.time, weatherData.current.timezoneOffset));
                    _icon.attr("src", self.CreateWeatherIcon(
                        isCurrentHour && index === 0 ? weatherData.current.weather.conditionId : hourData.condition.code,
                        weatherData.current.timezoneOffset,
                        !!hourData.is_day
                    ));
                    _icon.attr("data-tooltip", Util.CapitalizeFirstLetter(hourData.condition.text))
                    _tempValue.html(self.CreateTemperatureElement(temperatureValue, formattedTemperature));
                    _rainChance.html(self.CreateRainChanceElement(hourData.chance_of_rain));

                    _forecastItem.appendTo(FORECAST_ITEMS);
                }
            });
        });
    },

    FormatTemperature(temperature: number) {
        const settings = App.settings.GetSettings()
        return (settings.setting_tempunit || "Celsius") ===
            "Celsius" ? `${Math.round(temperature)}°C` :
            `${Math.round(Util.CelsiusToFahrenheit(temperature))}°F`
    },

    UpdateTemperatureValues() {
        $(".__tempvalue").each((i, e) => {
            const element = $(e)
            element.text(self.FormatTemperature(parseFloat(element.attr("data-temperature")) || 0))
        })
    },

    GetUVIndexLevel(uvindex: number) {
        const levels = Strings.Languages[App.client.language].WEATHER_INFO_UVINDEX_LEVELS

        if (uvindex <= 2) return [levels[2], 2];
        if (uvindex <= 5) return [levels[5], 5];
        if (uvindex <= 7) return [levels[7], 7];
        if (uvindex <= 10) return [levels[10], 10];

        return [levels[2], 2];
    },

    CreateForecastItem() {
        const _forecastDetailItem = App.elements.Templates.FORECAST_ITEM.contents().clone(),
            _forecastTemperatureValue = _forecastDetailItem.find(".weather-forecast-temperature-value"),
            _forecastIcon = _forecastDetailItem.find(".weather-forecast-icon"),
            _forecastTimeValue = _forecastDetailItem.find(".weather-forecast-time-value"),
            _rainChanceValue = _forecastDetailItem.find(".weather-forecast-rain-chance")

        M.Tooltip.init(_forecastIcon)
        return [_forecastDetailItem, _forecastTemperatureValue, _forecastIcon, _forecastTimeValue, _rainChanceValue]
    },

    CreateTemperatureElement(rawTemperature: number, formattedTemperature: string) {
        return `<span class="__tempvalue" data-temperature="${rawTemperature}">${formattedTemperature}</span>`
    },

    CreateRainChanceElement(chanceOfRain: number) {
        return chanceOfRain > 0 ? `<span class="material-symbols-outlined">water_drop</span>${chanceOfRain} %` : `&zwnj;`
    },

    CreateUVIndexElement(uvi: number) {
        const [uvIndexLevel, keyIndex] = self.GetUVIndexLevel(uvi)

        return `${Math.round(uvi)} <span class="smallgray" data-stringname="WEATHER_INFO_UVINDEX_LEVELS" data-stringindex="${keyIndex}">${uvIndexLevel}</span>`
    },

    CreateWeatherDescriptionElement(maxTemp: number, minTemp: number) {
        return `&bull; &ShortUpArrow;
        <span class="__tempvalue smallgray tooltipped" data-stringname="TOOLTIP_HIGHEST_TEMPERATURE" data-temperature="${maxTemp}">${self.FormatTemperature(maxTemp)}</span>
        &bull; &ShortDownArrow;
        <span class="__tempvalue smallgray tooltipped" data-stringname="TOOLTIP_LOWEST_TEMPERATURE" data-temperature="${minTemp}">${self.FormatTemperature(minTemp)}</span>`
    },

    CreateWeatherIcon(conditionId: number, timezoneOffset: number, isDay: boolean) {
        return Icons.GetIcon(Icons.Icons[conditionId], timezoneOffset, isDay)
    }
}