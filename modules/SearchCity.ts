import { _dev } from "..";
import Loading from "./Loading";
import self from "./SearchCity"
import WeatherApi, { _weatherForecastItems, CitySearchResult } from "./WeatherApi";
const doneTypingInterval = 350;

const _dropdownItemTemplate = $(".dropdown-item-template")
const _autocompleteDropdown = $(".autocomplete-dropdown")
const _searchBoxLoadingSpinner = $(".search-box-loading-spinner")
const _weatherDataContainer = $(".weather-data")

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
                dropdownItem.find(".city-name").text(city.name)
                dropdownItem.find(".city-iso").text(city.country)
                dropdownItem.appendTo(_autocompleteDropdown)
                dropdownItem.on("click", async () => await self.HandleDropdownAutoCompleteClick(city, inputElement))
            })
            const dropdownItemCityName = _dropdownItemTemplate.contents().clone()
            dropdownItemCityName.find(".city-name").text(value.toString())
            dropdownItemCityName.find(".city-iso").text("")
            dropdownItemCityName.appendTo(_autocompleteDropdown)
            dropdownItemCityName.on("click", async () => await self.HandleDropdownAutoCompleteClick({ name: value }, inputElement, true))
        }).catch(err => {
            self.ToggleAutocompleteDropdown(false)
            Loading.Toggle(false)
        }).then(res => {
            Loading.Toggle(false)
        })

        self.ToggleAutocompleteDropdown(true, true)
    },

    async HandleDropdownAutoCompleteClick(city: any, inputElement: JQuery<HTMLElement>, notFromCityList?: boolean) {
        self.ToggleAutocompleteDropdown(false)
        Loading.Toggle(true)

        await WeatherApi.GetOpenWeatherData({ lat: city.lat, lon: city.lng, name: city.name }).then(res => WeatherApi.UpdateOpenWeatherData(res, city.name, notFromCityList)).catch(err => {
            Loading.Toggle(false)
            console.error(err)
        }).finally(() => {
            inputElement.val("")
            Loading.Toggle(false)
        })
        await WeatherApi.GetWeatherApiData({ lat: city.lat, lon: city.lng, name: city.name }).then(WeatherApi.UpdateWeatherApiData).catch(err => {
            Loading.Toggle(false)
        })
    },

    ToggleAutocompleteDropdown(state: boolean, clear?: boolean) {
        if (state === true) {
            if (clear) _autocompleteDropdown.empty()
            _autocompleteDropdown.removeClass("hide")
            _weatherDataContainer.addClass("blur")
        } else {
            _autocompleteDropdown.empty()
            _autocompleteDropdown.addClass("hide")
            _weatherDataContainer.removeClass("blur")
            _searchBoxLoadingSpinner.addClass("hide")
        }
    }
}

export { _searchBoxLoadingSpinner }