import LoadingCircle from "./LoadingCircle";
import * as _ from "lodash";
import LocalStorage from "./LocalStorage";
import { Config } from "../index";
const loadingCircle = new LoadingCircle({
    loading_circle: document.querySelector(".weather_data_loading")
});
const localStorage = new LocalStorage({
    key: "_weatherdata_"
});
const weather_data_cityname_loading = document.querySelector(".weather_data_cityname_loading");
export default class WeatherApi {
    constructor(API_URL_DEV = "http://localhost:6969/api/", API_URL_HTTPS = "https://mopsflweather.mopsfl.de/v1/", API_URL_HTTP = "https://mopsflweather.mopsfl.de/v1/", _ELEMENTS = {
        weather_data_cityname: document.querySelector(".weather_data_cityname"),
        weather_data_citytemperature: document.querySelector(".weather_data_citytemperature"),
        weather_data_cityskydesc: document.querySelector(".weather_data_cityskydesc"),
        weather_data_citywinddata: document.querySelector(".weather_data_citywinddata")
    }) {
        this.API_URL_DEV = API_URL_DEV;
        this.API_URL_HTTPS = API_URL_HTTPS;
        this.API_URL_HTTP = API_URL_HTTP;
        this._ELEMENTS = _ELEMENTS;
    }
    /**
     * @description Gets the weather data for the default city set in the backend server
     * @param secureProtocol
     * @param dev
     * @returns
     */
    async GetDefaultWeatherData(secureProtocol = Config.HTTPS_SERVER, dev = Config.DEV_MODE) {
        loadingCircle.ToggleLoading(true);
        loadingCircle.ToggleLoading(true, weather_data_cityname_loading);
        this._ELEMENTS.weather_data_cityname.classList.add("hide");
        const weather_data = await fetch((secureProtocol ? this.API_URL_HTTPS : dev ? this.API_URL_DEV + "data/" : this.API_URL_HTTP) + "currentweather").then(res => res.json());
        loadingCircle.ToggleLoading(false, weather_data_cityname_loading);
        this._ELEMENTS.weather_data_cityname.classList.remove("hide");
        return weather_data;
    }
    /**
     * @description Gets the weather data from the given city information (lat & lon or name)
     * @param args
     * @param secureProtocol
     * @param dev
    */
    async GetWeatherData(args, secureProtocol = Config.HTTPS_SERVER, dev = Config.DEV_MODE) {
        var _a;
        if (!(args))
            throw new Error("Missing required arguments");
        let weather_data;
        loadingCircle.ToggleLoading(true);
        this.ToggleWeatherDataElements(false);
        weather_data_cityname_loading.classList.remove("hide");
        const _requestData = this.EncodeRequestDataQuery(Object.assign(Object.assign(Object.assign({ "func": "currentweather" }, (args.name ? { "location": args.name } : {})), (args.lat ? { "lat": args.lat } : {})), (args.lon ? { "lon": args.lon } : {})));
        if (args.name && !(args.lat || args.lon)) {
            /*weather_data = await fetch((!dev ? this.API_URL_HTTPS : this.API_URL_DEV) + `&d=${_requestData}&t=${new Date().getTime()}`).then(res => res.json()).catch((err) => {
                window.toastr.error(err.message, "Network Error", { timeOut: 100000 })
                weather_data_cityname_loading.classList.add("hide")
                loadingCircle.ToggleLoading(false)
                throw err
            }).catch(console.warn)*/
            weather_data = await fetch((!dev ? this.API_URL_HTTPS : this.API_URL_DEV) + `data/currentweather?name=${args.name}`).then(res => res.json()).catch((err) => {
                window.toastr.error(err.message, "Network Error", { timeOut: 100000 });
                weather_data_cityname_loading.classList.add("hide");
                loadingCircle.ToggleLoading(false);
                throw err;
            }).catch(console.warn);
            if ((weather_data === null || weather_data === void 0 ? void 0 : weather_data.code) != 200) {
                window.toastr.error(`${weather_data.internal_error ? weather_data.internal_error.message.de : `Server responded with code ${weather_data.code} (${weather_data.message})`}`, `WeatherApi Error`, { timeOut: 10000 });
                loadingCircle.ToggleLoading(false);
                this.ToggleWeatherDataElements(true);
                weather_data_cityname_loading.classList.add("hide");
                return;
            }
            loadingCircle.ToggleLoading(false);
            const data = weather_data.data;
            const wind = this.CalculateWind(data.wind);
            this._ELEMENTS.weather_data_cityname.innerHTML = `${_.isNaN(args.cityname) ? args.cityname : data.name}`;
            this._ELEMENTS.weather_data_citytemperature.innerHTML = `${data.main.temp} &#8451;`;
            this._ELEMENTS.weather_data_cityskydesc.innerHTML = `<br>${data.weather[0].description}`;
            this._ELEMENTS.weather_data_citywinddata.innerHTML = `<br>Wind: ${wind.speed} km/h${wind.gust ? `<br>Böhen: ${wind.gust} km/h` : ""}`;
        }
        else {
            /*weather_data = await fetch((!dev ? this.API_URL_HTTPS : this.API_URL_DEV) + `&d=${_requestData}&t=${new Date().getTime()}`).then(res => res.json()).catch((err) => {
                window.toastr.error(err.message, "Network Error", { timeOut: 100000 })
                weather_data_cityname_loading.classList.add("hide")
                loadingCircle.ToggleLoading(false)
                throw err
            }).catch(console.warn)*/
            weather_data = await fetch((!dev ? this.API_URL_HTTPS : this.API_URL_DEV) + `data/currentweather?lat=${args.lat}&lon=${args.lon}`).then(res => res.json()).catch((err) => {
                window.toastr.error(err.message, "Network Error", { timeOut: 100000 });
                weather_data_cityname_loading.classList.add("hide");
                loadingCircle.ToggleLoading(false);
                throw err;
            }).catch(console.warn);
            if ((weather_data === null || weather_data === void 0 ? void 0 : weather_data.code) != 200) {
                loadingCircle.ToggleLoading(false);
                this.ToggleWeatherDataElements(true);
                weather_data_cityname_loading.classList.add("hide");
                window.toastr.error(`Server responded with code ${(weather_data === null || weather_data === void 0 ? void 0 : weather_data.code) || "unknown"} (${(weather_data === null || weather_data === void 0 ? void 0 : weather_data.message) || "Unknown Internal Error"})`, `WeatherApi Error`, { timeOut: 10000 });
                return;
            }
            loadingCircle.ToggleLoading(false);
            const data = weather_data.data;
            const wind = this.CalculateWind(data.wind);
            this._ELEMENTS.weather_data_cityname.innerHTML = `${(args.cityname || ((_a = localStorage.GetKey("selected_city")) === null || _a === void 0 ? void 0 : _a.city)) || data.name}`;
            this._ELEMENTS.weather_data_citytemperature.innerHTML = `${data.main.temp} &#8451;`;
            this._ELEMENTS.weather_data_cityskydesc.innerHTML = `<br>${data.weather[0].description}`;
            this._ELEMENTS.weather_data_citywinddata.innerHTML = `<br>Wind: ${wind.speed} km/h${wind.gust ? `<br>Böhen: ${wind.gust} km/h` : ""}`;
        }
        this.ToggleWeatherDataElements(true);
        weather_data_cityname_loading.classList.add("hide");
    }
    EncodeRequestDataQuery(data) {
        return encodeURIComponent(btoa(String.fromCharCode.apply(null, new Uint16Array(window.pako.gzip(JSON.stringify(data))))));
    }
    /**
     * @description Searches the given city name from a small database
     * @param Name
     * @param secureProtocol
     * @param dev
     */
    async SearchCity(Name, secureProtocol = Config.HTTPS_SERVER, dev = Config.DEV_MODE) {
        const _requestData = this.EncodeRequestDataQuery(Object.assign({ "func": "searchcity" }, (Name ? { "name": Name } : {})));
        loadingCircle.ToggleLoading(true);
        /*const results = await fetch((!dev ? this.API_URL_HTTPS : this.API_URL_DEV) + `&d=${_requestData}&t=${new Date().getTime()}`).then(res => res.json())*/
        const results = await fetch((!dev ? this.API_URL_HTTPS : this.API_URL_DEV) + `data/searchcity?name=${Name}`).then(res => res.json());
        loadingCircle.ToggleLoading(false);
        return results;
    }
    /**
     * Updates the current displayed weather data with the given cityData
     * @param cityData
     */
    async UpdateCurrentWeather(cityData) {
        if (!cityData)
            return;
        const request_arguments = {};
        if (cityData) {
            request_arguments["lat"] = cityData.lat;
            request_arguments["lon"] = cityData.lng;
            request_arguments["name"] = cityData.city;
        }
        return await this.GetWeatherData(request_arguments);
    }
    CalculateWind(windData) {
        const calc_wd = _.clone(windData);
        calc_wd.speed = _.round(calc_wd.speed * 3.16, 0);
        calc_wd.gust = _.round(calc_wd.gust * 3.16, 0);
        return calc_wd;
    }
    ToggleWeatherDataElements(State) {
        Object.values(this._ELEMENTS).forEach(element => {
            State == undefined ? element.classList.toggle("hide") : State == true ? element.classList.remove("hide") : element.classList.add("hide");
        });
    }
}
