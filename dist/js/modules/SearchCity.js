"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._searchBoxLoadingSpinner = void 0;
const Loading_1 = __importDefault(require("./Loading"));
const SearchCity_1 = __importDefault(require("./SearchCity"));
const WeatherApi_1 = __importDefault(require("./WeatherApi"));
const doneTypingInterval = 350;
const _dropdownItemTemplate = $(".dropdown-item-template");
const _autocompleteDropdown = $(".autocomplete-dropdown");
const _searchBoxLoadingSpinner = $(".search-box-loading-spinner");
exports._searchBoxLoadingSpinner = _searchBoxLoadingSpinner;
const _weatherDataContainer = $(".weather-data");
exports.default = {
    InitInput(inputElement) {
        var _typingTimer;
        inputElement.on("propertychange input", () => {
            if (inputElement.val().toString().length > 2)
                _searchBoxLoadingSpinner.removeClass("hide");
            clearTimeout(_typingTimer);
            _typingTimer = setTimeout(async () => await SearchCity_1.default.HandleSearchInput(inputElement.val(), inputElement), doneTypingInterval);
        });
        inputElement.on("focusout", (e) => {
            if ($(e.relatedTarget).parent().get(0) === _autocompleteDropdown.get(0))
                return;
            SearchCity_1.default.ToggleAutocompleteDropdown(false);
            _searchBoxLoadingSpinner.addClass("hide");
        });
    },
    async HandleSearchInput(value, inputElement) {
        if (value.toString().length <= 2)
            return SearchCity_1.default.ToggleAutocompleteDropdown(false);
        WeatherApi_1.default.SearchCity(value).then((res) => {
            res.forEach(city => {
                const dropdownItem = _dropdownItemTemplate.contents().clone();
                dropdownItem.find(".city-name").text(city.name);
                dropdownItem.find(".city-iso").text(city.country);
                dropdownItem.appendTo(_autocompleteDropdown);
                dropdownItem.on("click", async () => await SearchCity_1.default.HandleDropdownAutoCompleteClick(city, inputElement));
            });
            const dropdownItemCityName = _dropdownItemTemplate.contents().clone();
            dropdownItemCityName.find(".city-name").text(value.toString());
            dropdownItemCityName.find(".city-iso").text("");
            dropdownItemCityName.appendTo(_autocompleteDropdown);
            dropdownItemCityName.on("click", async () => await SearchCity_1.default.HandleDropdownAutoCompleteClick({ name: value }, inputElement, true));
        }).catch(err => {
            SearchCity_1.default.ToggleAutocompleteDropdown(false);
            Loading_1.default.Toggle(false);
        }).then(res => {
            Loading_1.default.Toggle(false);
        });
        SearchCity_1.default.ToggleAutocompleteDropdown(true, true);
    },
    async HandleDropdownAutoCompleteClick(city, inputElement, notFromCityList) {
        SearchCity_1.default.ToggleAutocompleteDropdown(false);
        Loading_1.default.Toggle(true);
        await WeatherApi_1.default.GetOpenWeatherData({ lat: city.lat, lon: city.lng, name: city.name }).then(res => WeatherApi_1.default.UpdateOpenWeatherData(res, city.name, notFromCityList)).catch(err => {
            Loading_1.default.Toggle(false);
            console.error(err);
        }).finally(() => {
            inputElement.val("");
            Loading_1.default.Toggle(false);
        });
        await WeatherApi_1.default.GetWeatherApiData({ lat: city.lat, lon: city.lng, name: city.name }).then(WeatherApi_1.default.UpdateWeatherApiData).catch(err => {
            Loading_1.default.Toggle(false);
        });
    },
    ToggleAutocompleteDropdown(state, clear) {
        if (state === true) {
            if (clear)
                _autocompleteDropdown.empty();
            _autocompleteDropdown.removeClass("hide");
            _weatherDataContainer.addClass("blur");
        }
        else {
            _autocompleteDropdown.empty();
            _autocompleteDropdown.addClass("hide");
            _weatherDataContainer.removeClass("blur");
            _searchBoxLoadingSpinner.addClass("hide");
        }
    }
};
