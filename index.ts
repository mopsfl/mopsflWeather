const DEV_MODE = false
const HTTPS_SERVER = true

import GetGeoLocation from "./modules/GeoLocation.js"
import WeatherApi from "./modules/WeatherApi.js"
import WeatherIcon from "./modules/WeatherIcon.js"
import SearchCity from "./modules/SearchCity.js"

const weatherApi = new WeatherApi()
const weatherIcon = new WeatherIcon()
const searchCity = new SearchCity({
    location_search_results: document.querySelector(".location_search_results"),
    location_search_input: document.querySelector(".location_search_input"),
    location_search_result_template: document.querySelector(".location_search_result_template")
})

GetGeoLocation(SetGeoLocation, ErrorCallback)

/**
 * Functions
*/

function SetGeoLocation(pos: GeolocationPosition) { window["coords"] = pos.coords }
function ErrorCallback(err: any) { throw err }

/**
 * Main
*/

if(DEV_MODE) console.warn("App running on DEV_MODE")

const currentWeather = await weatherApi.GetCurrentWeather(HTTPS_SERVER, DEV_MODE)
const location_search_input: HTMLInputElement = document.querySelector(".location_search_input")
window["currentWeather"] = currentWeather

location_search_input.addEventListener("input", async (e: any) => {
    if(!e.target.validity.valid && e.target.validity.valueMissing) return searchCity.ToggleResults(false)
    const input = e.target.value.replace(/\s/g, '')
    if(input.length <= 0) return searchCity.ToggleResults(false)
    const search_results = await weatherApi.SearchCity(e.target.value.trim(), HTTPS_SERVER, DEV_MODE)

    if(search_results.length > 0){
        searchCity.ToggleResults(true)
        searchCity.UpdateResults(search_results)
    } else searchCity.ToggleResults(false)
})

location_search_input.addEventListener("focus", () => { if(location_search_input.validity.valid) searchCity.ToggleResults(true) })
location_search_input.addEventListener("focusout", () => { if(!location_search_input.validity.valid) searchCity.ToggleResults(false) })