import LocalStorage from "./LocalStorage";
import * as _ from "lodash";
const localStorage = new LocalStorage({
    key: "_weatherdata_"
});
export default class Settings {
    constructor(Config = {
        settings_button_container: document.querySelector(".settings_button_container"),
        settings_container: document.querySelector(".settings_container"),
        bg_blur: document.querySelector(".bg_blur"),
        settings_header_close: document.querySelector(".settings_header_close"),
        settings_container_item_template: document.querySelector(".settings_container_item_template"),
        settings_container_content: document.querySelector(".settings_container_content")
    }, _settings = [
        { name: "Request Protocol", description: "Wich protocol is should use for the api requests. (http = faster)", type: "selection", selections: ["HTTPS", "HTTP"], default_selection: "HTTPS", selected_index: 0 },
        { name: "Remember Location", description: "Saves your selected city and automatically loads it after entering the website again.", type: "selection", selections: ["YES", "NO"], default_selection: "YES", selected_index: 0 },
    ]) {
        this.Config = Config;
        this._settings = _settings;
        console.info("Initializing settings...");
        const init_start_tick = new Date().getTime();
        let ls_settingsdata = localStorage.GetKey("settings");
        if (_.isUndefined(ls_settingsdata)) {
            localStorage.Set("settings", JSON.stringify({}));
            ls_settingsdata = {};
        }
        this._settings.forEach(setting => {
            var _a, _b;
            const item = this.Config.settings_container_item_template;
            const cloned_item = item.content.cloneNode(true).childNodes[1];
            const settings_input_selection = cloned_item.querySelector(".settings_input_selection");
            const sdesc = cloned_item.querySelector(".sdesc");
            const name_index = setting.name.replace(/\s+/gm, "_").toLowerCase();
            const default_selection_index = setting.selections.indexOf(setting.default_selection);
            const selected_index = ((_a = ls_settingsdata[name_index]) === null || _a === void 0 ? void 0 : _a.state) || default_selection_index;
            if (ls_settingsdata[name_index]) {
                const saved_index = (_b = ls_settingsdata[name_index]) === null || _b === void 0 ? void 0 : _b.state;
                setting.default_selection = setting.selections[saved_index];
            }
            else {
                ls_settingsdata[name_index] = { state: default_selection_index };
                localStorage.Set("settings", JSON.stringify(ls_settingsdata));
            }
            setting.selected_index = selected_index;
            sdesc.textContent = setting.description;
            cloned_item.querySelector(`[sindex='${selected_index}']`).classList.add("sinput_selected");
            cloned_item.querySelector(".settings_container_item_name").textContent = setting.name;
            cloned_item.querySelector(".settings_container_item_desc").addEventListener("mouseenter", () => sdesc.classList.remove("hide"));
            cloned_item.querySelector(".settings_container_item_desc").addEventListener("mouseleave", () => sdesc.classList.add("hide"));
            setting.selections.forEach(selection => {
                const selection_index = setting.selections.indexOf(selection);
                const element = settings_input_selection.querySelector(`[sindex='${selection_index}']`);
                element.textContent = selection;
                element.addEventListener("click", () => {
                    ls_settingsdata[name_index].state = selection_index;
                    localStorage.Set("settings", JSON.stringify(ls_settingsdata));
                    cloned_item.querySelectorAll("[sindex]").forEach(e => e.classList.remove("sinput_selected"));
                    element.classList.add("sinput_selected");
                });
            });
            this.Config.settings_container_content.appendChild(cloned_item);
        });
        console.info(`Settings initalized! (took ${new Date().getTime() - init_start_tick}ms)`);
    }
    ToggleSettingsContainer(State) {
        const element = this.Config.settings_container;
        const bg_blur = this.Config.bg_blur;
        if (!element)
            return console.warn("Missing 'settings_container' element.");
        if (State == undefined) {
            element.classList.toggle("hide");
            bg_blur && bg_blur.classList.toggle("hide");
        }
        else {
            if (State == true) {
                element.classList.remove("hide");
                bg_blur && bg_blur.classList.remove("hide");
            }
            else if (State == false) {
                element.classList.add("hide");
                bg_blur && bg_blur.classList.add("hide");
            }
        }
    }
}
