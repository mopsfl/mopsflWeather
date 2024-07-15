import { localStorageKey } from ".."
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
                _searchBoxLoadingSpinner.removeClass("hide")
                WeatherApi.GetWeatherData(undefined, true).then(WeatherApi.UpdateWeatherData)
                _searchBoxLoadingSpinner.addClass("hide")
                break;
            case 2:
            case 3:
                window.toastr.error(err.message, "GeolocationPositionError")
                break;
            default: break;
        }
    }
}