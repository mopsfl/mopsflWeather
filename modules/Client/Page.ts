import Time from "../Misc/Time";
import Util from "../Misc/Util";
import { App } from "../Types/Global";
import { ForecastHourlyData, WeatherData, WeatherRequestArguments, WindData } from "../Types/Weather";
import Icons from "./Icons";
import Loading from "./Loading";
import Strings from "./Strings";
import $ from "jquery"
import M from "materialize-css"

export default {
    _forecastTooltips: [] as Array<M.Tooltip[]>,

    DisplayWeatherData(weatherData: WeatherData, requestArguments?: WeatherRequestArguments) {
        const city = weatherData.meta.city ?? (!requestArguments?.unknownName ? (requestArguments?.name) : "N/A")

        const currentHour = new Date(new Date().getTime() + weatherData.meta.utcOffset * 1000).getUTCHours()

        const windSpeed = Math.round(weatherData.current.wind_speed),
            gustSpeed = Math.round(weatherData.current.wind_gusts),
            windDirection = weatherData.current.wind_direction

        const currentHourData = weatherData.hourly.slice(currentHour, currentHour + 1)[0]

        App.elements.Values.CITY_NAME.text(`${city}, ${weatherData.meta.country_code.toUpperCase()}`)
        App.elements.Values.TEMPERATURE_VALUE.html(this.CreateTemperatureElement(weatherData.current.temperature, this.FormatTemperature(weatherData.current.temperature)))
        App.elements.Values.CURRENT_TIME.text(Time.ParseTimeWithUtcOffset(undefined, weatherData.meta.utcOffset))
        App.elements.Values.WIND_DIRECTION_DEG.text(this.GetWindDirection(windDirection))
        App.elements.Values.WIND_SPEED_VALUE.html(`${windSpeed} <span class="smallgray">km/h</span>`)
        App.elements.Values.WIND_GUST_SPEED_VALUE.html(`${gustSpeed} <span class="smallgray">km/h</span>`)
        App.elements.Values.WIND_DIRECTION_ICON.css("transform", `rotate(${windDirection + (windDirection > 180 ? -180 : 180)}deg)`)
        App.elements.Values.SUNRISE_VALUE.text(Time.UnixTimestampToDateString(weatherData.daily[0].sunrise))
        App.elements.Values.SUNSET_VALUE.text(Time.UnixTimestampToDateString(weatherData.daily[0].sunset))
        App.elements.Values.UV_INDEX_VALUE.html(this.CreateUVIndexElement(currentHourData.uv_index))
        App.elements.Values.HUMIDITY_VALUE.html(`${Math.round(weatherData.current.humidity)} <span class="smallgray">%</span>`)
        App.elements.Values.AIRPRESSURE_VALUE.html(`${Util.NumberToFloatingPoint(Math.round(weatherData.current.surface_pressure))} <span class="smallgray">mbar</span>`)
        App.elements.Values.WEATHER_ICON.attr("src", Icons.GetIcon(Icons.Icons[weatherData.current.weather_code], weatherData.meta.utcOffset, weatherData.current.is_day === 1))

        App.elements.Values.SUNRISE_IN_VALUE.text(Time.TimeUntil(new Date(weatherData.daily[0].sunrise).getTime(), weatherData.meta.utcOffset))
        App.elements.Values.SUNSET_IN_VALUE.text(Time.TimeUntil(new Date(weatherData.daily[0].sunset).getTime(), weatherData.meta.utcOffset))

        App.elements.Values.WEATHER_DESCRIPTION.html(`<span data-stringname="WEATHER_DESCRIPTIONS" data-weather-code="${weatherData.current.weather_code}">
            <span>${Strings.GetString("WEATHER_DESCRIPTIONS")[weatherData.current.weather_code]}</span></span>
            ${this.CreateWeatherDescriptionElement(weatherData.daily[0].temperature_max, weatherData.daily[0].temperature_min)}
        </span>`)

        this.UpdatePercentageDisplay("humidity-value", weatherData.current.humidity)
        this.UpdatePercentageDisplay("uvindex-value", (currentHourData.uv_index / 11) * 100)
        this.UpdatePercentageDisplay("airpressure-value", this.AirPressureToPercentage(weatherData.current.surface_pressure))

        App.elements.Containers.WEATHER_DATA.removeClass("blur")

        this.DisplayForecastData(weatherData.hourly, weatherData)
        this.DisplayHourDetails(weatherData.hourly, weatherData)

        Loading.Toggle(App.elements.Misc.WEATHER_DATA_LOADING, false)
        M.Tooltip.init(App.elements.Values.WEATHER_DESCRIPTION.find(".tooltipped"))
        Strings.Update()
    },

    DisplayForecastData(forecastData: ForecastHourlyData[], weatherData: WeatherData) {
        const currentHour = new Date(new Date().getTime() + weatherData.meta.utcOffset * 1000).getUTCHours()
        const { FORECAST_ITEMS } = App.elements.Forecast

        this._forecastTooltips.forEach((tooltip: M.Tooltip[]) => {
            tooltip[0]?.destroy()
        }); this._forecastTooltips = []

        FORECAST_ITEMS.empty()
        FORECAST_ITEMS.get(0).scrollLeft = 0

        forecastData.slice(currentHour, currentHour + 25).forEach((hourData, index) => {
            const dataTime = new Date(hourData.time)
            const isCurrentHour = dataTime.getUTCHours() === currentHour
            const [_forecastItem, _tempValue, _icon, _timeValue, _rainChance] = this.CreateForecastItem(App.elements.Templates.FORECAST_ITEM)

            _timeValue.text(isCurrentHour && index === 0 ? "Jetzt" : Time.ParseTimeWithUtcOffset(hourData.time, weatherData.meta.utcOffset))
            _tempValue.html(this.CreateTemperatureElement(hourData.temperature, this.FormatTemperature(hourData.temperature)))
            _rainChance.html(this.CreateRainChanceElement(Math.round(hourData.precipitation / 10) * 10))

            _icon.attr("data-tooltip", Strings.GetString("WEATHER_DESCRIPTIONS")[hourData.weather_code])
            _icon.attr("src", this.CreateWeatherIcon(hourData.weather_code, weatherData.meta.utcOffset, hourData.is_day === 1))

            _forecastItem.appendTo(FORECAST_ITEMS)
        })
    },

    DisplayHourDetails(forecastData: ForecastHourlyData[], weatherData: WeatherData) {
        const currentHour = new Date(new Date().getTime() + weatherData.meta.utcOffset * 1000).getUTCHours()
        const { FORECAST_MISC_ITEMS } = App.elements.Forecast

        FORECAST_MISC_ITEMS.empty()
        FORECAST_MISC_ITEMS.get(0).scrollLeft = 0

        forecastData.slice(currentHour, currentHour + 25).forEach((hourData, index) => {
            const dataTime = new Date(hourData.time)
            const isCurrentHour = dataTime.getUTCHours() === currentHour
            const [_forecastItem, _valueElement, _icon, _timeValue, _rainChance] = this.CreateForecastItem(App.elements.Templates.MISC_FORECAST_ITEM)

            _timeValue.text(isCurrentHour && index === 0 ? "Jetzt" : Time.ParseTimeWithUtcOffset(hourData.time, weatherData.meta.utcOffset))
            _icon.css("transform", `rotate(${hourData.wind_direction + (hourData.wind_direction > 180 ? -180 : 180)}deg)`)
            _icon.attr("data-tooltip", this.GetWindDirection(hourData.wind_direction))
            _valueElement.html(`${Math.round(hourData.wind_speed)}<br><span class="smallgray smalltext2">km/h</span>`)

            _forecastItem.appendTo(FORECAST_MISC_ITEMS)
        })
    },

    FormatTemperature(temperature: number) {
        const settings = App.settings.GetSettings()
        return (settings.setting_tempunit || "Celsius") ===
            "Celsius" ? `${Math.floor(temperature)}°C` :
            `${Math.round(Util.CelsiusToFahrenheit(temperature))}°F`
    },

    UpdateTemperatureValues() {
        $(".__tempvalue").each((i, e) => {
            const element = $(e)
            element.text(this.FormatTemperature(parseFloat(element.attr("data-temperature")) || 0))
        })
    },

    UpdatePercentageDisplay(id: string, value: number) {
        const percentageDisplayElement = $(`#${id}`),
            percentageValueElement = percentageDisplayElement.find(".percentage")
        if (!percentageDisplayElement || !percentageValueElement) return

        percentageValueElement.css("height", `${value}%`).css("background-color", percentageValueElement.attr("data-bgcolor"))
    },

    AirPressureToPercentage(pressure: number) {
        const minPressure = 950;
        const maxPressure = 1060;

        if (pressure < minPressure) pressure = minPressure;
        if (pressure > maxPressure) pressure = maxPressure;

        return ((pressure - minPressure) / (maxPressure - minPressure)) * 100;
    },

    GetUVIndexLevel(uvindex: number) {
        const levels = Strings.Languages[App.client.language].WEATHER_INFO_UVINDEX_LEVELS

        if (uvindex <= 2) return [levels[2], 2];
        if (uvindex <= 5) return [levels[5], 5];
        if (uvindex <= 7) return [levels[7], 7];
        if (uvindex <= 10) return [levels[10], 10];

        return [levels[2], 2];
    },

    GetWindDirection(degrees: number) {
        return Strings.Languages[App.client.language].WEATHER_INFO_WIND_DIRECTIONS[Math.round(degrees % 360 / 22.5) % 16];
    },

    CreateForecastItem(item_template: JQuery<HTMLElement>) {
        const _forecastDetailItem = item_template.contents().clone(),
            _forecastTemperatureValue = _forecastDetailItem.find(".weather-forecast-value"),
            _forecastIcon = _forecastDetailItem.find(".weather-forecast-icon"),
            _forecastTimeValue = _forecastDetailItem.find(".weather-forecast-time-value"),
            _rainChanceValue = _forecastDetailItem.find(".weather-forecast-rain-chance")

        this._forecastTooltips.push(M.Tooltip.init(_forecastIcon))
        return [_forecastDetailItem, _forecastTemperatureValue, _forecastIcon, _forecastTimeValue, _rainChanceValue]
    },

    CreateTemperatureElement(rawTemperature: number, formattedTemperature: string) {
        return `<span class="__tempvalue" data-temperature="${rawTemperature}">${formattedTemperature}</span>`
    },

    CreateRainChanceElement(chanceOfRain: number) {
        return chanceOfRain > 0 ? `<span class="material-symbols-outlined">water_drop</span>${chanceOfRain} %` : `&zwnj;`
    },

    CreateUVIndexElement(uvi: number) {
        const [uvIndexLevel, keyIndex] = this.GetUVIndexLevel(uvi)

        return `${Math.round(uvi)} <span class="smallgray" data-stringname="WEATHER_INFO_UVINDEX_LEVELS" data-stringindex="${keyIndex}">${uvIndexLevel}</span>`
    },

    CreateWeatherDescriptionElement(maxTemp: number, minTemp: number) {
        return `<span class="bull">&bull; </span><span class="left-align">&ShortUpArrow;
        <span class="__tempvalue smallgray tooltipped" data-stringname="TOOLTIP_HIGHEST_TEMPERATURE" data-temperature="${maxTemp}">${this.FormatTemperature(maxTemp)}</span>
        &bull; &ShortDownArrow;
        <span class="__tempvalue smallgray tooltipped" data-stringname="TOOLTIP_LOWEST_TEMPERATURE" data-temperature="${minTemp}">${this.FormatTemperature(minTemp)}</span></span>`
    },

    CreateWeatherIcon(conditionId: number, timezoneOffset: number, isDay: boolean) {
        return Icons.GetIcon(Icons.Icons[conditionId], timezoneOffset, isDay)
    },
}