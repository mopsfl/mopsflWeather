import LoadingCircle from "./LoadingCircle"
import * as _ from "../index"

const loadingCircle = new LoadingCircle({
    loading_circle: document.querySelector(".weather_data_loading")
})

const weather_data_cityname = document.querySelector(".weather_data_cityname"),
        weather_data_cityname_loading = document.querySelector(".weather_data_cityname_loading")

export default class WeatherApi {
    constructor(
        readonly API_URL_DEV: RequestInfo = "http://localhost:6969/api/v1/",
        readonly API_URL_HTTPS: RequestInfo = "https://mopsflgithubio.mopsfl.repl.co/api/mopsflweather/",
        readonly API_URL_HTTP: RequestInfo = "http://prem.daki.cc:6082/api/v1/data/",
    ) {}

    async GetCurrentWeather(secureProtocol: boolean = _.HTTPS_SERVER, dev: boolean = _.DEV_MODE){
        loadingCircle.ToggleLoading(true)
        loadingCircle.ToggleLoading(true, weather_data_cityname_loading)
        weather_data_cityname.classList.add("hide")

        const weather_data = await fetch((secureProtocol ? this.API_URL_HTTPS : dev ? this.API_URL_DEV + "data/" : this.API_URL_HTTP) + "currentweather").then(res => res.json())
        loadingCircle.ToggleLoading(false, weather_data_cityname_loading)
        weather_data_cityname.classList.remove("hide")

        return weather_data
    }

    async GetWeatherData(args: weatherRequestArguments, secureProtocol: boolean = _.HTTPS_SERVER, dev: boolean = _.DEV_MODE) {
        if(!(args)) throw new Error("Missing required arguments")
        let weather_data: WeatherData
        loadingCircle.ToggleLoading(true)
        loadingCircle.ToggleLoading(true, weather_data_cityname_loading)
        weather_data_cityname.classList.add("hide")

        if(args.name && !(args.lat || args.lon)){
            console.log("get weatherdata by name")
        } else {
            weather_data = await fetch((secureProtocol ? this.API_URL_HTTPS : dev ? this.API_URL_DEV + "data/" : this.API_URL_HTTP) + `currentweather?${(args.lat && args.lon ? `lat=${args.lat}&lon=${args.lon}` : ``)}`).then(res => res.json())
            loadingCircle.ToggleLoading(false)
            const data = weather_data.data

            weather_data_cityname.innerHTML = `${data.name || data.name}`
        }
        loadingCircle.ToggleLoading(false, weather_data_cityname_loading)
        weather_data_cityname.classList.remove("hide")
    }

    async SearchCity(Name: String, secureProtocol: boolean = _.HTTPS_SERVER, dev: boolean = _.DEV_MODE){
        loadingCircle.ToggleLoading(true)
        const results = await fetch((secureProtocol ? this.API_URL_HTTPS : dev ? this.API_URL_DEV + "data/" : this.API_URL_HTTP) + `searchcity?name=${Name}`).then(res => res.json())
        loadingCircle.ToggleLoading(false)

        return results
    }

    async UpdateCurrentWeather(cityData?: CityData) {
        const request_arguments = {}
        if(cityData){
            request_arguments["lat"] = cityData.lat
            request_arguments["lon"] = cityData.lng
        }
        return await this.GetWeatherData(request_arguments)
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
    lon?: string | number,
    lat?: string | number,
    name?: string
}

export interface WeatherData {
    data: {
        main: {
            temp: number, feels_like: number, temp_min: number, temp_max: number, pressure: number, humidity: number,
        },
        visibility: number,
        wind: { speed: number, deg: number, gust: number },
        clouds: {},
        dt: number,
        base: string,
        sys: { type: number, id: number, country: string, sunrise: number, sunset: number },
        weather: [ {
            id: number, main: string, description: string, icon: string
        } ],
        timezone: number,
        id: number,
        name: string,
        cod: number
    },
    cached: boolean
}