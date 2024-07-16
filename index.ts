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
import Util from "./modules/Util";
import Loading from "./modules/Loading";
import toastr from "toastr"

const _dev = location.hostname === "localhost",
    languageStrings = Strings.de,
    localStorageKey = "__mopsflweather"

const settings = new Settings()

jQuery(async () => {
    M.AutoInit()
    const SearchCityInput = jQuery(".searchcity_input"),
        SettingsModal = M.Modal.getInstance(document.getElementById("settingsmodal")),
        weatherForecastItems = document.querySelector('.weather-forecast-items')

    settings.init()
    SearchCity.InitInput(SearchCityInput)
    Languages.UpdateStrings()

    toastr.options = {
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
                Loading.Toggle(true)
                await WeatherApi.GetOpenWeatherData(undefined, true).then(WeatherApi.UpdateOpenWeatherData)
                await WeatherApi.GetWeatherApiData({ name: "Frankfurt" }).then(WeatherApi.UpdateWeatherApiData)
                Loading.Toggle(false)
                break;
            case "granted":
            case "prompt":
                Loading.Toggle(true)
                GeoLocation.GetGeoLocation(async (pos: GeolocationPosition) => {
                    await WeatherApi.GetOpenWeatherData({ lat: pos.coords.latitude, lon: pos.coords.longitude }).then(WeatherApi.UpdateOpenWeatherData)
                    await WeatherApi.GetWeatherApiData({ lat: pos.coords.latitude, lon: pos.coords.longitude }).then(WeatherApi.UpdateWeatherApiData)
                    Loading.Toggle(false)
                }, GeoLocation.GetGeoLocationErrorCallback)
                break;
        }
    }).catch(console.error)

    CustomEvents.AddEventListener(window, settings.config.settingUpdateEventName, (e) => {
        Languages.UpdateStrings()
    })

    weatherForecastItems.addEventListener('wheel', function (e: any) {
        e.preventDefault();
        weatherForecastItems.scrollLeft += e.deltaY * 0.2
    }, { passive: false });

    window["WeatherIcons"] = WeatherIcons
    window["Time"] = Time
    window["lstorage"] = LocalStorage
    window["Languages"] = Languages
    window["CustomEvents"] = CustomEvents
    _dev && (window["WeatherApi"] = WeatherApi)
    window["SearchCity"] = SearchCity
    window["Util"] = Util
    window["Settings"] = settings
    window["GeoLocation"] = GeoLocation
    window["Loading"] = Loading
})

declare global {
    interface Window { }
}

export { _dev, languageStrings, localStorageKey, settings }