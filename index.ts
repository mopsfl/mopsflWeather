import { GetGeoLocation } from "./modules/GeoLocation.js"
import WeatherApi from "./modules/WeatherApi.js"
import WeatherIcon from "./modules/WeatherIcon.js"

const weatherApi = new WeatherApi()
const weatherIcon = new WeatherIcon()

GetGeoLocation(SetGeoLocation, ErrorCallback)

/**
 * Functions
*/

function SetGeoLocation(pos: GeolocationPosition) { window["coords"] = pos.coords }
function ErrorCallback(err: any) { throw err }

const currentWeather = await weatherApi.GetCurrentWeather()
window["currentWeather"] = currentWeather