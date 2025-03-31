"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Global_1 = require("../Types/Global");
exports.default = {
    GetLocation() {
        const settings = Global_1.App.settings.GetSettings();
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: settings.high_accuracy_location || false,
                timeout: 5000,
                maximumAge: 120000,
            });
        });
    }
};
