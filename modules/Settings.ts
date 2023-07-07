export default class Settings {
    constructor(
        public Config = {
            settings_button_container: document.querySelector(".settings_button_container"),
            settings_container: document.querySelector(".settings_container"),
            bg_blur: document.querySelector(".bg_blur"),
            settings_header_close: document.querySelector(".settings_header_close")
        }
    ) { }

    ToggleSettingsContainer(State?: boolean) {
        const element = this.Config.settings_container
        const bg_blur = this.Config.bg_blur
        if (!element) return console.warn("Missing 'settings_container' element.")

        if (State == undefined) {
            element.classList.toggle("hide")
            bg_blur && bg_blur.classList.toggle("hide")
        } else {
            if (State == true) {
                element.classList.remove("hide")
                bg_blur && bg_blur.classList.remove("hide")
            } else if (State == false) {
                element.classList.add("hide")
                bg_blur && bg_blur.classList.add("hide")
            }
        }
    }
}