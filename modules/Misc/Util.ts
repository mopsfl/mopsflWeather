import lodash from "lodash"
import pako from "pako"
import { WindData } from "../Types/Weather";

export default {
    CapitalizeFirstLetter(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    CelsiusToFahrenheit(celsius: number) {
        return (celsius * 9 / 5) + 32;
    },

    RoundToLowest(number: number) {
        return Math.floor(number)
    },

    CalculateWind(windData: WindData) {
        const calc_wd = lodash.clone(windData)
        calc_wd.speed = lodash.round(calc_wd.speed * 3.16, 0) || 0
        calc_wd.gust = lodash.round(calc_wd.gust * 3.16, 0) || 0

        return calc_wd
    },

    NumberToFloatingPoint(num: string | number) {
        num = num.toString()

        let firstOneIndex = num.indexOf('1');
        if (firstOneIndex === -1) {
            return num;
        }

        return num.slice(0, firstOneIndex + 1) + (num.slice(firstOneIndex + 1) ? '.' + num.slice(firstOneIndex + 1) : '');
    },

    CompressData(data: Object) {
        return encodeURIComponent(btoa(String.fromCharCode.apply(null, new Uint16Array(pako.gzip(JSON.stringify(data))))))
    },

    UncompressData(data: string) {
        return JSON.parse(pako.inflate(new Uint8Array(atob(decodeURIComponent(data)).split('').map(c => c.charCodeAt(0))), { to: 'string' }));
    },

    CreateElementWithClass(tag: string, className: string, innerText?: string, html?: boolean) {
        const element = document.createElement(tag);
        element.classList.add(className);

        if (innerText) {
            if (!html) {
                element.innerText = innerText;
            } else element.innerHTML = innerText;
        }
        return element;
    },

    RemoveDuplicatesByKey(array: Array<any>, key: any) {
        const seen = new Set();
        return array.filter(item => {
            const keyValue = item[key];
            if (seen.has(keyValue)) {
                return false;
            }
            seen.add(keyValue);
            return true;
        });
    },
}