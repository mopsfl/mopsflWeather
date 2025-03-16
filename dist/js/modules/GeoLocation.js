"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const Loading_1 = __importDefault(require("./Loading"));
const LocalStorage_1 = __importDefault(require("./LocalStorage"));
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
                Loading_1.default.Toggle(true);
                WeatherApi_1.default.GetOpenWeatherData(undefined, true).then(WeatherApi_1.default.UpdateOpenWeatherData);
                WeatherApi_1.default.GetWeatherApiData({ name: "Frankfurt" }).then(WeatherApi_1.default.UpdateWeatherApiData);
                Loading_1.default.Toggle(false);
                break;
            case 2:
            case 3:
                __1.notifications.error("GeolocationPositionError", err.message);
                WeatherApi_1.default.GetOpenWeatherData(undefined, true).then(WeatherApi_1.default.UpdateOpenWeatherData);
                WeatherApi_1.default.GetWeatherApiData({ name: "Frankfurt" }).then(WeatherApi_1.default.UpdateWeatherApiData);
                Loading_1.default.Toggle(false);
                break;
            default: break;
        }
    }
};
