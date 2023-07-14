import LoadingCircle from "./LoadingCircle"
import * as _ from "lodash"
import LocalStorage from "./LocalStorage"
import { Config } from "../index"

const loadingCircle = new LoadingCircle({
    loading_circle: document.querySelector(".weather_data_loading")
})
const localStorage = new LocalStorage({
    key: "_weatherdata_"
})

const weather_data_cityname_loading = document.querySelector(".weather_data_cityname_loading")

export default class WeatherApi {
    constructor(
        readonly API_URL_DEV: RequestInfo = "http://localhost:6969/api/v1/",
        readonly API_URL_HTTPS: RequestInfo = "https://mopsflgithubio.mopsfl.repl.co/api/mopsflweather/",
        readonly API_URL_HTTP: RequestInfo = "http://prem.daki.cc:6082/api/v1/data/",

        public _ELEMENTS = {
            weather_data_cityname: document.querySelector(".weather_data_cityname"),
            weather_data_citytemperature: document.querySelector(".weather_data_citytemperature"),
            weather_data_cityskydesc: document.querySelector(".weather_data_cityskydesc"),
            weather_data_citywinddata: document.querySelector(".weather_data_citywinddata")
        }
    ) { }

    /**
     * @description Gets the weather data for the default city set in the backend server
     * @param secureProtocol 
     * @param dev 
     * @returns 
     */
    async GetDefaultWeatherData(secureProtocol: boolean = Config.HTTPS_SERVER, dev: boolean = Config.DEV_MODE) {
        loadingCircle.ToggleLoading(true)
        loadingCircle.ToggleLoading(true, weather_data_cityname_loading)
        this._ELEMENTS.weather_data_cityname.classList.add("hide")

        const weather_data = await fetch((secureProtocol ? this.API_URL_HTTPS : dev ? this.API_URL_DEV + "data/" : this.API_URL_HTTP) + "currentweather").then(res => res.json())
        loadingCircle.ToggleLoading(false, weather_data_cityname_loading)
        this._ELEMENTS.weather_data_cityname.classList.remove("hide")

        return weather_data
    }

    /**
     * @description Gets the weather data from the given city information (lat & lon or name)
     * @param args 
     * @param secureProtocol 
     * @param dev 
     */
    async GetWeatherData(args: weatherRequestArguments, secureProtocol: boolean = Config.HTTPS_SERVER, dev: boolean = Config.DEV_MODE) {
        if (!(args)) throw new Error("Missing required arguments")
        let weather_data: WeatherData
        loadingCircle.ToggleLoading(true)
        this.ToggleWeatherDataElements(false)
        weather_data_cityname_loading.classList.remove("hide")

        if (args.name && !(args.lat || args.lon)) {
            weather_data = await fetch((secureProtocol ? this.API_URL_HTTPS : dev ? this.API_URL_DEV + "data/" : this.API_URL_HTTP) + `currentweather?${(args.name ? `location=${args.name}` : "")}`).then(res => res.json()).catch((err) => {
                window.toastr.error(err.message, "Network Error", { timeOut: 100000 })
                weather_data_cityname_loading.classList.add("hide")
                loadingCircle.ToggleLoading(false)
                throw err
            })
            if (weather_data.code != 200) {
                window.toastr.error(`${weather_data.internal_error ? weather_data.internal_error.message.de : `Server responded with code ${weather_data.code} (${weather_data.message})`}`, `WeatherApi Error`, { timeOut: 10000 })
                loadingCircle.ToggleLoading(false)
                this.ToggleWeatherDataElements(true)
                weather_data_cityname_loading.classList.add("hide")
                return
            }
            loadingCircle.ToggleLoading(false)
            const data = weather_data.data
            const wind = this.CalculateWind(data.wind)

            this._ELEMENTS.weather_data_cityname.innerHTML = `${_.isNaN(args.cityname) ? args.cityname : data.name}`
            this._ELEMENTS.weather_data_citytemperature.innerHTML = `${data.main.temp} &#8451;`
            this._ELEMENTS.weather_data_cityskydesc.innerHTML = `<br>${data.weather[0].description}`
            this._ELEMENTS.weather_data_citywinddata.innerHTML = `<br>Wind: ${wind.speed} km/h${wind.gust ? `<br>Böhen: ${wind.gust} km/h` : ""}`
        } else {
            weather_data = await fetch((secureProtocol ? this.API_URL_HTTPS : dev ? this.API_URL_DEV + "data/" : this.API_URL_HTTP) + `currentweather?${(args.lat && args.lon ? `lat=${args.lat}&lon=${args.lon}` : "")}`).then(res => res.json()).catch((err) => {
                window.toastr.error(err.message, "Network Error", { timeOut: 100000 })
                weather_data_cityname_loading.classList.add("hide")
                loadingCircle.ToggleLoading(false)
                throw err
            })
            if (weather_data.code != 200) {
                loadingCircle.ToggleLoading(false)
                this.ToggleWeatherDataElements(true)
                weather_data_cityname_loading.classList.add("hide")
                window.toastr.error(`Server responded with code ${weather_data.code} (${weather_data.message})`, `WeatherApi Error`, { timeOut: 10000 })
                return
            }
            loadingCircle.ToggleLoading(false)
            const data = weather_data.data
            const wind = this.CalculateWind(data.wind)

            this._ELEMENTS.weather_data_cityname.innerHTML = `${(args.cityname || localStorage.GetKey("selected_city")?.city) || data.name}`
            this._ELEMENTS.weather_data_citytemperature.innerHTML = `${data.main.temp} &#8451;`
            this._ELEMENTS.weather_data_cityskydesc.innerHTML = `<br>${data.weather[0].description}`
            this._ELEMENTS.weather_data_citywinddata.innerHTML = `<br>Wind: ${wind.speed} km/h${wind.gust ? `<br>Böhen: ${wind.gust} km/h` : ""}`
        }
        this.ToggleWeatherDataElements(true)
        weather_data_cityname_loading.classList.add("hide")
    }

