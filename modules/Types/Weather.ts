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

export type AstronomicalData = {
    sunrise: Date;
    sunriseRaw: number;
    sunset: Date;
    sunsetRaw: number;
}

export interface WindData {
    speed: number, deg: number, gust: number,
}

export type OpenWeatherApiData = {
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
    icon: { url: string; raw: string; };
}

export type CurrentWeatherData = {
    lat: number,
    lon: number,
    dt: Date,
    dtRaw: number,
    name: string,
    country: string,
    uvi: number,
    timezoneOffset: number,

    astronomical: AstronomicalData,
    weather: OpenWeatherApiData
}

export type ForecastData = ForecastDay[]

export type ForecastDay = {
    date: string,
    date_epoch: number,
    hour: ForcecastHourData[],
    day: { maxtemp_c: number, mintemp_c: number }
}

export type ForcecastHourData = {
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
}

export type WeatherDataResponse = {
    current: CurrentWeatherData,
    forecast: ForecastData
}

export type ParsedWeatherData = {
    current?: {
        temp: [number, number, number], // current, max, min
        wind: [number, number, number], // degrees, gust, speed
        pressure: number,
        humidity: number,
        uvi: number,
        id: number,
        desc: string,
    },

    forecast?: ForecastData,

    meta?: {
        name: string,
        country: string,
        lat: number,
        lon: number,
        timezoneOffset: number,
        sunrise: number,
        sunset: number,
    }
}