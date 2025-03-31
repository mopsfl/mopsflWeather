import { App } from "../Types/Global";
import Strings from "./Strings";
import { CustomEvents } from "../Misc/CustomEvents";

export default class Settings {
    constructor(
        public events: Map<string, CustomEvent> = new Map(),
        public config = {
            settingUpdateEventName: "onSettingUpdate",
            settings_key: "settings",
            default_settings: {
                ["setting_language"]: Strings.LanguagesCodes[navigator.language] || Strings.LanguagesCodes.en,
                ["setting_tempunit"]: "Celsius",
                ["animated_weather_icons"]: true,
                ["high_accuracy_location"]: false,
                ["weather_alerts"]: true,
            }
        },
        public settingUpdateEvent?: CustomEvent,
    ) {
        if (!App.storage.GetKey(this.config.settings_key)) {
            App.storage.Set(this.config.settings_key, this.config.default_settings)
        }
    }

    init(reset?: boolean) {
        //this.settingUpdateEvent = CustomEvents.CreateEvent(this.config.settingUpdateEventName)
        let _settings: any

        if (reset) {
            App.storage.DeleteKey(this.config.settings_key)
            App.storage.Set(this.config.settings_key, this.config.default_settings)
            console.log("Reseted settings to default", this.config.default_settings);
        }

        if (!App.storage.GetKey(this.config.settings_key)) App.storage.Set(this.config.settings_key, this.config.default_settings)
        _settings = App.storage.GetKey(this.config.settings_key)

        document.querySelectorAll(".setting").forEach(setting => {
            const input: HTMLInputElement = setting.querySelector("input"),
                setting_id = $(input).attr("setting-id")

            if (setting_id) {
                if (!this.events.get(setting_id)) {
                    this.events.set(setting_id, CustomEvents.CreateEvent(setting_id))
                }

                input.addEventListener("input", (e) => {
                    const [setting_name, setting_id, value] = this.HandleInput(e, setting)
                    this.UpdateSetting(setting_name, setting_id, value)
                })

                let value = _settings[setting_id]
                if (value === undefined) {
                    value = this.config.default_settings[setting_id];
                    _settings[setting_id] = value
                    this.UpdateSetting(setting_id, setting_id, value)
                    console.warn(`[Settings]: added missing setting > ${setting_id} = ${_settings[setting_id]}`);
                }

                switch (input.type) {
                    case "checkbox":
                        input.checked = value
                        break;
                    case "range":
                        const range_text: HTMLElement = setting.querySelector(".slider-value"),
                            range_text_value = range_text.attributes.getNamedItem("value-type").value || ""
                        range_text.innerText = `${value}${range_text_value}`
                        input.value = value
                        break;
                    case "text":
                    case "password":
                        input.value = value
                        break;
                    default:
                        console.warn(`Invalid input type <${input.type}>`)
                        break;
                }
            } else {
                if (input.classList.contains("select-dropdown")) {
                    let _dropdown_select = $(input).parent()[0].querySelector("select"),
                        setting_id = setting.getAttribute("setting-id"),
                        value = _settings[setting_id]

                    if (!this.events.get(setting_id)) {
                        this.events.set(setting_id, CustomEvents.CreateEvent(setting_id))
                    }

                    if (value === undefined) {
                        value = this.config.default_settings[setting_id];
                        _settings[setting_id] = value
                        console.warn(`[Settings]: added missing setting > ${setting_id}`);
                    }

                    input.value = value
                    //_dropdown_select.value = value
                    _dropdown_select.addEventListener("change", (e) => {
                        const [setting_name, setting_id, value] = this.HandleInput(e, setting)
                        this.UpdateSetting(setting_name, setting_id, value)
                    })
                }
            }
        })
    }

    HandleInput(e: Event, setting: Element): [string, string, boolean | string | number] {
        const name: HTMLElement = setting.querySelector(".setting-name"),
            setting_id = $(setting.querySelector("input")).attr("setting\-id") || $(setting).attr("setting-id"),
            input: HTMLInputElement = setting.querySelector("input")

        let new_value: boolean | string | number
        if (e.target instanceof HTMLInputElement && e.target.type === "range") {
            const range_text: HTMLElement = setting.querySelector(".slider-value"),
                range_text_value = range_text.attributes.getNamedItem("value-type").value || ""
            new_value = input.value
            range_text.innerText = `${input.value}${range_text_value}`
        } else if (e.target instanceof HTMLInputElement && e.target.type === "checkbox") {
            new_value = input.checked
        } else if (e.target instanceof HTMLInputElement && e.target.type === "text" || "password") {
            new_value = input.value
        } else {
            console.warn("UNKNOWN SETTING TYPE:", e, setting)
        }
        return [name.innerText, setting_id, new_value]
    }

    UpdateSetting(name: string, id: string, value: boolean | string | number) {
        App.storage.Edit(this.config.settings_key, id, value)
        console.log(`Saved '${name}' setting to localStorage > ${value}`);

        if (this.events.has(id)) {
            const event = this.events.get(id)

            CustomEvents.DispatchEvent(window, event)
        }
    }

    GetSettings(): SettingsValues {
        return App.storage.GetKey(this.config.settings_key) || this.config.default_settings
    }
}

export interface SettingsValues {
    setting_language: string,
    setting_tempunit: "Celsius" | "Fahrenheit",
    animated_weather_icons: boolean,
    high_accuracy_location: boolean,
    weather_alerts: boolean
}