"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const GeoLocation_1 = __importDefault(require("../API/GeoLocation"));
const CustomEvents_1 = require("../Misc/CustomEvents");
const Global_1 = require("../Types/Global");
const Page_1 = __importDefault(require("./Page"));
const SearchCity_1 = __importDefault(require("./SearchCity"));
const Strings_1 = __importDefault(require("./Strings"));
class Client {
    language;
    _initialized = false;
    _initTime;
    constructor() {
        this._initTime = new Date().getTime();
    }
    init() {
        if (this._initialized) {
            console.warn("client already initialized!");
            return this;
        }
        ;
        this._initialized = true;
        M.AutoInit();
        const SettingsModal = M.Modal.getInstance(Global_1.App.elements.Misc.SETTINGS_MODAL.get(0));
        Strings_1.default.Update();
        SearchCity_1.default.init(Global_1.App.elements.Misc.SEARCH_CITY_INPUT);
        Global_1.App.elements.Containers.WEATHER_DATA.addClass("blur");
        Global_1.App.settings.init();
        if (SettingsModal) {
            Global_1.App.elements.Misc.SETTINGS_BUTTON.on("click", () => SettingsModal.open());
        }
        else
            console.warn("failed to get <SettingsModal>");
        Global_1.App.elements.Misc.RESET_DEFAULT.on("click", () => {
            Global_1.App.settings.init(true);
        });
        $(".expandclick").each((i, e) => {
            const element = $(e);
            element.on("click", () => {
                element.toggleClass("expand");
            });
        });
        // Weather Data Init
        GeoLocation_1.default.GetLocation().then(location => {
            Global_1.App.api.LoadWeatherData({
                lat: location.coords.latitude,
                lng: location.coords.longitude
            });
        }).catch((err) => {
            Global_1.App.api.LoadWeatherData(undefined, true);
            if (err.code !== 1) {
                console.error(err);
                Global_1.App.notifications.error("GeoLocation Error", err.message);
            }
        });
        // Settings Callbacks
        CustomEvents_1.CustomEvents.AddEventListener(window, "setting_language", () => {
            Strings_1.default.Update();
        });
        CustomEvents_1.CustomEvents.AddEventListener(window, "setting_tempunit", () => {
            Page_1.default.UpdateTemperatureValues();
        });
        CustomEvents_1.CustomEvents.AddEventListener(window, "animated_weather_icons", () => {
            const settings = Global_1.App.settings.GetSettings();
            $("img").each((i, e) => {
                if ($(e).hasClass("static-icon"))
                    return;
                $(e).attr("src", $(e).attr("src")?.replace(settings.animated_weather_icons ? "static" : "animated", settings.animated_weather_icons ? "animated" : "static"));
            });
        });
        CustomEvents_1.CustomEvents.DispatchEvent(window, Global_1.App.settings.events.get("animated_weather_icons"));
        // Custom Scrolling
        $(".mouseScrollEvent").each((i, element) => {
            element.addEventListener('wheel', function (e) {
                e.preventDefault();
                element.scrollLeft += e.deltaY * 0.2;
            }, { passive: false });
        });
        this.language = Strings_1.default.LanguagesCodes[Global_1.App.settings.GetSettings().setting_language];
        console.warn(`client initialized! (took ${new Date().getTime() - this._initTime}ms)`);
        return this;
    }
}
exports.Client = Client;
