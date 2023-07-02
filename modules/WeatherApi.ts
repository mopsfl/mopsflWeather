import LoadingCircle from "./LoadingCircle"
import * as _ from "../index"

const loadingCircle = new LoadingCircle({
    loading_circle: document.querySelector(".weather_data_loading")
})

export default class WeatherApi {
    constructor(
        readonly API_URL_DEV: RequestInfo = "http://localhost:6969/api/v1/",
        readonly API_URL_HTTPS: RequestInfo = "https://mopsflgithubio.mopsfl.repl.co/api/mopsflweather/",
        readonly API_URL_HTTP: RequestInfo = "http://prem.daki.cc:6082/api/v1/data/",
    ) {}

    async GetCurrentWeather(secureProtocol: boolean = _.default.HTTPS_SERVER, dev: boolean = _.default.DEV_MODE){
        loadingCircle.ToggleLoading(true)
        const weather_data = await fetch((secureProtocol ? this.API_URL_HTTPS : dev ? this.API_URL_DEV + "data/" : this.API_URL_HTTP) + "currentweather").then(res => res.json())
        loadingCircle.ToggleLoading(false)

        return weather_data
    }

    async GetWeatherData(args: weatherRequestArguments, secureProtocol: boolean = _.default.HTTPS_SERVER, dev: boolean = _.default.DEV_MODE) {
        if(args.name && !(args.lat || args.lon)){
            console.log("get weatherdata by name")
        } else {
            loadingCircle.ToggleLoading(true)
            const weather_data = await fetch((secureProtocol ? this.API_URL_HTTPS : dev ? this.API_URL_DEV + "data/" : this.API_URL_HTTP) + `currentweather?lat=${args.lat}&lon=${args.lon}`).then(res => res.json())
            loadingCircle.ToggleLoading(false)
            console.log(weather_data)
        }
    }

    async SearchCity(Name: String, secureProtocol: boolean = _.default.HTTPS_SERVER, dev: boolean = _.default.DEV_MODE){
        loadingCircle.ToggleLoading(true)
        const results = await fetch((secureProtocol ? this.API_URL_HTTPS : dev ? this.API_URL_DEV + "data/" : this.API_URL_HTTP) + `searchcity?name=${Name}`).then(res => res.json())
        loadingCircle.ToggleLoading(false)

        return results
    }

    async UpdateCurrentWeather(cityData: CityData) {
        const weatherData = await this.GetWeatherData({
            lat: cityData.lat,
            lon: cityData.lng
        })
    }
}

export interface CityData {
     city: String,
     city_ascii: string, 
     lat: string, 
     lng: string, 
     country: String, 
     id: string, 
     iso2: String
}

export interface weatherRequestArguments {
    lon?: string,
    lat?: string,
    name?: string
}