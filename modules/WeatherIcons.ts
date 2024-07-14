export default {
    GetIcon(name: string, timezone?: number, animated?: boolean) {
        const hours = new Date(new Date().getTime() + timezone * 1000).getUTCHours(),
            isDayTime = hours > 6 && hours < 20;

        if (["day.svg"].includes(name) && !isDayTime) { name = "night.svg" }
        else if (["cloudy-day-1.svg", "cloudy-day-2.svg", "cloudy-day-3.svg"].includes(name) && !isDayTime) name = name.replace(/\-day\-/gm, "-night-")
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

        /* SKY */
        800: "day.svg",
        801: "cloudy-day-1.svg",
        802: "cloudy-day-3.svg",
        803: "cloudy.svg",
        804: "cloudy.svg",

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
    },
}