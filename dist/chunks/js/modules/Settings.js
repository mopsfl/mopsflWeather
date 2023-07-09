export default class Settings {
    constructor(Config = {
        settings_button_container: document.querySelector(".settings_button_container"),
        settings_container: document.querySelector(".settings_container"),
        bg_blur: document.querySelector(".bg_blur"),
        settings_header_close: document.querySelector(".settings_header_close"),
        settings_container_item_template: document.querySelector(".settings_container_item_template"),
        settings_container_content: document.querySelector(".settings_container_content")
    }, _settings = [
        { name: "Request Protocol", description: "Wich protocol is should use for the api requests. (http = faster)", type: "selection", selections: ["HTTPS", "HTTP"], default_selection: "HTTPS" },
        { name: "Remember Location", description: "Saves your selected city and automatically loads it after entering the website again.", type: "selection", selections: ["YES", "NO"], default_selection: "YES" },
    ]) {
        this.Config = Config;
        this._settings = _settings;
        this._settings.forEach(setting => {
            const item = this.Config.settings_container_item_template;
            const cloned_item = item.content.cloneNode(true).childNodes[1];
            const settings_input_selection = cloned_item.querySelector(".settings_input_selection");
            const sdesc = cloned_item.querySelector(".sdesc");
            sdesc.textContent = setting.description;
            cloned_item.querySelector(".settings_container_item_name").textContent = setting.name;
            settings_input_selection.querySelector(`[sindex='${setting.selections.indexOf(setting.default_selection)}']`).classList.add("sinput_selected");
            cloned_item.querySelector(".settings_container_item_desc").addEventListener("mouseenter", () => sdesc.classList.remove("hide"));
            cloned_item.querySelector(".settings_container_item_desc").addEventListener("mouseleave", () => sdesc.classList.add("hide"));
            setting.selections.forEach(selection => {
                settings_input_selection.querySelector(`[sindex='${setting.selections.indexOf(selection)}']`).textContent = selection;
            });
            this.Config.settings_container_content.appendChild(cloned_item);
        });
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
