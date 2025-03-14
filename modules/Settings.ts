import { localStorageKey } from "..";
import { CustomEvents } from "./CustomEvents";
import LocalStorage from "./LocalStorage";

export default class Settings {
    constructor(
        public config = {
            settingUpdateEventName: "onSettingUpdate",
            storage_key: localStorageKey,
            default_settings: {
                ["settings"]: {
                    ["setting_language"]: "Deutsch - DE",
                    ["setting_tempunit"]: "Celsius",
                    ["animated_weather_icons"]: true,
                    ["high_accuracy_location"]: true,
                    ["weather_alerts"]: true,
                }
            }
        },
        public settingUpdateEvent?: CustomEvent,
    ) {
        if (!LocalStorage.Exists(this.config.storage_key)) {
            LocalStorage.Create(this.config.storage_key, this.config.default_settings)
        }
    }

    init(reset?: boolean) {
        this.settingUpdateEvent = CustomEvents.CreateEvent(this.config.settingUpdateEventName)
        let _settings: any

        if (reset) {
            LocalStorage.Clear(this.config.storage_key)
            LocalStorage.Create(this.config.storage_key, this.config.default_settings)
            CustomEvents.DispatchEvent(window, this.settingUpdateEvent)
        }

        if (!LocalStorage.GetKey(this.config.storage_key, "settings")) LocalStorage.Set(this.config.storage_key, "settings", this.config.default_settings)
        _settings = LocalStorage.GetKey(this.config.storage_key, "settings")
        document.querySelectorAll(".setting").forEach(setting => {
            const input: HTMLInputElement = setting.querySelector("input"),
                setting_id = $(input).attr("setting-id")

            if (setting_id) {
                input.addEventListener("input", (e) => {
                    const [setting_name, setting_id, value] = this.HandleInput(e, setting)
                    this.UpdateSetting(setting_name, setting_id, value)
                })
                let value = _settings[setting_id]
                if (value === undefined) {
                    value = this.config.default_settings.settings[setting_id];
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

                    if (value === undefined) {
                        value = this.config.default_settings.settings[setting_id];
                        _settings[setting_id] = value
                        console.warn(`[Settings]: added missing setting > ${setting_id}`);
                    }

                    input.value = value
                    _dropdown_select.value = value
                    _dropdown_select.addEventListener("change", (e) => {
                        const [setting_name, setting_id, value] = this.HandleInput(e, setting)
                        this.UpdateSetting(setting_name, setting_id, value)
                    })
                }
            }
        })

        document.querySelector("#resetdefault").addEventListener("click", (e) => {
            this.init(true)
            console.log("Reseted settings to default", this.config.default_settings);
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
        LocalStorage.Edit(this.config.storage_key, "settings", id, value)
        console.log(`Saved '${name}' setting to localStorage > ${value}`);

        CustomEvents.DispatchEvent(window, this.settingUpdateEvent)
    }
}

export interface SettingsValues {
    setting_language: string,
    setting_tempunit: "Celsius" | "Fahrenheit",
    animated_weather_icons: boolean,
    high_accuracy_location: boolean,
    weather_alerts: boolean
}