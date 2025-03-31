"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Global_1 = require("../Types/Global");
const Loading_1 = __importDefault(require("./Loading"));
const SearchCity_1 = __importDefault(require("./SearchCity"));
exports.default = {
    init(inputElement) {
        var _typingTimer;
        if (Object.keys($._data(inputElement[0], "events") || {})?.length > 0)
            return console.warn("<SearchCity.ts> already initialized!");
        inputElement.on("propertychange input", () => {
            const inputValue = inputElement.val().toString();
            Loading_1.default.Toggle(Global_1.App.elements.Misc.SEARCH_BOX_LOADING, true);
            clearTimeout(_typingTimer);
            _typingTimer = setTimeout(async () => await SearchCity_1.default.OnSearchInput(inputValue, inputElement), 350);
        });
        inputElement.on("focusout", (e) => {
            if ($(e.relatedTarget).parent().get(0) === Global_1.App.elements.Misc.AUTOCOMPLETE_DROPDOWN.get(0))
                return;
            Loading_1.default.Toggle(Global_1.App.elements.Misc.SEARCH_BOX_LOADING, false);
            SearchCity_1.default.ToggleAutocompleteDropdown(false);
            Global_1.App.elements.Containers.WEATHER_DATA.removeClass("blur");
        });
    },
    async OnSearchInput(value, inputElement) {
        if (value.toString().length <= 2)
            return SearchCity_1.default.ToggleAutocompleteDropdown(false);
        const AutocompleteDropdown = Global_1.App.elements.Misc.AUTOCOMPLETE_DROPDOWN, DropdownItem = Global_1.App.elements.Templates.DROPDOWN_ITEM.contents();
        SearchCity_1.default.ToggleAutocompleteDropdown(true);
        Global_1.App.elements.Misc.AUTOCOMPLETE_DROPDOWN.empty();
        await Global_1.App.api.SearchCity(value).then(cities => {
            cities = SearchCity_1.default.RemoveDuplicateCities(cities);
            cities.forEach(city => {
                const clonedDropdownItem = DropdownItem.clone();
                clonedDropdownItem.find(".city-name").text(city.name);
                clonedDropdownItem.find(".city-iso").text(city.country);
                clonedDropdownItem.find(".country-flag").attr("src", `./images/svg/flags/${city.country.toLocaleLowerCase()}.svg`);
                clonedDropdownItem.appendTo(AutocompleteDropdown);
                clonedDropdownItem.on("click", async () => {
                    SearchCity_1.default.ToggleAutocompleteDropdown(false);
                    await Global_1.App.api.LoadWeatherData(city);
                    Global_1.App.elements.Misc.SEARCH_CITY_INPUT.val("");
                });
            });
            const clonedDropdownItem = DropdownItem.clone();
            clonedDropdownItem.find(".city-name").text(value.toString());
            clonedDropdownItem.find(".city-iso").text("");
            clonedDropdownItem.appendTo(AutocompleteDropdown);
            clonedDropdownItem.on("click", async () => {
                SearchCity_1.default.ToggleAutocompleteDropdown(false);
                await Global_1.App.api.LoadWeatherData({ name: value });
                Global_1.App.elements.Misc.SEARCH_CITY_INPUT.val("");
            });
        }).catch(err => {
            console.error("Error fetching cities:", err);
        });
    },
    ToggleAutocompleteDropdown(state) {
        if (state === true) {
            Global_1.App.elements.Misc.AUTOCOMPLETE_DROPDOWN.removeClass("hide");
            Global_1.App.elements.Containers.WEATHER_DATA.addClass("blur");
            Global_1.App.elements.Misc.SEARCH_BOX_LOADING.addClass("hide");
        }
        else {
            Global_1.App.elements.Misc.AUTOCOMPLETE_DROPDOWN.empty();
            Global_1.App.elements.Misc.AUTOCOMPLETE_DROPDOWN.addClass("hide");
            Global_1.App.elements.Misc.SEARCH_BOX_LOADING.addClass("hide");
        }
    },
    RemoveDuplicateCities(cities) {
        const seen = new Set();
        return cities.filter(city => {
            const key = `${city.name}-${city.country}`;
            if (seen.has(key)) {
                console.log(key, " duplicate removed");
                return false;
            }
            seen.add(key);
            return true;
        });
    }
};
