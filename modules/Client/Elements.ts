import { App } from "../Types/Global";

export class Elements {
    Containers = {
        WEATHER_DATA: this.GetElement(".weather-data")
    }

    Values = {
        WEATHER_DATA: this.GetElement(".weather-data"),
        CITY_NAME: this.GetElement(".weather-data-city-name"),
        TEMPERATURE_VALUE: this.GetElement(".temperature-value"),
        WEATHER_DESCRIPTION: this.GetElement(".weather-description"),
        WIND_SPEED_VALUE: this.GetElement(".wind-speed-value"),
        WIND_GUST_SPEED_VALUE: this.GetElement(".windgust-speed-value"),
        WIND_DIRECTION_ICON: this.GetElement(".wind-direction-icon"),
        WIND_DIRECTION_DEG: this.GetElement(".wind-directiondeg"),
        SUNRISE_VALUE: this.GetElement(".sunrise-value"),
        SUNSET_VALUE: this.GetElement(".sunset-value"),
        SUNRISE_IN_VALUE: this.GetElement(".sunrise-in-value"),
        SUNSET_IN_VALUE: this.GetElement(".sunset-in-value"),
        WEATHER_ICON: this.GetElement(".main-info-weather-icon"),
        CURRENT_TIME: this.GetElement(".weather-data-current-time"),
        HUMIDITY_VALUE: this.GetElement(".humidity-value"),
        AIRPRESSURE_VALUE: this.GetElement(".airpressure-value"),
        UV_INDEX_VALUE: this.GetElement(".uvindex-value"),
        WEATHER_ALERT: this.GetElement(".weather-alert"),
    }

    Forecast = {
        FORECAST_ITEMS: this.GetElement(".weather-forecast-items"),
        FORECAST_MISC_ITEMS: this.GetElement(".weather-forecast-misc-items"),
    }

    Templates = {
        FORECAST_ITEM: this.GetElement(".weather-forecast-item-template"),
        MISC_FORECAST_ITEM: this.GetElement(".weather-forecast-misc-item-template"),
        DROPDOWN_ITEM: this.GetElement(".dropdown-item-template"),
    }

    Misc = {
        AUTOCOMPLETE_DROPDOWN: this.GetElement(".autocomplete-dropdown"),
        SEARCH_CITY_INPUT: this.GetElement(".searchcity-input"),

        SEARCH_BOX_LOADING: this.GetElement(".search-box-loading-spinner"),
        WEATHER_DATA_LOADING: this.GetElement(".weather-data-loading-spinner"),

        SETTINGS_BUTTON: this.GetElement(".settings-btn"),
        SETTINGS_MODAL: this.GetElement("#settingsmodal"),
        RESET_DEFAULT: this.GetElement("#resetdefault")
    }

    GetElement(selector: string) {
        return $(selector)
    }
};