    /**
     * @description Searches the given city name from a small database
     * @param Name 
     * @param secureProtocol 
     * @param dev
     */
    async SearchCity(Name: String, secureProtocol: boolean = Config.HTTPS_SERVER, dev: boolean = Config.DEV_MODE) {
        loadingCircle.ToggleLoading(true)
        const results = await fetch((secureProtocol ? this.API_URL_HTTPS : dev ? this.API_URL_DEV + "data/" : this.API_URL_HTTP) + `searchcity?name=${Name}`).then(res => res.json())
        loadingCircle.ToggleLoading(false)

        return results
    }

    /**
     * Updates the current displayed weather data with the given cityData
     * @param cityData 
     */

    async UpdateCurrentWeather(cityData?: any) {
        if (!cityData) return
        const request_arguments = {}
        if (cityData) {
            request_arguments["lat"] = cityData.lat
            request_arguments["lon"] = cityData.lng
            request_arguments["name"] = cityData.city
        }

        return await this.GetWeatherData(request_arguments)
    }

    CalculateWind(windData: WindData) {
        const calc_wd = _.clone(windData)
        calc_wd.speed = _.round(calc_wd.speed * 3.16, 0)
        calc_wd.gust = _.round(calc_wd.gust * 3.16, 0)
        return calc_wd
    }

    ToggleWeatherDataElements(State?: boolean) {
        Object.values(this._ELEMENTS).forEach(element => {
            State == undefined ? element.classList.toggle("hide") : State == true ? element.classList.remove("hide") : element.classList.add("hide")
        })
    }
}

export interface CityData {
    city: string,
    city_ascii?: string,
    lat?: string,
    lng?: string,
    country?: string,
    id?: string,
    iso2?: string,
}

export interface weatherRequestArguments {
    lon?: string | number,
    lat?: string | number,
    name?: string,
    cityname?: string,
}

export interface WeatherData {
    code?: number,
    message?: string,
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
        weather: [{
            id: number, main: string, description: string, icon: string
        }],
        timezone: number,
        id: number,
        name: string,
        cod: number
    },
    cached: boolean,
    internal_error?: {
        code: number,
        error: string,
        message: {
            de: string,
            en: string
        }
    }
}

export interface WindData {
    speed: number, deg: number, gust: number,
}