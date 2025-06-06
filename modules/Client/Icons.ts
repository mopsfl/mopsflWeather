import { App } from "../Types/Global";

export default {
    GetIcon(name: string, timezone?: number, isDay?: boolean) {
        const settings = App.settings.GetSettings(),
            hours = new Date(new Date().getTime() + (timezone ?? 0) * 1000).getHours(),
            isDayTime = isDay !== undefined ? isDay : (hours > 6 && hours < 20);

        if (["clear-day.svg"].includes(name) && !isDayTime) {
            name = "clear-night.svg";
        } else if (name.includes("-day") && !isDayTime) {
            name = name.replace(/\-day/g, "-night");
        }

        return `./images/svg/${settings.animated_weather_icons === false ? "static" : "animated"}/${name || "not-available.svg"}`;
    },

    Icons: {
        /* THUNDER */
        200: "thunder.svg",
        201: "thunder.svg",
        202: "thunder.svg",
        210: "thunder.svg",
        211: "thunder.svg",
        212: "thunder.svg",
        221: "thunder.svg",
        230: "thunder.svg",
        231: "thunder.svg",
        232: "thunder.svg",

        /* Drizzle */
        300: "overcast-drizzle.svg",
        301: "overcast-drizzle.svg",
        302: "extreme-drizzle.svg",
        310: "overcast-drizzle.svg",
        311: "overcast-drizzle.svg",
        312: "extreme-drizzle.svg",
        313: "overcast-drizzle.svg",
        314: "extreme-drizzle.svg",
        321: "overcast-drizzle.svg",

        /* RAIN */
        500: "partly-cloudy-day-rain.svg",
        501: "partly-cloudy-day-rain.svg",
        502: "partly-cloudy-day-rain.svg",
        503: "extreme-rain.svg",
        504: "extreme-rain.svg",
        511: "snow.svg",
        520: "rain.svg",
        521: "rain.svg",
        522: "extreme-rain.svg",
        531: "extreme-rain.svg",

        /* SNOW */
        600: "snow.svg",
        601: "snow.svg",
        602: "snow.svg",
        611: "snow.svg",
        612: "snow.svg",
        613: "snow.svg",
        615: "snow.svg",
        616: "snow.svg",
        620: "snow.svg",
        621: "snow.svg",
        622: "snow.svg",

        /* MISC */
        701: "mist.svg",
        711: "mist.svg",
        721: "mist.svg",
        731: "mist.svg",
        741: "mist.svg",
        751: "mist.svg",
        761: "mist.svg",
        762: "mist.svg",
        771: "mist.svg",
        781: "mist.svg",

        /* SKY */
        800: "clear-day.svg",
        801: "partly-cloudy-day.svg",
        802: "cloudy.svg",
        803: "overcast.svg",
        804: "overcast.svg",
        811: "night.svg",

        1000: "clear-day.svg",
        1003: "partly-cloudy-day.svg",
        1006: "partly-cloudy-day.svg",
        1009: "cloudy.svg",
        1030: "cloudy.svg",
        1063: "partly-cloudy-day.svg",
        1066: "snow.svg",
        1069: "snow.svg",
        1082: "snow.svg",
        1087: "thunderstorms.svg",
        1114: "snow.svg",
        1117: "snow.svg",
        1135: "cloudy.svg",
        1147: "cloudy.svg",
        1150: "rain.svg",
        1153: "rain.svg",
        1168: "rain.svg",
        1171: "rain.svg",
        1180: "rain.svg",
        1183: "rain.svg",
        1186: "rain.svg",
        1189: "extreme-rain.svg",
        1192: "extreme-rain.svg",
        1195: "extreme-rain.svg",
        1198: "rain.svg",
        1201: "rain.svg",
        1204: "snow.svg",
        1207: "snow.svg",
        1210: "snow.svg",
        1213: "snow.svg",
        1216: "snow.svg",
        1219: "snow.svg",
        1222: "snow.svg",
        1225: "snow.svg",
        1227: "extreme-rain.svg",
        1240: "partly-cloudy-day-rain.svg",
        1243: "rain.svg",
        1246: "rain.svg",
        1249: "rain.svg",
        1252: "rain.svg",
        1255: "snow.svg",
        1258: "snow.svg",
        1261: "snow.svg",
        1264: "snow.svg",
        1273: "thunderstorms.svg",
        1276: "thunderstorms.svg",
        1279: "thunderstorms.svg",
        1282: "thunderstorms.svg",
    },
}