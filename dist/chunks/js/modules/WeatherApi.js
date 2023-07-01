export default class WeatherApi {
    constructor(API_URL_DEV = "http://localhost:6969/api/v1/", API_URL_HTTPS = "https://mopsflgithubio.mopsfl.repl.co/api/mopsflweather/", API_URL_HTTP = "http://prem.daki.cc:6082/api/v1/data/") {
        this.API_URL_DEV = API_URL_DEV;
        this.API_URL_HTTPS = API_URL_HTTPS;
        this.API_URL_HTTP = API_URL_HTTP;
    }
    async GetCurrentWeather(secureProtocol = true, dev = false) {
        const loading_circle = document.querySelector(".weather_data_loading");
        loading_circle.classList.remove("hide");
        const weather_data = await fetch((secureProtocol ? this.API_URL_HTTPS : dev ? this.API_URL_DEV + "data/" : this.API_URL_HTTP) + "currentweather").then(res => res.json());
        loading_circle.classList.add("hide");
        return weather_data;
    }
    async SearchCity(Name, secureProtocol = true, dev = false) {
        const loading_circle = document.querySelector(".weather_data_loading");
        loading_circle.classList.remove("hide");
        const results = await fetch((secureProtocol ? this.API_URL_HTTPS : dev ? this.API_URL_DEV + "data/" : this.API_URL_HTTP) + `searchcity?name=${Name}`).then(res => res.json());
        loading_circle.classList.add("hide");
        return results;
    }
}
