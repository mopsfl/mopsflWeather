export default {
    Toggle(state = false) {
        $(".loading-spinner").each((i, e) => {
            const element = $(e)
            state === true ? element.removeClass("hide") : element.addClass("hide")
        })
        state === true ?
            $(".weather-data").addClass("blur") :
            $(".autocomplete-dropdown").hasClass("hide")
            && $(".weather-data").removeClass("blur")
    }
}