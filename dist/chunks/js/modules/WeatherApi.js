import LoadingCircle from "./LoadingCircle";
import * as _ from "../index";
const loadingCircle = new LoadingCircle({
    loading_circle: document.querySelector(".weather_data_loading")
});
const weather_data_cityname = document.querySelector(".weather_data_cityname"), weather_data_cityname_loading = document.querySelector(".weather_data_cityname_loading");
export default class WeatherApi {
    constructor(API_URL_DEV = "http://localhost:6969/api/v1/", API_URL_HTTPS = "https://mopsflgithubio.mopsfl.repl.co/api/mopsflweather/", API_URL_HTTP = "http://prem.daki.cc:6082/api/v1/data/") {
        this.API_URL_DEV = API_URL_DEV;
        this.API_URL_HTTPS = API_URL_HTTPS;
        this.API_URL_HTTP = API_URL_HTTP;
    }
    async GetCurrentWeather(secureProtocol = _.HTTPS_SERVER, dev = _.DEV_MODE) {
        loadingCircle.ToggleLoading(true);
        loadingCircle.ToggleLoading(true, weather_data_cityname_loading);
        weather_data_cityname.classList.add("hide");
        const weather_data = await fetch((secureProtocol ? this.API_URL_HTTPS : dev ? this.API_URL_DEV + "data/" : this.API_URL_HTTP) + "currentweather").then(res => res.json());
        loadingCircle.ToggleLoading(false, weather_data_cityname_loading);
        weather_data_cityname.classList.remove("hide");
        return weather_data;
    }
    async GetWeatherData(args, secureProtocol = _.HTTPS_SERVER, dev = _.DEV_MODE) {
        if (!(args))
            throw new Error("Missing required arguments");
        let weather_data;
        loadingCircle.ToggleLoading(true);
        loadingCircle.ToggleLoading(true, weather_data_cityname_loading);
        weather_data_cityname.classList.add("hide");
        if (args.name && !(args.lat || args.lon)) {
            console.log("get weatherdata by name");
        }
        else {
            weather_data = await fetch((secureProtocol ? this.API_URL_HTTPS : dev ? this.API_URL_DEV + "data/" : this.API_URL_HTTP) + `currentweather?${(args.lat && args.lon ? `lat=${args.lat}&lon=${args.lon}` : ``)}`).then(res => res.json());
            loadingCircle.ToggleLoading(false);
            const data = weather_data.data;
            weather_data_cityname.innerHTML = `${data.name || data.name}`;
        }
        loadingCircle.ToggleLoading(false, weather_data_cityname_loading);
        weather_data_cityname.classList.remove("hide");
    }
    async SearchCity(Name, secureProtocol = _.HTTPS_SERVER, dev = _.DEV_MODE) {
        loadingCircle.ToggleLoading(true);
        const results = await fetch((secureProtocol ? this.API_URL_HTTPS : dev ? this.API_URL_DEV + "data/" : this.API_URL_HTTP) + `searchcity?name=${Name}`).then(res => res.json());
        loadingCircle.ToggleLoading(false);
        return results;
    }
    async UpdateCurrentWeather(cityData) {
        const request_arguments = {};
        if (cityData) {
            request_arguments["lat"] = cityData.lat;
            request_arguments["lon"] = cityData.lng;
        }
        return await this.GetWeatherData(request_arguments);
    }
}
