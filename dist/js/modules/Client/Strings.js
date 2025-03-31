"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Global_1 = require("../Types/Global");
const Strings_1 = __importDefault(require("./Strings"));
exports.default = {
    LanguagesCodes: {
        "de": "Deutsch - DE",
        "de-DE": "Deutsch - DE",
        "en": "English - EN",
        "en-EN": "English - EN",
        "Deutsch - DE": "de",
        "English - EN": "en",
    },
    Languages: {
        de: {
            WEATHER_INFO_WIND: "Wind",
            WEATHER_INFO_GUST: "Böen",
            WEATHER_INFO_RAIN: "Regen",
            WEATHER_INFO_WIND_DIRECTIONS: ["aus Norden", "aus Nord-Nordosten", "aus Nordosten", "aus Ost-Nordosten", "aus Osten", "aus Ost-Südosten", "aus Südosten", "aus Süd-Südosten", "aus Süden", "aus Süd-Südwesten", "aus Südwesten", "aus West-Südwesten", "aus Westen", "aus West-Nordwesten", "aus Nordwesten", "aus Nord-Nordwesten"],
            WEATHER_INFO_UVINDEX_LEVELS: { [2]: "Niedrig", [5]: "Mäßig", [7]: "Hoch", [10]: "Sehr Hoch", [11]: "Extrem" },
            WEATHER_INFO_SUNRISE: "Sonnenaufgang",
            WEATHER_INFO_SUNSET: "Sonnenuntergang",
            WEATHER_INFO_HUMIDITY: "Luftfeuchtigkeit",
            WEATHER_INFO_AIRPRESSURE: "Luftdruck",
            WEATHER_INFO_UVINDEX: "UV-Index",
            WEATHER_HOURLY_FORECAST: "Stündliche Vorhersage",
            WEATHER_HOURLY_DETAILS: "Stündliche Details",
            WEATHER_HOURLY_FORECAST_NOW: "Jetzt",
            WEATHER_INFO_TIMEAGO_HOURS: "vor %VALUE% Stunden",
            WEATHER_INFO_TIMEAGO_MINUTES: "vor %VALUE% Minuten",
            WEATHER_INFO_TIMEAGO_SECONDS: "vor %VALUE% Sekunden",
            WEATHER_INFO_TIMEIN_HOURS: "in %VALUE% Stunden",
            WEATHER_INFO_TIMEIN_MINUTES: "in %VALUE% Minuten",
            WEATHER_INFO_TIMEIN_SECONDS: "in %VALUE% Sekunden",
            TOOLTIP_CURRENT_TEMPERATURE: "Aktuelle Temperatur",
            TOOLTIP_HIGHEST_TEMPERATURE: "Höchste Temperatur",
            TOOLTIP_LOWEST_TEMPERATURE: "Niedrigste Temperatur",
            TOOLTIP_CURRENT_TIME: "Aktuelle Uhrzeit",
            TOOLTIP_SETTINGS: "Einstellungen",
            TOOLTIP_SETTING_LANGUAGE: "Wählen Sie Ihre Sprache für die Website aus.",
            TOOLTIP_SETTING_TEMPERATURE_UNIT: "In welcher Temperatureinheit die Temperatur eingezeigt werden soll.",
            TOOLTIP_SETTING_ANIAMTED_ICONS: "Animierte Wettersymbole anzeigen.",
            TOOLTIP_HIGH_ACCURACY_LOCATION: "Ermöglicht eine präzise Geolokalisierung für höhere Standort Genauigkeit.",
            TOOLTIP_WEATHER_ALERTS: "Warnungen vor schweren Unwetterbedingungen.",
            PLACEHOLDER_SEARCH_CITY: "Nach Standort suchen",
        },
        en: {
            WEATHER_INFO_WIND: "Wind",
            WEATHER_INFO_GUST: "Gusts",
            WEATHER_INFO_RAIN: "Rain",
            WEATHER_INFO_WIND_DIRECTIONS: ["from the North", "from the North-Northeast", "from the Northeast", "from the East-Northeast", "from the East", "from the East-Southeast", "from the Southeast", "from the South-Southeast", "from the South", "from the South-Southwest", "from the Southwest", "from the West-Southwest", "from the West", "from the West-Northwest", "from the Northwest", "from the North-Northwest"],
            WEATHER_INFO_UVINDEX_LEVELS: { [2]: "Low", [5]: "Moderate", [7]: "High", [10]: "Very High", [11]: "Extreme" },
            WEATHER_INFO_SUNRISE: "Sunrise",
            WEATHER_INFO_SUNSET: "Sunset",
            WEATHER_INFO_HUMIDITY: "Air Humidity",
            WEATHER_INFO_AIRPRESSURE: "Air Pressure",
            WEATHER_INFO_UVINDEX: "UV-Index",
            WEATHER_HOURLY_FORECAST: "Hourly Forecast",
            WEATHER_HOURLY_DETAILS: "Hourly Details",
            WEATHER_HOURLY_FORECAST_NOW: "Now",
            WEATHER_INFO_TIMEAGO_HOURS: "%VALUE% hours ago",
            WEATHER_INFO_TIMEAGO_MINUTES: "%VALUE% minutes ago",
            WEATHER_INFO_TIMEAGO_SECONDS: "%VALUE% seconds ago",
            WEATHER_INFO_TIMEIN_HOURS: "in %VALUE% hours",
            WEATHER_INFO_TIMEIN_MINUTES: "in %VALUE% minutes",
            WEATHER_INFO_TIMEIN_SECONDS: "in %VALUE% seconds",
            TOOLTIP_CURRENT_TEMPERATURE: "Current Temperature",
            TOOLTIP_HIGHEST_TEMPERATURE: "Highest Temperatur",
            TOOLTIP_LOWEST_TEMPERATURE: "Lowest Temperatur",
            TOOLTIP_CURRENT_TIME: "Current Time",
            TOOLTIP_SETTINGS: "Settings",
            TOOLTIP_SETTING_LANGUAGE: "Select your preferred language for the site.",
            TOOLTIP_SETTING_TEMPERATURE_UNIT: "Set the unit for displaying temperature.",
            TOOLTIP_SETTING_ANIAMTED_ICONS: "Show animated weather icons.",
            TOOLTIP_HIGH_ACCURACY_LOCATION: "Enables precise geo-location for better location accuracy.",
            TOOLTIP_WEATHER_ALERTS: "Warnings for severe weather conditions.",
            PLACEHOLDER_SEARCH_CITY: "Search city"
        },
    },
    ToString(string, value) {
        return string.replace("%VALUE%", value);
    },
    Update(lang) {
        const settings = Global_1.App.settings.GetSettings();
        lang = lang || Strings_1.default.LanguagesCodes[settings.setting_language] || "en";
        $("*[data-stringname]").each((i, e) => {
            const element = $(e);
            let stringName = element.attr("data-stringname"), _string = (Strings_1.default.Languages[lang] || Strings_1.default.Languages.en)[stringName || "en"];
            if (!_string) {
                element.text(`${lang}_${stringName}`);
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
                    element.text(`${lang}_${stringName}`);
            }
            else {
                element.text(`${lang}_${stringName}`);
            }
        });
    }
};
