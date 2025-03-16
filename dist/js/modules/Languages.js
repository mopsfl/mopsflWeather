"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const LocalStorage_1 = __importDefault(require("./LocalStorage"));
const Strings_1 = __importDefault(require("./Strings"));
const Languages_1 = __importDefault(require("./Languages"));
exports.default = {
    ["Deutsch - DE"]: "de",
    ["English - EN"]: "en",
    ["LanguagesCodes"]: { "de": "Deutsch - DE", "en": "English - EN" },
    UpdateStrings(language) {
        let _settings = LocalStorage_1.default.GetKey(__1.localStorageKey, "settings"), _language = language || Languages_1.default[_settings.setting_language] || "en";
        $("*[data-stringname]").each((i, e) => {
            const element = $(e);
            if (language === "n/a") {
                element.text("N/A");
                return;
            }
            let stringName = element.attr("data-stringname"), _string = (Strings_1.default[_language] || Strings_1.default.de)[stringName || "en"];
            if (!_string) {
                element.text(`${_language}_${stringName}`);
            }
            else if (typeof _string == "string") {
                if (stringName.startsWith("TOOLTIP")) {
                    element.attr("data-tooltip", _string);
                }
                else if (stringName.startsWith("PLACEHOLDER")) {
                    element.attr("placeholder", _string);
                }
                else
                    element.text(_string);
            }
            else if (typeof _string == "object") {
                var keyIndex = parseInt(element.attr("data-stringindex"));
                if (keyIndex) {
                    element.text(_string[keyIndex]);
                }
                else
                    element.text(`${_language}_${stringName}`);
            }
            else {
                element.text(`${_language}_${stringName}`);
            }
        });
    }
};
