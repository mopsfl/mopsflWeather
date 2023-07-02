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

    async GetCurrentWeather(secureProtocol: boolean = _.HTTPS_SERVER, dev: boolean = _.DEV_MODE){
        loadingCircle.ToggleLoading(true)
        const weather_data = await fetch((secureProtocol ? this.API_URL_HTTPS : dev ? this.API_URL_DEV + "data/" : this.API_URL_HTTP) + "currentweather").then(res => res.json())
        loadingCircle.ToggleLoading(false)

        return weather_data
    }

    async GetWeatherData(args: weatherRequestArguments, secureProtocol: boolean = _.HTTPS_SERVER, dev: boolean = _.DEV_MODE) {
        if(args.name && !(args.lat || args.lon)){
            console.log("get weatherdata by name")
        } else {
            loadingCircle.ToggleLoading(true)
            const weather_data = await fetch((secureProtocol ? this.API_URL_HTTPS : dev ? this.API_URL_DEV + "data/" : this.API_URL_HTTP) + `currentweather?lat=${args.lat}&lon=${args.lon}`).then(res => res.json())
            loadingCircle.ToggleLoading(false)

            const data = weather_data.data.data || weather_data.data
            document.querySelector(".weather_data_cityname").innerHTML = `${data.name || data.name}<br>Temperature: ${data.main.temp || data.main.temp} °C<br><br>${data.weather[0].description}`
        }
    }

    async SearchCity(Name: String, secureProtocol: boolean = _.HTTPS_SERVER, dev: boolean = _.DEV_MODE){
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
    lon?: string | number,
    lat?: string | number,
    name?: string
}