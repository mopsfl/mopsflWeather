import { App } from "../Types/Global";

export default {
    GetIcon(name: string, timezone?: number, isDay?: boolean) {
        const settings = App.settings.GetSettings()

        const hours = new Date(Date.now() + (timezone ?? 0) * 1000).getHours()
        const isDayTime = isDay ?? (hours > 6 && hours < 20)

        if (!isDayTime) {
            if (name === "clear-day") {
                name = "clear-night"
            } else name = name.replace("-day", "-night")
        }

        return `./images/svg/${settings.animated_weather_icons === false ? "static" : "animated"}/${name}.svg`
    },

    Icons: {
        0: "clear-day",
        1: "partly-cloudy-day",
        2: "partly-cloudy-day",
        3: "cloudy",

        45: "fog",
        48: "fog",

        51: "drizzle",
        53: "drizzle",
        55: "drizzle",

        56: "sleet",
        57: "sleet",

        61: "rain",
        63: "rain",
        65: "rain",

        66: "sleet",
        67: "sleet",

        71: "snow",
        73: "snow",
        75: "snow",

        77: "snow",

        80: "rain",
        81: "rain",
        82: "extreme-rain",

        85: "snow",
        86: "snow",

        95: "thunderstorms-rain",
        96: "thunderstorms-rain",
        99: "thunderstorms-extreme-rain"
    },
}