export default {
    GetIcon(name: string, timezone?: number, animated?: boolean, isDay?: boolean) {
        const hours = new Date(new Date().getTime() + (timezone !== undefined ? timezone : 0) * 1000).getUTCHours();
        const isDayTime = isDay !== undefined ? isDay : (hours > 6 && hours < 20);

        if (["day.svg"].includes(name) && !isDayTime) {
            name = "night.svg";
        } else if (["cloudy-day-1.svg", "cloudy-day-2.svg", "cloudy-day-3.svg"].includes(name) && !isDayTime) {
            name = name.replace(/-day-/g, "-night-");
        }

        return `./images/svg/${animated === true ? "animated" : "static"}/${name || "day.svg"}`;
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
        300: "rainy-4.svg",
        301: "rainy-4.svg",
        302: "rainy-5.svg",
        310: "rainy-4.svg",
        311: "rainy-4.svg",
        312: "rainy-5.svg",
        313: "rainy-4.svg",
        314: "rainy-5.svg",
        321: "rainy-4.svg",

        /* RAIN */
        500: "rainy-1.svg",
        501: "rainy-3.svg",
        502: "rainy-5.svg",
        503: "rainy-6.svg",
        504: "rainy-7.svg",
        511: "rainy-4.svg",
        520: "rainy-4.svg",
        521: "rainy-5.svg",
        522: "rainy-6.svg",
        531: "rainy-7.svg",

        /* SNOW */
        600: "snowy-4.svg",
        601: "snowy-4.svg",
        602: "snowy-5.svg",
        611: "snowy-4.svg",
        612: "snowy-4.svg",
        613: "snowy-4.svg",
        615: "snowy-4.svg",
        616: "snowy-4.svg",
        620: "snowy-4.svg",
        621: "snowy-5.svg",
        622: "snowy-6.svg",

        /* MISC */
        701: "cloudy.svg",
        711: "cloudy.svg",
        721: "cloudy.svg",
        731: "cloudy.svg",
        741: "cloudy.svg",
        751: "cloudy.svg",
        761: "cloudy.svg",
        762: "cloudy.svg",
        771: "cloudy.svg",
        781: "cloudy.svg",

        /* SKY */
        800: "day.svg",
        801: "cloudy-day-1.svg",
        802: "cloudy-day-2.svg",
        803: "cloudy-day-3.svg",
        804: "cloudy.svg",
        811: "night.svg",

        1000: "day.svg",
        1003: "cloudy-day-1.svg",
        1006: "cloudy-day-1.svg",
        1009: "cloudy.svg",
        1030: "cloudy.svg",
        1063: "cloudy-day-3.svg",
        1066: "snowy-1.svg",
        1069: "snowy-3.svg",
        1082: "snowy-4.svg",
        1087: "thunder.svg",
        1114: "snowy-5.svg",
        1117: "snowy-6.svg",
        1135: "cloudy.svg",
        1147: "cloudy.svg",
        1150: "rainy-4.svg",
        1153: "rainy-4.svg",
        1168: "rainy-4.svg",
        1171: "rainy-5.svg",
        1180: "rainy-4.svg",
        1183: "rainy-4.svg",
        1186: "rainy-5.svg",
        1189: "rainy-6.svg",
        1192: "rainy-7.svg",
        1195: "rainy-7.svg",
        1198: "rainy-4.svg",
        1201: "rainy-5.svg",
        1204: "snowy-5.svg",
        1207: "snowy-6.svg",
        1210: "snowy-4.svg",
        1213: "snowy-4.svg",
        1216: "snowy-5.svg",
        1219: "snowy-5.svg",
        1222: "snowy-6.svg",
        1225: "snowy-6.svg",
        1227: "rainy-7.svg",
        1240: "rainy-4.svg",
        1243: "rainy-5.svg",
        1246: "rainy-5.svg",
        1249: "rainy-5.svg",
        1252: "rainy-5.svg",
        1255: "snowy-4.svg",
        1258: "snowy-5.svg",
        1261: "snowy-5.svg",
        1264: "snowy-5.svg",
        1273: "thunder.svg",
        1276: "thunder.svg",
        1279: "thunder.svg",
        1282: "thunder.svg",
    },
}