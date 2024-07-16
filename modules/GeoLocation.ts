import { localStorageKey, notifications } from ".."
import Loading from "./Loading"
import LocalStorage from "./LocalStorage"
import { _searchBoxLoadingSpinner } from "./SearchCity"
import { SettingsValues } from "./Settings"
import WeatherApi from "./WeatherApi"

export default {
    GetGeoLocation(positionCallback: PositionCallback, errorCallback: PositionErrorCallback) {
        const _settings: SettingsValues = LocalStorage.GetKey(localStorageKey, "settings")
        navigator.geolocation.getCurrentPosition(positionCallback, errorCallback, {
            enableHighAccuracy: _settings.high_accuracy_location,
            timeout: 10000,
            maximumAge: 120000,
        })
    },

    async QueryPermission(permissionName: PermissionName) {
        return await navigator.permissions.query({ name: permissionName })
    },

    GetGeoLocationErrorCallback(err: GeolocationPositionError) {
        console.error(err)
        switch (err.code) {
            case 1:
                Loading.Toggle(true)
                WeatherApi.GetOpenWeatherData(undefined, true).then(WeatherApi.UpdateOpenWeatherData)
                WeatherApi.GetWeatherApiData({ name: "Frankfurt" }).then(WeatherApi.UpdateWeatherApiData)
                Loading.Toggle(false)
                break;
            case 2:
            case 3:
                notifications.error("GeolocationPositionError", err.message)
                break;
            default: break;
        }
    }
}