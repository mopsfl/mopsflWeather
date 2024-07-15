"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const LocalStorage_1 = __importDefault(require("./LocalStorage"));
const SearchCity_1 = require("./SearchCity");
const WeatherApi_1 = __importDefault(require("./WeatherApi"));
exports.default = {
    GetGeoLocation(positionCallback, errorCallback) {
        const _settings = LocalStorage_1.default.GetKey(__1.localStorageKey, "settings");
        navigator.geolocation.getCurrentPosition(positionCallback, errorCallback, {
            enableHighAccuracy: _settings.high_accuracy_location,
            timeout: 10000,
            maximumAge: 120000,
        });
    },
    async QueryPermission(permissionName) {
        return await navigator.permissions.query({ name: permissionName });
    },
    GetGeoLocationErrorCallback(err) {
        console.error(err);
        switch (err.code) {
            case 1:
                SearchCity_1._searchBoxLoadingSpinner.removeClass("hide");
                WeatherApi_1.default.GetOpenWeatherData(undefined, true).then(WeatherApi_1.default.UpdateOpenWeatherData);
                WeatherApi_1.default.GetWeatherApiData(undefined).then(WeatherApi_1.default.UpdateWeatherApiData);
                SearchCity_1._searchBoxLoadingSpinner.addClass("hide");
                break;
            case 2:
            case 3:
                window.toastr.error(err.message, "GeolocationPositionError");
                break;
            default: break;
        }
    }
};
