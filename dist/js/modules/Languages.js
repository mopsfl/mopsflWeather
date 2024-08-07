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
    ["French - FR"]: "fr",
    ["Russian - RU"]: "ru",
    ["Japanese - JA"]: "ja",
    ["Arabic - AR"]: "ar",
    ["Polish - PL"]: "pl",
    UpdateStrings() {
        $("*[data-stringname]").each((i, e) => {
            let _settings = LocalStorage_1.default.GetKey(__1.localStorageKey, "settings"), _string = (Strings_1.default[Languages_1.default[_settings.setting_language || "en"]] || Strings_1.default.de)[$(e).attr("data-stringname") || "en"];
            if (_string)
                $(e).text(_string);
        });
    }
};
