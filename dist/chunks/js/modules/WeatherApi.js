import LoadingCircle from "./LoadingCircle";
import * as self from "../index";
import * as _ from "lodash";
import LocalStorage from "./LocalStorage";
const loadingCircle = new LoadingCircle({
    loading_circle: document.querySelector(".weather_data_loading")
});
const localStorage = new LocalStorage({
    key: "_weatherdata_"
});
const weather_data_cityname = document.querySelector(".weather_data_cityname"), weather_data_cityname_loading = document.querySelector(".weather_data_cityname_loading"), weather_data_citytemperature = document.querySelector(".weather_data_citytemperature"), weather_data_cityskydesc = document.querySelector(".weather_data_cityskydesc"), weather_data_citywinddata = document.querySelector(".weather_data_citywinddata");
export default class WeatherApi {
    constructor(API_URL_DEV = "http://localhost:6969/api/v1/", API_URL_HTTPS = "https://mopsflgithubio.mopsfl.repl.co/api/mopsflweather/", API_URL_HTTP = "http://prem.daki.cc:6082/api/v1/data/") {
        this.API_URL_DEV = API_URL_DEV;
        this.API_URL_HTTPS = API_URL_HTTPS;
        this.API_URL_HTTP = API_URL_HTTP;
    }
    /**
     * @description Gets the weather data for the default city set in the backend server
     * @param secureProtocol
     * @param dev
     * @returns
     */
    async GetDefaultWeatherData(secureProtocol = self.HTTPS_SERVER, dev = self.DEV_MODE) {
        loadingCircle.ToggleLoading(true);
        loadingCircle.ToggleLoading(true, weather_data_cityname_loading);
        weather_data_cityname.classList.add("hide");
        const weather_data = await fetch((secureProtocol ? this.API_URL_HTTPS : dev ? this.API_URL_DEV + "data/" : this.API_URL_HTTP) + "currentweather").then(res => res.json());
        loadingCircle.ToggleLoading(false, weather_data_cityname_loading);
        weather_data_cityname.classList.remove("hide");
        return weather_data;
    }
    /**
     * @description Gets the weather data from the given city information (lat & lon or name)
     * @param args
     * @param secureProtocol
     * @param dev
     */
    async GetWeatherData(args, secureProtocol = self.HTTPS_SERVER, dev = self.DEV_MODE) {
        if (!(args))
            throw new Error("Missing required arguments");
        let weather_data;
        loadingCircle.ToggleLoading(true);
        loadingCircle.ToggleLoading(true, weather_data_cityname_loading);
        weather_data_citytemperature.classList.add("hide");
        weather_data_cityname.classList.add("hide");
        weather_data_cityskydesc.classList.add("hide");
        weather_data_citywinddata.classList.add("hide");
        if (args.name && !(args.lat || args.lon)) {
            console.log("get weatherdata by name");
        }
        else {
            weather_data = await fetch((secureProtocol ? this.API_URL_HTTPS : dev ? this.API_URL_DEV + "data/" : this.API_URL_HTTP) + `currentweather?${(args.lat && args.lon ? `lat=${args.lat}&lon=${args.lon}` : ``)}`).then(res => res.json());
            loadingCircle.ToggleLoading(false);
            const data = weather_data.data;
            const wind = this.CalculateWind(data.wind);
            weather_data_cityname.innerHTML = `${(args.cityname || localStorage.GetKey("selected_city").city) || data.name}`;
            weather_data_citytemperature.innerHTML = `${data.main.temp} &#8451;`;
            weather_data_cityskydesc.innerHTML = `<br>${data.weather[0].description}`;
            weather_data_citywinddata.innerHTML = `<br>Wind: ${wind.speed} km/h${wind.gust ? `<br>Böhen: ${wind.gust} km/h` : ""}`;
            console.log(data);
        }
        loadingCircle.ToggleLoading(false, weather_data_cityname_loading);
        weather_data_cityname.classList.remove("hide");
        weather_data_citytemperature.classList.remove("hide");
        weather_data_cityskydesc.classList.remove("hide");
        weather_data_citywinddata.classList.remove("hide");
    }
    /**
     * @description Searches the given city name from a small database
     * @param Name
     * @param secureProtocol
     * @param dev
     */
    async SearchCity(Name, secureProtocol = self.HTTPS_SERVER, dev = self.DEV_MODE) {
        loadingCircle.ToggleLoading(true);
        const results = await fetch((secureProtocol ? this.API_URL_HTTPS : dev ? this.API_URL_DEV + "data/" : this.API_URL_HTTP) + `searchcity?name=${Name}`).then(res => res.json());
        loadingCircle.ToggleLoading(false);
        return results;
    }
    /**
     * Updates the current displayed weather data with the given cityData
     * @param cityData
     */
    async UpdateCurrentWeather(cityData) {
        const request_arguments = {};
        if (cityData) {
            request_arguments["lat"] = cityData.lat;
            request_arguments["lon"] = cityData.lng;
            request_arguments["cityname"] = cityData.city;
        }
        return await this.GetWeatherData(request_arguments);
    }
    CalculateWind(windData) {
        const calc_wd = _.clone(windData);
        calc_wd.speed = _.round(calc_wd.speed * 3.16, 0);
        calc_wd.gust = _.round(calc_wd.gust * 3.16, 0);
        return calc_wd;
    }
}
