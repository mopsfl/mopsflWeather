import { localStorageKey } from ".."
import LocalStorage from "./LocalStorage"
import { SettingsValues } from "./Settings"
import Strings from "./Strings"
import self from "./Languages"

export default {
    ["Deutsch - DE"]: "de",
    ["English - EN"]: "en",
    ["French - FR"]: "fr",
    ["Russian - RU"]: "ru",
    ["Japanese - JA"]: "ja",
    ["Arabic - AR"]: "ar",
    ["Polish - PL"]: "pl",

    UpdateStrings(language?: string) {
        let _settings: SettingsValues = LocalStorage.GetKey(localStorageKey, "settings"),
            _language = language || self[_settings.setting_language] || "en"

        $("*[data-stringname]").each((i, e) => {
            if (language === "n/a") {
                $(e).text("N/A")
                return
            }

            let _string = (Strings[_language] || Strings.de)[$(e).attr("data-stringname") || "en"]

            if (_string) $(e).text(_string)
        })
    }
}