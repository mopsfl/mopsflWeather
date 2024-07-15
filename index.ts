import jQuery from "jquery";
import SearchCity, { _searchBoxLoadingSpinner } from "./modules/SearchCity";
import Strings from "./modules/Strings";
import WeatherIcons from "./modules/WeatherIcons";
import Time from "./modules/Time";
import LocalStorage from "./modules/LocalStorage";
import GeoLocation from "./modules/GeoLocation";
import WeatherApi from "./modules/WeatherApi";
import Settings, { SettingsValues } from "./modules/Settings";
import Languages from "./modules/Languages";
import { CustomEvents } from "./modules/CustomEvents";

const _dev = location.hostname === "localhost",
    languageStrings = Strings.de,
    localStorageKey = "__mopsflweather"

const settings = new Settings()

jQuery(async () => {
    M.AutoInit()
    const SearchCityInput = jQuery(".searchcity_input"),
        SettingsModal = M.Modal.getInstance(document.getElementById("settingsmodal"))

    settings.init()
    SearchCity.InitInput(SearchCityInput)
    Languages.UpdateStrings()

    window.toastr.options = {
        "newestOnTop": true,
        "positionClass": "toast-bottom-right",
        "preventDuplicates": true,
    }

    $(".expandclick").each((i, e) => {
        $(e).on("click", () => {
            $(e).toggleClass("expand")
        })
    });
    $(".settings-btn").on("click", () => SettingsModal.open())

    if (!LocalStorage.Exists(localStorageKey)) LocalStorage.Create(localStorageKey, {})
    await GeoLocation.QueryPermission("geolocation").then(async res => {
        switch (res.state) {
            case "denied":
                _searchBoxLoadingSpinner.removeClass("hide")
                await WeatherApi.GetWeatherData(undefined, true).then(WeatherApi.UpdateWeatherData)
                _searchBoxLoadingSpinner.addClass("hide")
                break;
            case "granted":
            case "prompt":
                _searchBoxLoadingSpinner.removeClass("hide")
                GeoLocation.GetGeoLocation(async (pos: GeolocationPosition) => {
                    await WeatherApi.GetWeatherData({ lat: pos.coords.latitude, lon: pos.coords.longitude }).then(WeatherApi.UpdateWeatherData)
                    _searchBoxLoadingSpinner.addClass("hide")
                }, GeoLocation.GetGeoLocationErrorCallback)
                break;
        }
    }).catch(console.error)

    CustomEvents.AddEventListener(window, settings.config.settingUpdateEventName, (e) => {
        Languages.UpdateStrings()
    })

    window["icons"] = WeatherIcons
    window["time"] = Time
    window["lstorage"] = LocalStorage
    window["languages"] = Languages
    window["customevents"] = CustomEvents
})

declare global {
    interface Window {
        toastr: {
            info: any,
            success: any,
            warning: any,
            error: any,
            clear: any,
            version: string,
            options: Object
        },
    }
}

export { _dev, languageStrings, localStorageKey, settings }