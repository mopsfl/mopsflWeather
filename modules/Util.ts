import lodash from "lodash"
import { WindData } from "./WeatherApi";
import { languageStrings } from "..";
import pako from "pako"

export default {
    CapitalizeFirstLetter(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    NumberToFloatingPoint(num: string | number) {
        num = num.toString()

        let firstOneIndex = num.indexOf('1');
        if (firstOneIndex === -1) {
            return num;
        }

        return num.slice(0, firstOneIndex + 1) + (num.slice(firstOneIndex + 1) ? '.' + num.slice(firstOneIndex + 1) : '');
    },

    CalculateWind(windData: WindData) {
        const calc_wd = lodash.clone(windData)
        calc_wd.speed = lodash.round(calc_wd.speed * 3.16, 0)
        calc_wd.gust = lodash.round(calc_wd.gust * 3.16, 0)
        return calc_wd
    },

    GetWindDirection(degrees: number) {
        return languageStrings.WEATHER_INFO_WIND_DIRECTIONS[Math.round(degrees % 360 / 22.5) % 16];
    },

    CompressData(data: Object) {
        return encodeURIComponent(btoa(String.fromCharCode.apply(null, new Uint16Array(pako.gzip(JSON.stringify(data))))))
    },

    UncompressData(data: string) {
        return JSON.parse(pako.inflate(new Uint8Array(atob(decodeURIComponent(data)).split('').map(c => c.charCodeAt(0))), { to: 'string' }));
    }

}