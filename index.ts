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
import Notifications from "./modules/Notifications";
import lodash from "lodash"

const _dev = location.hostname === "localhost",
    languageStrings = Strings.de,
    localStorageKey = "__mopsflweather"

const settings = new Settings(),
    notifications = new Notifications()

jQuery(async () => {
    M.AutoInit()
    const SearchCityInput = jQuery(".searchcity_input"),
        SettingsModal = M.Modal.getInstance(document.getElementById("settingsmodal")),
        weatherForecastItems = document.querySelector('.weather-forecast-items')

    settings.init()
    SearchCity.InitInput(SearchCityInput)
    Languages.UpdateStrings()

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
        const _settings: SettingsValues = LocalStorage.GetKey(localStorageKey, "settings")
        Languages.UpdateStrings()

        $("img").each((i, e) => {
            if ($(e).hasClass("static-icon")) return
            $(e).attr("src", $(e).attr("src")?.replace(_settings.animated_weather_icons ? "static" : "animated", _settings.animated_weather_icons ? "animated" : "static"))
        })
    })

    $(".mouseScrollEvent").each((i, element) => {
        element.addEventListener('wheel', function (e: any) {
            e.preventDefault();
            element.scrollLeft += e.deltaY * 0.2
        }, { passive: false });
    })

    $(".test-notif-btn").on("click", () => {
        let notifType = Math.floor(Math.random() * 3)
        console.log(notifType);
        switch (notifType) {
            case 0:
                notifications.info("Test Info Notification", "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam")
                break;
            case 1:
                notifications.warn("Test Warn Notification", "This is a really important warning and should be taken seriously.")
                break;
            case 2:
                notifications.error("Test Error Notification", "An unexpected test error has occurred.")
                break;
        }
    })

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
    window["Notifications"] = notifications
})

declare global {
    interface Window { }
}

export { _dev, languageStrings, localStorageKey, settings, notifications }