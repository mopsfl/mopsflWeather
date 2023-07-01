export default class WeatherApi {
    constructor(
        readonly API_URL_DEV: RequestInfo = "http://localhost:6969/api/v1/",
        readonly API_URL_HTTPS: RequestInfo = "https://mopsflgithubio.mopsfl.repl.co/api/mopsflweather/",
        readonly API_URL_HTTP: RequestInfo = "http://prem.daki.cc:6082/api/v1/data/"
    ) {}

    async GetCurrentWeather(secureProtocol: boolean = true, dev: boolean = false){
        const loading_circle = document.querySelector(".weather_data_loading")
        loading_circle.classList.remove("hide")
        const weather_data = await fetch((secureProtocol ? this.API_URL_HTTPS : dev ? this.API_URL_DEV + "data/" : this.API_URL_HTTP) + "currentweather").then(res => res.json())
        loading_circle.classList.add("hide")

        return weather_data
    }

    async SearchCity(Name: String, secureProtocol: boolean = true, dev: boolean = false){
        const loading_circle = document.querySelector(".weather_data_loading")
        loading_circle.classList.remove("hide")
        const results = await fetch((secureProtocol ? this.API_URL_HTTPS : dev ? this.API_URL_DEV + "data/" : this.API_URL_HTTP) + `searchcity?name=${Name}`).then(res => res.json())
        loading_circle.classList.add("hide")

        return results
    }
}