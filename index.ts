import jQuery from "jquery";
import { Materialbox } from "materialize-css";
import SearchCity from "./modules/SearchCity";

const _dev = location.hostname === "localhost"

jQuery(async () => {
    const SearchCityInput = jQuery(".searchcity_input")
    SearchCity.InitInput(SearchCityInput)

    window.toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": true,
        "progressBar": false,
        "positionClass": "toast-bottom-right",
        "preventDuplicates": true,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
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

export { _dev }