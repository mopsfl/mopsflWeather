export default {
    de: {
        WEATHER_INFO_WIND: "Wind",
        WEATHER_INFO_GUST: "Böen",

        WEATHER_INFO_WIND_DIRECTIONS: ["aus Norden", "aus Nord-Nordosten", "aus Nordosten", "aus Ost-Nordosten", "aus Osten", "aus Ost-Südosten", "aus Südosten", "aus Süd-Südosten", "aus Süden", "aus Süd-Südwesten", "aus Südwesten", "aus West-Südwesten", "aus Westen", "aus West-Nordwesten", "aus Nordwesten", "aus Nord-Nordwesten"],
        WEATHER_INFO_SUNRISE: "Sonnenaufgang",
        WEATHER_INFO_SUNSET: "Sonnenuntergang",
        WEATHER_INFO_HUMIDITY: "Luftfeuchtigkeit",
        WEATHER_INFO_AIRPRESSURE: "Luftdruck",
        WEATHER_INFO_UVINDEX: "UV-Index",
        WEATHER_HOURLY_FORECAST: "Stündliche Vorhersage",

        WEATHER_INFO_TIMEAGO_HOURS: "vor %VALUE% Stunden",
        WEATHER_INFO_TIMEAGO_MINUTES: "vor %VALUE% Minuten",
        WEATHER_INFO_TIMEAGO_SECONDS: "vor %VALUE% Sekunden",

        WEATHER_INFO_TIMEIN_HOURS: "in %VALUE% Stunden",
        WEATHER_INFO_TIMEIN_MINUTES: "in %VALUE% Minuten",
        WEATHER_INFO_TIMEIN_SECONDS: "in %VALUE% Sekunden",
    },

    en: {
        WEATHER_INFO_WIND: "Wind",
        WEATHER_INFO_GUST: "Gusts",

        WEATHER_INFO_WIND_DIRECTIONS: ["from the North", "from the North-Northeast", "from the Northeast", "from the East-Northeast", "from the East", "from the East-Southeast", "from the Southeast", "from the South-Southeast", "from the South", "from the South-Southwest", "from the Southwest", "from the West-Southwest", "from the West", "from the West-Northwest", "from the Northwest", "from the North-Northwest"],
        WEATHER_INFO_SUNRISE: "Sunrise",
        WEATHER_INFO_SUNSET: "Sunset",
        WEATHER_INFO_HUMIDITY: "Air Humidity",
        WEATHER_INFO_AIRPRESSURE: "Air Pressure",
        WEATHER_INFO_UVINDEX: "UV-Index",
        WEATHER_HOURLY_FORECAST: "Hourly Forecast",

        WEATHER_INFO_TIMEAGO_HOURS: "%VALUE% hours ago",
        WEATHER_INFO_TIMEAGO_MINUTES: "%VALUE% minutes ago",
        WEATHER_INFO_TIMEAGO_SECONDS: "%VALUE% seconds ago",

        WEATHER_INFO_TIMEIN_HOURS: "in %VALUE% hours",
        WEATHER_INFO_TIMEIN_MINUTES: "in %VALUE% minutes",
        WEATHER_INFO_TIMEIN_SECONDS: "in %VALUE% seconds",
    },

    ToString(string: string, value: any) {
        return string.replace("%VALUE%", value)
    }
}