import { localStorageKey } from ".."
import LocalStorage from "./LocalStorage"
import { SettingsValues } from "./Settings"
import Strings from "./Strings"
import self from "./Languages"

export default {
    ["Deutsch - DE"]: "de",
    ["English - EN"]: "en",

    UpdateStrings() {
        $("*[data-stringname]").each((i, e) => {
            let _settings: SettingsValues = LocalStorage.GetKey(localStorageKey, "settings"),
                _string = Strings[self[_settings.setting_language || "de"]][$(e).attr("data-stringname")]
            if (_string) $(e).text(_string)
        })
    }
}