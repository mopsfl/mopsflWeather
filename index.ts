const DEV_MODE = false
const HTTPS_SERVER = true

import WeatherApi, { CityData } from "./modules/WeatherApi"
import WeatherIcon from "./modules/WeatherIcon"
import SearchCity from "./modules/SearchCity"
import LoadingCircle from "./modules/LoadingCircle"
import LocalStorage from "./modules/LocalStorage"
import GeoLocation from "./modules/GeoLocation"
//import * as _ from "lodash"

const geoLocation = new GeoLocation()
const weatherApi = new WeatherApi()
const weatherIcon = new WeatherIcon()
const localStorage = new LocalStorage({
    key: "_weatherdata_"
})
const loadingCircle = new LoadingCircle({
    loading_circle: document.querySelector(".weather_data_loading")
})

const searchCity = new SearchCity({
    location_search_results: document.querySelector(".location_search_results"),
    location_search_input: document.querySelector(".location_search_input"),
    location_search_result_template: document.querySelector(".location_search_result_template")
})

window.modules = {
    classes: { GeoLocation, WeatherApi, WeatherIcon, SearchCity, LoadingCircle, LocalStorage, _ },
    initialized: { weatherApi, weatherIcon, localStorage, loadingCircle, searchCity, geoLocation }
 }

loadingCircle.ToggleLoading(true)

await navigator.permissions.query({ name: "geolocation" }).then(async (res) => {
    window.geolocation_state = res.state
    const ls_data = localStorage.Parse()
    let saved_coords: GeolocationPosition
    if(ls_data.coords) {
        saved_coords = JSON.parse(ls_data.coords)
        window.current_geolocation_data = "saved"
    }
    if(saved_coords && typeof(saved_coords) == "object"){
        return SetGeoLocation(saved_coords)
    }

    window.current_geolocation_data = "none"
    geoLocation.GetGeoLocation(SetGeoLocation, ErrorCallback)
})

/**
 * Functions
*/

async function SetGeoLocation(pos: GeolocationPosition) {
    window.coords = pos.coords
    localStorage.Set("coords", JSON.stringify(cloneAsObject(pos)))
    
    // Get Weather From Current GeoLocation
    const results = await weatherApi.GetWeatherData({
        lat: window.coords.latitude,
        lon: window.coords.longitude,
    })
    window.currentWeather = results
}

async function ErrorCallback(err: any) {
    if(window.current_geolocation_data == "none") await weatherApi.UpdateCurrentWeather()
    throw err
}

function cloneAsObject(obj: any) {
    if (obj === null || !(obj instanceof Object)) return obj
    var temp = (obj instanceof Array) ? [] : {};
    for (var key in obj) { temp[key] = cloneAsObject(obj[key]) }
    return temp;
}

/**
 * Main
*/

if(DEV_MODE) console.warn("App running on DEV_MODE")

const location_search_input: HTMLInputElement = document.querySelector(".location_search_input");

location_search_input.addEventListener("input", async (e: any) => {
    if(!e.target.validity.valid && e.target.validity.valueMissing) return searchCity.ToggleResults(false)
    const input = e.target.value.replace(/\s/g, '')
    if(input.length <= 1) return searchCity.ToggleResults(false)
    const search_results = await weatherApi.SearchCity(e.target.value.trim(), HTTPS_SERVER, DEV_MODE)
    
    if(search_results.length > 0){
        searchCity.ToggleResults(true)
        searchCity.UpdateResults(search_results)
    } else searchCity.ToggleResults(false)

    window.currentCitySearchResults = search_results
})

location_search_input.addEventListener("focus", () => { if(location_search_input.validity.valid && window.currentCitySearchResults?.length > 0) searchCity.ToggleResults(true) });
location_search_input.addEventListener("focusout", () => { if(!location_search_input.validity.valid) searchCity.ToggleResults(false) });

export  {
    DEV_MODE,
    HTTPS_SERVER
}

declare global {
    interface Window {
        coords: GeolocationCoordinates,
        modules: {
            classes: Object,
            initialized: Object
        },
        currentCitySearchResults: Array<Object>,
        currentWeather: any,
        geolocation_state: String,
        current_geolocation_data: "saved" | "none"

        stringEncode: {
            str2buffer: Function,
            buffer2str: Function
        }
    }
}