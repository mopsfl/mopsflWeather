import jQuery from "jquery";
import SearchCity from "./modules/SearchCity";
import Strings from "./modules/Strings";
import WeatherIcons from "./modules/WeatherIcons";
import Time from "./modules/Time";

const _dev = location.hostname === "localhost",
    languageStrings = Strings.de

jQuery(async () => {
    const SearchCityInput = jQuery(".searchcity_input")
    SearchCity.InitInput(SearchCityInput)

    window.toastr.options = {
        "newestOnTop": true,
        "positionClass": "toast-bottom-right",
        "preventDuplicates": true,
    }

    $(".expandclick").each((i, e) => {
        $(e).on("click", () => {
            $(e).toggleClass("expand")
        })
    })

    $("*[data-stringname]").each((i, e) => {
        const _string = languageStrings[$(e).attr("data-stringname")]
        if (_string) $(e).text(_string)
    })

    window["icons"] = WeatherIcons
    window["time"] = Time
})

declare global {
    interface Window {
        toastr: {
            info: any,
            success: any,
            warning: any,
            error: any,
            clear: any,
            version: string,
            options: Object
        },
    }
}

export { _dev, languageStrings }