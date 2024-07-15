export default {
    Toggle(state = false) {
        $(".loading-spinner").each((i, e) => {
            state === true ? $(e).removeClass("hide") : $(e).addClass("hide")
        })
        state === true ?
            $(".weather-data").addClass("blur") :
            $(".autocomplete-dropdown").hasClass("hide")
            && $(".weather-data").removeClass("blur")
    }
}