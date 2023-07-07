const DEV_MODE = false
const HTTPS_SERVER = true

import WeatherApi, { CityData } from "./modules/WeatherApi"
import WeatherIcon from "./modules/WeatherIcon"
import SearchCity from "./modules/SearchCity"
import LoadingCircle from "./modules/LoadingCircle"
import LocalStorage from "./modules/LocalStorage"
import GeoLocation from "./modules/GeoLocation"
import Settings from "./modules/Settings"
import * as _ from "lodash"

const geoLocation = new GeoLocation()
const weatherApi = new WeatherApi()
const weatherIcon = new WeatherIcon()
const settings = new Settings()
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
    classes: { GeoLocation, WeatherApi, WeatherIcon, SearchCity, LoadingCircle, LocalStorage },
    initialized: { weatherApi, weatherIcon, localStorage, loadingCircle, searchCity, geoLocation, lodash: _ }
}

loadingCircle.ToggleLoading(true)

const weatherdata = localStorage.Parse()
window.ls_weatherdata = weatherdata

await navigator.permissions.query({ name: "geolocation" }).then(async (res) => {
    window.geolocation_state = res.state
    let saved_coords: GeolocationPosition

    if (localStorage.GetKey("coords")) {
        saved_coords = localStorage.GetKey("coords")
        window.current_geolocation_data = "saved"
    }
    if ((saved_coords && typeof (saved_coords) == "object")) {
        return SetGeoLocation(saved_coords, localStorage.GetKey("selected_city"))
    }

    window.current_geolocation_data = "none"

    if (window.geolocation_state == "denied") console.warn(new Error(`geolocation_state: ${window.geolocation_state}`))
    geoLocation.GetGeoLocation(SetGeoLocation, ErrorCallback)
})

/**
 * Functions
*/

async function SetGeoLocation(pos?: GeolocationPosition, selected_city?: CityData) {
    window.coords = pos?.coords
    localStorage.Set("coords", JSON.stringify(cloneAsObject(pos)))

    // Get Weather From Current GeoLocation
    const results = await weatherApi.GetWeatherData({
        lat: !selected_city ? window.coords.latitude : selected_city.lat,
        lon: !selected_city ? window.coords.longitude : selected_city.lng,
    })
    window.currentWeather = results
}

async function ErrorCallback(err: any) {
    console.error(err)
    if (window.current_geolocation_data == "none") {
        let saved_coords: CityData
        console.log(localStorage.GetKey("coords"))
        if (localStorage.GetKey("coords") || localStorage.GetKey("selected_city")) {
            saved_coords = localStorage.GetKey("coords") || localStorage.GetKey("selected_city")
            window.current_geolocation_data = "saved"
        }
        if ((saved_coords && typeof (saved_coords) == "object")) {
            return SetGeoLocation(null, saved_coords)
        } else {
            await weatherApi.UpdateCurrentWeather()
        }
    }
}

function cloneAsObject(obj: any) {
    if (obj === null || !(obj instanceof Object)) return obj
    var temp = (obj instanceof Array) ? [] : {};
    for (var key in obj) { temp[key] = cloneAsObject(obj[key]) }
    return temp;
}


if (DEV_MODE) console.warn("App running on DEV_MODE")

/**
 * Location Search
*/

const location_search_input: HTMLInputElement = document.querySelector(".location_search_input");

location_search_input.addEventListener("input", async (e: any) => {
    if (!e.target.validity.valid && e.target.validity.valueMissing) return searchCity.ToggleResults(false)
    const input = e.target.value.replace(/\s/g, '')
    if (input.length <= 1) return searchCity.ToggleResults(false)
    const search_results = await weatherApi.SearchCity(e.target.value.trim(), HTTPS_SERVER, DEV_MODE)

    if (search_results.length > 0) {
        searchCity.ToggleResults(true)
        searchCity.UpdateResults(search_results)
    } else searchCity.ToggleResults(false)

    window.currentCitySearchResults = search_results
})
location_search_input.addEventListener("focus", () => { if (location_search_input.validity.valid && window.currentCitySearchResults?.length > 0) searchCity.ToggleResults(true) });
location_search_input.addEventListener("focusout", () => { if (!location_search_input.validity.valid) searchCity.ToggleResults(false) });

/**
 * Settings
*/

settings.Config.settings_button_container.addEventListener("click", () => settings.ToggleSettingsContainer())
settings.Config.settings_header_close.addEventListener("click", () => settings.ToggleSettingsContainer(false))

export {
    DEV_MODE,
    HTTPS_SERVER
}

declare global {
    interface Window {
        coords: GeolocationCoordinates,
        modules: {
            classes: any,
            initialized: any
        },
        currentCitySearchResults: Array<Object>,
        currentWeather: any,
        geolocation_state: PermissionState,
        current_geolocation_data: "saved" | "none",
        ls_weatherdata: Object,

        stringEncode: {
            str2buffer: Function,
            buffer2str: Function
        },

        toastr: {
            info: any,
            success: any,
            warning: any,
            error: any,
            clear: any,
        },

        ripple: {
            registerRipples: Function
        }
    }
}