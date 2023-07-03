import LoadingCircle from "./LoadingCircle"
import * as self from "../index"
import * as _ from "lodash"

const loadingCircle = new LoadingCircle({
    loading_circle: document.querySelector(".weather_data_loading")
})

const weather_data_cityname = document.querySelector(".weather_data_cityname"),
        weather_data_cityname_loading = document.querySelector(".weather_data_cityname_loading"),
        weather_data_citytemperature = document.querySelector(".weather_data_citytemperature"),
        weather_data_cityskydesc = document.querySelector(".weather_data_cityskydesc"),
        weather_data_citywinddata = document.querySelector(".weather_data_citywinddata")

export default class WeatherApi {
    constructor(
        readonly API_URL_DEV: RequestInfo = "http://localhost:6969/api/v1/",
        readonly API_URL_HTTPS: RequestInfo = "https://mopsflgithubio.mopsfl.repl.co/api/mopsflweather/",
        readonly API_URL_HTTP: RequestInfo = "http://prem.daki.cc:6082/api/v1/data/",
    ) {}

    /**
     * @description Gets the weather data for the default city set in the backend server
     * @param secureProtocol 
     * @param dev 
     * @returns 
     */
    async GetDefaultWeatherData(secureProtocol: boolean = self.HTTPS_SERVER, dev: boolean = self.DEV_MODE){
        loadingCircle.ToggleLoading(true)
        loadingCircle.ToggleLoading(true, weather_data_cityname_loading)
        weather_data_cityname.classList.add("hide")

        const weather_data = await fetch((secureProtocol ? this.API_URL_HTTPS : dev ? this.API_URL_DEV + "data/" : this.API_URL_HTTP) + "currentweather").then(res => res.json())
        loadingCircle.ToggleLoading(false, weather_data_cityname_loading)
        weather_data_cityname.classList.remove("hide")

        return weather_data
    }

    /**
     * @description Gets the weather data from the given city information (lat & lon or name)
     * @param args 
     * @param secureProtocol 
     * @param dev 
     */
    async GetWeatherData(args: weatherRequestArguments, secureProtocol: boolean = self.HTTPS_SERVER, dev: boolean = self.DEV_MODE) {
        if(!(args)) throw new Error("Missing required arguments")
        let weather_data: WeatherData
        loadingCircle.ToggleLoading(true)
        loadingCircle.ToggleLoading(true, weather_data_cityname_loading)
        weather_data_citytemperature.classList.add("hide")
        weather_data_cityname.classList.add("hide")
        weather_data_cityskydesc.classList.add("hide")
        weather_data_citywinddata.classList.add("hide")

        if(args.name && !(args.lat || args.lon)){
            console.log("get weatherdata by name")
        } else {
            weather_data = await fetch((secureProtocol ? this.API_URL_HTTPS : dev ? this.API_URL_DEV + "data/" : this.API_URL_HTTP) + `currentweather?${(args.lat && args.lon ? `lat=${args.lat}&lon=${args.lon}` : ``)}`).then(res => res.json())
            loadingCircle.ToggleLoading(false)
            const data = weather_data.data
            const wind = this.CalculateWind(data.wind)

            weather_data_cityname.innerHTML = `${data.name || data.name}`
            weather_data_citytemperature.innerHTML = `${data.main.temp} &#8451;`
            weather_data_cityskydesc.innerHTML = `<br>${data.weather[0].description}`
            weather_data_citywinddata.innerHTML = `<br>Wind: ${wind.speed} km/h<br>Böhen: ${wind.gust} km/h`
            console.log(data)
        }
        loadingCircle.ToggleLoading(false, weather_data_cityname_loading)
        weather_data_cityname.classList.remove("hide")
        weather_data_citytemperature.classList.remove("hide")
        weather_data_cityskydesc.classList.remove("hide")
        weather_data_citywinddata.classList.remove("hide")
    }

    /**
     * @description Searches the given city name from a small database
     * @param Name 
     * @param secureProtocol 
     * @param dev
     */
    async SearchCity(Name: String, secureProtocol: boolean = self.HTTPS_SERVER, dev: boolean = self.DEV_MODE) {
        loadingCircle.ToggleLoading(true)
        const results = await fetch((secureProtocol ? this.API_URL_HTTPS : dev ? this.API_URL_DEV + "data/" : this.API_URL_HTTP) + `searchcity?name=${Name}`).then(res => res.json())
        loadingCircle.ToggleLoading(false)

        return results
    }

    /**
     * Updates the current displayed weather data with the given cityData
     * @param cityData 
     */

    async UpdateCurrentWeather(cityData?: CityData) {
        const request_arguments = {}
        if(cityData){
            request_arguments["lat"] = cityData.lat
            request_arguments["lon"] = cityData.lng
        }
        return await this.GetWeatherData(request_arguments)
    }

    CalculateWind(windData: WindData){
        const calc_wd = _.clone(windData)
        calc_wd.speed = _.round(calc_wd.speed * 3.16, 0)
        calc_wd.gust = _.round(calc_wd.gust * 3.16, 0)
        console.log(calc_wd)
        return calc_wd
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
        wind: WindData,
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

export interface WindData {
    speed: number, deg: number, gust: number,
}