import GeoLocation from "../API/GeoLocation";
import { CustomEvents } from "../Misc/CustomEvents";
import { App } from "../Types/Global";
import Page from "./Page";
import SearchCity from "./SearchCity";
import Strings from "./Strings";
import { WeatherRequestArguments } from "../Types/Weather";
import Loading from "./Loading";

export class Client {
    public language: string
    private _initialized = false
    private _initTime: number
    private _lastLocationLoad: number

    constructor() {
        this._initTime = new Date().getTime()
    }

    init() {
        if (this._initialized) {
            console.warn("client already initialized!");
            return this
        }; this._initialized = true

        M.AutoInit()
        const SettingsModal = M.Modal.getInstance(App.elements.Misc.SETTINGS_MODAL.get(0))

        SearchCity.init(App.elements.Misc.SEARCH_CITY_INPUT)

        App.elements.Containers.WEATHER_DATA.addClass("blur")
        App.settings.init()

        if (SettingsModal) {
            App.elements.Misc.SETTINGS_BUTTON.on("click", () => SettingsModal.open())
        } else console.warn("failed to get <SettingsModal>")

        App.elements.Misc.RESET_DEFAULT.on("click", () => {
            App.settings.init(true)
        })

        $(".expandclick").each((i, e) => {
            const element = $(e)

            element.on("click", () => {
                element.toggleClass("expand")
            })
        })

        // Load Current Location Button

        App.elements.Misc.LOAD_CURRENT_LOCATION.on("click", () => {
            this.LoadCurrentLocation()
        })

        // Settings Callbacks

        CustomEvents.AddEventListener(window, "setting_language", () => {
            Strings.Update()

            const language = App.settings.GetSettings().setting_language
            this.language = Strings.LanguagesCodes[language !== "System" ? language : Strings.LanguagesCodes[navigator.language]]
        }); CustomEvents.AddEventListener(window, "setting_tempunit", () => {
            Page.UpdateTemperatureValues()
        }); CustomEvents.AddEventListener(window, "animated_weather_icons", () => {
            const settings = App.settings.GetSettings()
            $("img").each((i, e) => {
                if ($(e).hasClass("static-icon")) return
                $(e).attr("src", $(e).attr("src")?.replace(settings.animated_weather_icons ? "static" : "animated", settings.animated_weather_icons ? "animated" : "static"))
            })
        })

        CustomEvents.DispatchEvent(window, App.settings.events.get("animated_weather_icons"))

        // Custom Scrolling

        $(".mouseScrollEvent").each((i, element) => {
            element.addEventListener('wheel', function (e: any) {
                e.preventDefault();
                element.scrollLeft += e.deltaY * 0.2
            }, { passive: false });
        });

        const language = App.settings.GetSettings().setting_language
        this.language = Strings.LanguagesCodes[language !== "System" ? language : Strings.LanguagesCodes[navigator.language]]

        Strings.Update()

        console.warn(`client initialized! (took ${new Date().getTime() - this._initTime}ms)`)
        return this;
    }

    LoadInitWeatherData() {
        const lastCity: WeatherRequestArguments = App.storage.GetKey("lastcity"),
            settings = App.settings.GetSettings()

        if ((lastCity && ((lastCity.lat && lastCity.lng) || lastCity.name)) && settings.remember_location) {
            App.api.LoadWeatherData(lastCity)
        } else {
            this.LoadCurrentLocation(true)
        }
    }

    async LoadCurrentLocation(loadDefaultOnFail?: boolean) {
        if (this._lastLocationLoad && (new Date().getTime() - this._lastLocationLoad) < 1000) return;
        this._lastLocationLoad = new Date().getTime()

        App.elements.Containers.WEATHER_DATA.addClass("blur")
        Loading.Toggle(App.elements.Misc.WEATHER_DATA_LOADING, true)

        GeoLocation.GetLocation().then(async location => {
            await App.api.LoadWeatherData({
                lat: location.coords.latitude,
                lng: location.coords.longitude
            })
        }).catch(async (err: GeolocationPositionError) => {
            if (loadDefaultOnFail) await App.api.LoadWeatherData(undefined, true)
            if (err.code !== 1) {
                console.error(err)
                App.notifications.error("GeoLocation Error", err.message)
            } else {
                this._lastLocationLoad = 0
                if (err.code === 1) App.notifications.warn("GeoLocation Error", Strings.GetString("MISSING_LOCATION_PERMISSION"), true)
            }
        })
    }
}
