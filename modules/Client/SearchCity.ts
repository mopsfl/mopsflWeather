import { Element } from "../Types/Element";
import { App } from "../Types/Global";
import { CitySearchResult } from "../Types/Weather";
import Loading from "./Loading";
import $ from "jquery"

export default {
    init(inputElement: Element) {
        var _typingTimer: number
        if (Object.keys($.data(inputElement[0], "events") || {})?.length > 0) return console.warn("<SearchCity.ts> already initialized!");

        inputElement.on("propertychange input", () => {
            const inputValue = inputElement.val().toString();
            Loading.Toggle(App.elements.Misc.SEARCH_BOX_LOADING, true);

            clearTimeout(_typingTimer);
            _typingTimer = setTimeout(async () => await this.OnSearchInput(inputValue), 350);
        });

        inputElement.on("focusout", (e) => {
            if ($(e.relatedTarget).parent().get(0) === App.elements.Misc.AUTOCOMPLETE_DROPDOWN.get(0)) return

            Loading.Toggle(App.elements.Misc.SEARCH_BOX_LOADING, false);
            this.ToggleAutocompleteDropdown(false);
            App.elements.Containers.WEATHER_DATA.removeClass("blur");
        });
    },

    async OnSearchInput(value: any) {
        if (value.toString().length <= 2) return this.ToggleAutocompleteDropdown(false)

        const AutocompleteDropdown = App.elements.Misc.AUTOCOMPLETE_DROPDOWN,
            DropdownItem = App.elements.Templates.DROPDOWN_ITEM.contents()

        this.ToggleAutocompleteDropdown(true);
        App.elements.Misc.AUTOCOMPLETE_DROPDOWN.empty();

        await App.api.SearchCity(value).then(cities => {
            cities = this.RemoveDuplicateCities(cities)
            cities.forEach(city => {
                const clonedDropdownItem = DropdownItem.clone();
                clonedDropdownItem.find(".city-name").text(city.name);
                clonedDropdownItem.find(".city-iso").text(city.country);
                clonedDropdownItem.find(".country-flag").attr("src", `./images/svg/flags/${city.country.toLocaleLowerCase()}.svg`)
                clonedDropdownItem.appendTo(AutocompleteDropdown);

                clonedDropdownItem.on("click", async () => {
                    this.ToggleAutocompleteDropdown(false);
                    await App.api.LoadWeatherData(city)

                    App.elements.Misc.SEARCH_CITY_INPUT.val("")
                });
            });

            const clonedDropdownItem = DropdownItem.clone();
            clonedDropdownItem.find(".city-name").text(value.toString())
            clonedDropdownItem.find(".city-iso").text("")
            clonedDropdownItem.appendTo(AutocompleteDropdown)
            clonedDropdownItem.on("click", async () => {
                this.ToggleAutocompleteDropdown(false);
                await App.api.LoadWeatherData({ name: value, unknownName: true })

                App.elements.Misc.SEARCH_CITY_INPUT.val("")
            });
        }).catch(err => {
            console.error("Error fetching cities:", err);
        });
    },

    ToggleAutocompleteDropdown(state: boolean) {
        if (state === true) {
            App.elements.Misc.AUTOCOMPLETE_DROPDOWN.removeClass("hide")
            App.elements.Containers.WEATHER_DATA.addClass("blur")
            App.elements.Misc.SEARCH_BOX_LOADING.addClass("hide")
            App.elements.Misc.SEARCH_CITY_INPUT.addClass("focused")
            $(document.documentElement).addClass("noscroll")
        } else {
            App.elements.Misc.AUTOCOMPLETE_DROPDOWN.empty()
            App.elements.Misc.AUTOCOMPLETE_DROPDOWN.addClass("hide")
            App.elements.Misc.SEARCH_BOX_LOADING.addClass("hide")
            App.elements.Misc.SEARCH_CITY_INPUT.removeClass("focused")
            $(document.documentElement).removeClass("noscroll")
        }
    },

    RemoveDuplicateCities(cities: CitySearchResult[]) {
        const seen = new Set()
        return cities.filter(city => {
            const key = `${city.name}-${city.country}`;
            if (seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        });
    }
}
