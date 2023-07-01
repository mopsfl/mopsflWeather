// modules/GeoLocation.ts
function GetGeoLocation(positionCallback, errorCallback) {
  navigator.geolocation.getCurrentPosition(positionCallback, errorCallback, {
    enableHighAccuracy: true,
    timeout: 5e3,
    maximumAge: 0
  });
}

// modules/WeatherApi.ts
var WeatherApi = class {
  constructor(API_URL_DEV = "http://localhost:6969/api/v1/", API_URL_HTTPS = "https://mopsflgithubio.mopsfl.repl.co/api/mopsflweather/", API_URL_HTTP = "http://prem.daki.cc:6082/api/v1/data/") {
    this.API_URL_DEV = API_URL_DEV;
    this.API_URL_HTTPS = API_URL_HTTPS;
    this.API_URL_HTTP = API_URL_HTTP;
  }
  async GetCurrentWeather(secureProtocol = true, dev = false) {
    const loading_circle = document.querySelector(".weather_data_loading");
    loading_circle.classList.remove("hide");
    const weather_data = await fetch((secureProtocol ? this.API_URL_HTTPS : dev ? this.API_URL_DEV + "data/" : this.API_URL_HTTP) + "currentweather").then((res) => res.json());
    loading_circle.classList.add("hide");
    return weather_data;
  }
  async SearchCity(Name, secureProtocol = true, dev = false) {
    const loading_circle = document.querySelector(".weather_data_loading");
    loading_circle.classList.remove("hide");
    const results = await fetch((secureProtocol ? this.API_URL_HTTPS : dev ? this.API_URL_DEV + "data/" : this.API_URL_HTTP) + `searchcity?name=${Name}`).then((res) => res.json());
    loading_circle.classList.add("hide");
    return results;
  }
};

// modules/WeatherIcon.ts
var WeatherIcon = class {
  constructor(_PATHS = {
    static: "./svg/static/",
    animated: "./svg/animated/"
  }) {
    this._PATHS = _PATHS;
  }
  CreateWeatherIcon(Name, animated, Size = "medium", child) {
    const Path = animated ? this._PATHS.animated : this._PATHS.static;
    const ImageElement = document.createElement("img");
    ImageElement.src = `${Path}${Name}.svg`;
    ImageElement.classList.add(`icon-${Size}`);
    if (child)
      child.appendChild(ImageElement);
    return ImageElement;
  }
};

// modules/SearchCity.ts
var SearchCity = class {
  constructor(Config) {
    this.Config = Config;
  }
  ToggleResults(State) {
    if (!this.Config.location_search_results)
      return console.warn("Missing 'location_search_results' element.");
    if (!this.Config.location_search_input)
      return console.warn("Missing 'location_search_input' element.");
    if (State == void 0) {
      this.Config.location_search_input.classList.toggle("results_visible");
      this.Config.location_search_results.classList.toggle("hide_location_search_results");
    } else {
      if (State == true) {
        this.Config.location_search_input.classList.add("results_visible");
        this.Config.location_search_results.classList.remove("hide_location_search_results");
      } else if (State == false) {
        this.Config.location_search_input.classList.remove("results_visible");
        this.Config.location_search_results.classList.add("hide_location_search_results");
      }
    }
  }
  UpdateResults(Results) {
    if (!this.Config.location_search_result_template)
      return console.warn("Missing 'location_search_result_template' element.");
    this.Config.location_search_results.innerHTML = "";
    Results.forEach((city) => {
      const city_result = this.Config.location_search_result_template.content.cloneNode(true).childNodes[1];
      city_result.setAttribute("city-id", city.id);
      city_result.setAttribute("city-name", city.city_ascii);
      city_result.classList.add("location_search_result_animate");
      city_result.querySelector(".location_search_result_cityname").innerText = `${city.city} - ${city.iso2}`;
      this.Config.location_search_results.appendChild(city_result);
      window["ripple"].registerRipples();
    });
  }
};

// index.ts
var DEV_MODE = false;
var HTTPS_SERVER = true;
var weatherApi = new WeatherApi();
var weatherIcon = new WeatherIcon();
var searchCity = new SearchCity({
  location_search_results: document.querySelector(".location_search_results"),
  location_search_input: document.querySelector(".location_search_input"),
  location_search_result_template: document.querySelector(".location_search_result_template")
});
GetGeoLocation(SetGeoLocation, ErrorCallback);
function SetGeoLocation(pos) {
  window["coords"] = pos.coords;
}
function ErrorCallback(err) {
  throw err;
}
if (DEV_MODE)
  console.warn("App running on DEV_MODE");
var currentWeather = await weatherApi.GetCurrentWeather(HTTPS_SERVER, DEV_MODE);
var location_search_input = document.querySelector(".location_search_input");
window["currentWeather"] = currentWeather;
location_search_input.addEventListener("input", async (e) => {
  if (!e.target.validity.valid && e.target.validity.valueMissing)
    return searchCity.ToggleResults(false);
  const input = e.target.value.replace(/\s/g, "");
  if (input.length <= 0)
    return searchCity.ToggleResults(false);
  const search_results = await weatherApi.SearchCity(e.target.value.trim(), HTTPS_SERVER, DEV_MODE);
  if (search_results.length > 0) {
    searchCity.ToggleResults(true);
    searchCity.UpdateResults(search_results);
  } else
    searchCity.ToggleResults(false);
});
location_search_input.addEventListener("focus", () => {
  if (location_search_input.validity.valid)
    searchCity.ToggleResults(true);
});
location_search_input.addEventListener("focusout", () => {
  if (!location_search_input.validity.valid)
    searchCity.ToggleResults(false);
});
