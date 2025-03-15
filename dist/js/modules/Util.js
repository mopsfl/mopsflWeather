"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const __1 = require("..");
const pako_1 = __importDefault(require("pako"));
exports.default = {
    CapitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    CelsiusToFahrenheit(celsius) {
        return (celsius * 9 / 5) + 32;
    },
    RoundToLowest(number) {
        return Math.floor(number);
    },
    NumberToFloatingPoint(num) {
        num = num.toString();
        let firstOneIndex = num.indexOf('1');
        if (firstOneIndex === -1) {
            return num;
        }
        return num.slice(0, firstOneIndex + 1) + (num.slice(firstOneIndex + 1) ? '.' + num.slice(firstOneIndex + 1) : '');
    },
    CalculateWind(windData) {
        const calc_wd = lodash_1.default.clone(windData);
        calc_wd.speed = lodash_1.default.round(calc_wd.speed * 3.16, 0);
        calc_wd.gust = lodash_1.default.round(calc_wd.gust * 3.16, 0);
        return calc_wd;
    },
    GetWindDirection(degrees) {
        return __1.languageStrings.WEATHER_INFO_WIND_DIRECTIONS[Math.round(degrees % 360 / 22.5) % 16];
    },
    CompressData(data) {
        return encodeURIComponent(btoa(String.fromCharCode.apply(null, new Uint16Array(pako_1.default.gzip(JSON.stringify(data))))));
    },
    UncompressData(data) {
        return JSON.parse(pako_1.default.inflate(new Uint8Array(atob(decodeURIComponent(data)).split('').map(c => c.charCodeAt(0))), { to: 'string' }));
    },
    CreateElementWithClass(tag, className, innerText) {
        const element = document.createElement(tag);
        element.classList.add(className);
        if (innerText)
            element.innerText = innerText;
        return element;
    },
    RemoveDuplicatesByKey(array, key) {
        const seen = new Set();
        return array.filter(item => {
            const keyValue = item[key];
            if (seen.has(keyValue)) {
                return false;
            }
            seen.add(keyValue);
            return true;
        });
    }
};
