"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const CustomEvents_1 = require("./CustomEvents");
const LocalStorage_1 = __importDefault(require("./LocalStorage"));
class Settings {
    config;
    settingUpdateEvent;
    constructor(config = {
        settingUpdateEventName: "onSettingUpdate",
        storage_key: __1.localStorageKey,
        default_settings: {
            ["settings"]: {
                ["setting_language"]: "Deutsch - DE",
                ["setting_tempunit"]: "Celsius",
                ["animated_weather_icons"]: true,
                ["high_accuracy_location"]: false,
                ["weather_alerts"]: true,
            }
        }
    }, settingUpdateEvent) {
        this.config = config;
        this.settingUpdateEvent = settingUpdateEvent;
        if (!LocalStorage_1.default.Exists(this.config.storage_key)) {
            LocalStorage_1.default.Create(this.config.storage_key, this.config.default_settings);
        }
    }
    init(reset) {
        this.settingUpdateEvent = CustomEvents_1.CustomEvents.CreateEvent(this.config.settingUpdateEventName);
        let _settings;
        if (reset) {
            LocalStorage_1.default.Clear(this.config.storage_key);
            LocalStorage_1.default.Create(this.config.storage_key, this.config.default_settings);
            CustomEvents_1.CustomEvents.DispatchEvent(window, this.settingUpdateEvent);
        }
        if (!LocalStorage_1.default.GetKey(this.config.storage_key, "settings"))
            LocalStorage_1.default.Set(this.config.storage_key, "settings", this.config.default_settings);
        _settings = LocalStorage_1.default.GetKey(this.config.storage_key, "settings");
        document.querySelectorAll(".setting").forEach(setting => {
            const input = setting.querySelector("input"), setting_id = $(input).attr("setting-id");
            if (setting_id) {
                input.addEventListener("input", (e) => {
                    const [setting_name, setting_id, value] = this.HandleInput(e, setting);
                    this.UpdateSetting(setting_name, setting_id, value);
                });
                let value = _settings[setting_id];
                if (value === undefined) {
                    value = this.config.default_settings.settings[setting_id];
                    _settings[setting_id] = value;
                    this.UpdateSetting(setting_id, setting_id, value);
                    console.warn(`[Settings]: added missing setting > ${setting_id} = ${_settings[setting_id]}`);
                }
                switch (input.type) {
                    case "checkbox":
                        input.checked = value;
                        break;
                    case "range":
                        const range_text = setting.querySelector(".slider-value"), range_text_value = range_text.attributes.getNamedItem("value-type").value || "";
                        range_text.innerText = `${value}${range_text_value}`;
                        input.value = value;
                        break;
                    case "text":
                    case "password":
                        input.value = value;
                        break;
                    default:
                        console.warn(`Invalid input type <${input.type}>`);
                        break;
                }
            }
            else {
                if (input.classList.contains("select-dropdown")) {
                    let _dropdown_select = $(input).parent()[0].querySelector("select"), setting_id = setting.getAttribute("setting-id"), value = _settings[setting_id];
                    if (value === undefined) {
                        value = this.config.default_settings.settings[setting_id];
                        _settings[setting_id] = value;
                        console.warn(`[Settings]: added missing setting > ${setting_id}`);
                    }
                    input.value = value;
                    //_dropdown_select.value = value
                    _dropdown_select.addEventListener("change", (e) => {
                        const [setting_name, setting_id, value] = this.HandleInput(e, setting);
                        this.UpdateSetting(setting_name, setting_id, value);
                    });
                }
            }
        });
        document.querySelector("#resetdefault").addEventListener("click", (e) => {
            this.init(true);
            console.log("Reseted settings to default", this.config.default_settings);
        });
    }
    HandleInput(e, setting) {
        const name = setting.querySelector(".setting-name"), setting_id = $(setting.querySelector("input")).attr("setting\-id") || $(setting).attr("setting-id"), input = setting.querySelector("input");
        let new_value;
        if (e.target instanceof HTMLInputElement && e.target.type === "range") {
            const range_text = setting.querySelector(".slider-value"), range_text_value = range_text.attributes.getNamedItem("value-type").value || "";
            new_value = input.value;
            range_text.innerText = `${input.value}${range_text_value}`;
        }
        else if (e.target instanceof HTMLInputElement && e.target.type === "checkbox") {
            new_value = input.checked;
        }
        else if (e.target instanceof HTMLInputElement && e.target.type === "text" || "password") {
            new_value = input.value;
        }
        else {
            console.warn("UNKNOWN SETTING TYPE:", e, setting);
        }
        return [name.innerText, setting_id, new_value];
    }
    UpdateSetting(name, id, value) {
        LocalStorage_1.default.Edit(this.config.storage_key, "settings", id, value);
        console.log(`Saved '${name}' setting to localStorage > ${value}`);
        CustomEvents_1.CustomEvents.DispatchEvent(window, this.settingUpdateEvent);
    }
}
exports.default = Settings;
