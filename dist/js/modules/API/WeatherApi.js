"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherApi = void 0;
const Page_1 = __importDefault(require("../Client/Page"));
const Strings_1 = __importDefault(require("../Client/Strings"));
const Global_1 = require("../Types/Global");
class WeatherApi {
    NoCacheHeaders;
    API_URL;
    ErrorMessages = {
        ERROR_OCCURRED_WEATHER_DATA: `error occurred while loading weather data!`,
        CHECK_DEV_CONSOLE: `error occurred while loading weather data!\ncheck the developer console for more information.`
    };
    Endpoints = {
        SEARCH_CITY: "data/searchcity?name=",
        GET_WEATHER_DATA: "data/get"
    };
    constructor() {
        this.NoCacheHeaders = new Headers();
        this.NoCacheHeaders.append('pragma', 'no-cache');
        this.NoCacheHeaders.append('cache-control', 'no-cache');
    }
    init() {
        this.API_URL = Global_1.App.isDev ? "http://localhost:6969/v1/mopsflWeather/" : "https://api.mopsfl.de/v1/mopsflWeather/";
        return this;
    }
    async SearchCity(query) {
        return await fetch(this.API_URL + this.Endpoints.SEARCH_CITY + query, { headers: this.NoCacheHeaders })
            .then(res => res.json())
            .catch(err => { console.error(err), this.HandleRequestError(); });
    }
    async LoadWeatherData(args, useDefault) {
        if (!args && !useDefault)
            throw new Error("missing <WeatherRequestArguments>");
        const requestQuery = !useDefault ? this.CreateRequestQuery(args) : "";
        await fetch(this.API_URL + this.Endpoints.GET_WEATHER_DATA + requestQuery, {
            headers: { lang: Strings_1.default.LanguagesCodes[Global_1.App.settings.GetSettings().setting_language] }
        }).then(async (res) => {
            if (!res.ok)
                return this.HandleRequestError(res);
            Page_1.default.DisplayWeatherData(await res.json());
        }).catch(err => {
            console.error(err);
            Global_1.App.notifications.error("Weather Api Error", this.ErrorMessages.CHECK_DEV_CONSOLE);
        });
    }
    CreateRequestQuery(args) {
        return `?${(args.lat && args.lng) ? `lat=${args.lat}&lon=${args.lng}` : `name=${encodeURIComponent(args.name)}`}`;
    }
    HandleRequestError(res) {
        if (!res)
            return Global_1.App.notifications.error("Weather Api Error", this.ErrorMessages.CHECK_DEV_CONSOLE);
        res.json().then((res) => {
            Global_1.App.notifications.error("Weather Api Error", `${this.ErrorMessages.ERROR_OCCURRED_WEATHER_DATA}\nerror: ${res.error}`);
        }).catch(err => {
            console.error(err);
            Global_1.App.notifications.error("Weather Api Error", this.ErrorMessages.CHECK_DEV_CONSOLE);
        });
    }
}
exports.WeatherApi = WeatherApi;
