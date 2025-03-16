import { localStorageKey } from ".."
import LocalStorage from "./LocalStorage"
import { SettingsValues } from "./Settings"
import Strings from "./Strings"
import self from "./Languages"

export default {
    ["Deutsch - DE"]: "de",
    ["English - EN"]: "en",
    ["LanguagesCodes"]: { "de": "Deutsch - DE", "en": "English - EN" },

    UpdateStrings(language?: string) {
        let _settings: SettingsValues = LocalStorage.GetKey(localStorageKey, "settings"),
            _language = language || self[_settings.setting_language] || "en"

        $("*[data-stringname]").each((i, e) => {
            const element = $(e)

            if (language === "n/a") {
                element.text("N/A")
                return
            }

            let stringName = element.attr("data-stringname"),
                _string = (Strings[_language] || Strings.de)[stringName || "en"]
            if (!_string) {
                element.text(`${_language}_${stringName}`)
            } else if (typeof _string == "string") {
                if (stringName.startsWith("TOOLTIP")) {
                    element.attr("data-tooltip", _string)
                } else if (stringName.startsWith("PLACEHOLDER")) {
                    element.attr("placeholder", _string)
                } else element.text(_string)
            } else if (typeof _string == "object") {
                var keyIndex = parseInt(element.attr("data-stringindex"))

                if (keyIndex) {
                    element.text(_string[keyIndex])
                } else element.text(`${_language}_${stringName}`)
            } else {
                element.text(`${_language}_${stringName}`)
            }
        })
    }
}