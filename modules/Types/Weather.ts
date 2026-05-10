export type ApiRequestError = {
    code: number,
    error: string
}

export type CitySearchResult = {
    name: string,
    lat: string,
    lng: string,
    country: string,
    admin1: string,
    admin2: string,
}

export type WeatherRequestArguments = {
    lng?: string | number,
    lat?: string | number,
    name?: string,
    unknownName?: boolean,
}

export interface WindData {
    speed: number, deg: number, gust: number,
}

export type ForecastHourlyData = {
    time: string
    precipitation: number
    rain: number
    temperature: number
    weather_code: number
    wind_speed: number
    wind_direction: number
    uv_index: number
    uv_index_clear_sky: number
    is_day: number
}

export type ForecastDailyData = {
    time: number
    temperature_max: number
    temperature_min: number
    sunrise: number
    sunset: number
    uv_index_max: number
    rain_sum: number
    showers_sum: number
    snowfall_sum: number
    precipitation_sum: number
    precipitation_hours: number
    precipitation_probability_max: number
    wind_speed_max: number
    wind_gusts_max: number
    wind_direction_dominant: number
}

export type CurrentWeatherData = {
    time: string,
    temperature: number
    humidity: number
    is_day: number
    precipitation: number
    rain: number
    weather_code: number
    surface_pressure: number
    pressure_msl: number
    wind_speed: number
    wind_direction: number
    wind_gusts: number
}

export type WeatherData = {
    current: CurrentWeatherData,
    hourly: ForecastHourlyData[],
    daily: ForecastDailyData[],

    meta: {
        city: string,
        country: string,
        country_code: string,
        lat: number,
        lon: number,
        utcOffset: number,
        timezone: number
    }
}