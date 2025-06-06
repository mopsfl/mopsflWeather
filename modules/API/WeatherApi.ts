import Loading from "../Client/Loading"
import Page from "../Client/Page"
import Strings from "../Client/Strings"
import { App } from "../Types/Global"
import { ApiRequestError, CitySearchResult, ParsedWeatherData, WeatherDataResponse, WeatherRequestArguments } from "../Types/Weather"

export class WeatherApi {
    private NoCacheHeaders: Headers
    private API_URL: string

    private ErrorMessages = {
        ERROR_OCCURRED_WEATHER_DATA: `error occurred while loading weather data!`,
        CHECK_DEV_CONSOLE: `error occurred while loading weather data!\ncheck the developer console for more information.`
    }

    private Endpoints = {
        SEARCH_CITY: "data/searchcity?name=",
        GET_WEATHER_DATA: "data/get"
    }

    constructor() {
        this.NoCacheHeaders = new Headers()
        this.NoCacheHeaders.append('pragma', 'no-cache')
        this.NoCacheHeaders.append('cache-control', 'no-cache')
    }

    init() {
        this.API_URL = App.isDev ? "http://localhost:6969/v1/mopsflWeather/" : "https://api.mopsfl.de/v1/mopsflWeather/"
        return this
    }

    async SearchCity(query: any): Promise<CitySearchResult[]> {
        return await fetch(this.API_URL + this.Endpoints.SEARCH_CITY + query, { headers: this.NoCacheHeaders })
            .then(res => res.json())
            .catch(err => { console.error(err), this.HandleRequestError() })
    }

    async LoadWeatherData(args: WeatherRequestArguments, useDefault?: boolean) {
        if (!args && !useDefault) throw new Error("missing <WeatherRequestArguments>")
        const requestQuery = !useDefault ? this.CreateRequestQuery(args) : `?lang=${App.client.language}`

        await fetch(this.API_URL + this.Endpoints.GET_WEATHER_DATA + requestQuery).then(async res => {
            if (!res.ok) return this.HandleRequestError(res)
            const response: ParsedWeatherData = await res.json()
            Page.DisplayWeatherData(response, args)

            App.storage.Set("lastcity", args || { lat: response.meta.lat, lng: response.meta.lon })
        }).catch(err => {
            console.error(err)
            App.notifications.error("Weather Api Error", this.ErrorMessages.CHECK_DEV_CONSOLE)
        })
    }

    CreateRequestQuery(args: WeatherRequestArguments) {
        return `?${(args.lat && args.lng) ? `lat=${args.lat}&lon=${args.lng}&lang=${App.client.language || navigator.language || "en"}` : `name=${encodeURIComponent(args.name)}&lang=${App.client.language}`}`
    }

    HandleRequestError(res?: Response) {
        if (!res) return App.notifications.error("Weather Api Error", this.ErrorMessages.CHECK_DEV_CONSOLE)
        res.json().then((res: ApiRequestError) => {
            App.notifications.error("Weather Api Error", `${this.ErrorMessages.ERROR_OCCURRED_WEATHER_DATA}\nerror: ${res.error}`)
        }).catch(err => {
            console.error(err)
            App.notifications.error("Weather Api Error", this.ErrorMessages.CHECK_DEV_CONSOLE)
        })
    }
}