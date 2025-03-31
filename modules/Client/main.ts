import GeoLocation from "../API/GeoLocation";
import { CustomEvents } from "../Misc/CustomEvents";
import { App } from "../Types/Global";
import Page from "./Page";
import SearchCity from "./SearchCity";
import Strings from "./Strings";

export class Client {
    public language: string
    private _initialized = false
    private _initTime: number

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

        Strings.Update()
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

        // Weather Data Init

        GeoLocation.GetLocation().then(location => {
            App.api.LoadWeatherData({
                lat: location.coords.latitude,
                lng: location.coords.longitude
            })
        }).catch((err: GeolocationPositionError) => {
            App.api.LoadWeatherData(undefined, true)

            if (err.code !== 1) {
                console.error(err)
                App.notifications.error("GeoLocation Error", err.message)
            }
        })

        // Settings Callbacks

        CustomEvents.AddEventListener(window, "setting_language", () => {
            Strings.Update()
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
        })

        this.language = Strings.LanguagesCodes[App.settings.GetSettings().setting_language]
        console.warn(`client initialized! (took ${new Date().getTime() - this._initTime}ms)`)
        return this;
    }
}
