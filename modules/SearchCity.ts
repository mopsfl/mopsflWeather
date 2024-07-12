import { _dev } from "..";
import self from "./SearchCity"
import WeatherApi, { CitySearchResult } from "./WeatherApi";
const doneTypingInterval = 350;

const _dropdownItemTemplate = $(".dropdown-item-template")
const _autocompleteDropdown = $(".autocomplete-dropdown")
const _searchBoxLoadingSpinner = $(".search-box-loading-spinner")

export default {
    InitInput(inputElement: JQuery<HTMLElement>) {
        var _typingTimer: any

        inputElement.on("propertychange input", () => {
            if (inputElement.val().toString().length > 2) _searchBoxLoadingSpinner.removeClass("hide")
            clearTimeout(_typingTimer)
            _typingTimer = setTimeout(async () => await self.HandleSearchInput(inputElement.val(), inputElement), doneTypingInterval)
        })

        inputElement.on("focusout", (e) => {
            if ($(e.relatedTarget).parent().get(0) === _autocompleteDropdown.get(0)) return
            self.ToggleAutocompleteDropdown(false)
            _searchBoxLoadingSpinner.addClass("hide")
        })
    },

    async HandleSearchInput(value: string | number | string[], inputElement: JQuery<HTMLElement>) {
        if (value.toString().length <= 2) return self.ToggleAutocompleteDropdown(false)

        WeatherApi.SearchCity(value).then((res: CitySearchResult[]) => {
            res.forEach(city => {
                const dropdownItem = _dropdownItemTemplate.contents().clone()
                dropdownItem.find(".city-name").text(city.city)
                dropdownItem.find(".city-iso").text(city.iso2)
                dropdownItem.appendTo(_autocompleteDropdown)

                dropdownItem.on("click", async () => {
                    self.ToggleAutocompleteDropdown(false)
                    _searchBoxLoadingSpinner.removeClass("hide")

                    await WeatherApi.GetWeatherData({ lat: city.lat, lon: city.lng }).then(res => {
                        _searchBoxLoadingSpinner.addClass("hide")
                        WeatherApi.UpdateWeatherData(res, city.city)
                    }).catch(err => {
                        _searchBoxLoadingSpinner.addClass("hide")
                    }).finally(() => {
                        inputElement.val("")
                    })
                })
            })
        }).catch(err => {
            self.ToggleAutocompleteDropdown(false)
            _searchBoxLoadingSpinner.addClass("hide")
        })

        self.ToggleAutocompleteDropdown(true, true)
        _searchBoxLoadingSpinner.addClass("hide")
    },

    ToggleAutocompleteDropdown(state: boolean, clear?: boolean) {
        if (state === true) {
            if (clear) _autocompleteDropdown.empty()
            _autocompleteDropdown.removeClass("hide")
        } else {
            _autocompleteDropdown.empty()
            _autocompleteDropdown.addClass("hide")
        }
    }
}