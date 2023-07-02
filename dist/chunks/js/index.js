var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// index.ts
var frontend_exports = {};
__export(frontend_exports, {
  DEV_MODE: () => DEV_MODE,
  HTTPS_SERVER: () => HTTPS_SERVER
});

// modules/GeoLocation.ts
function GetGeoLocation(positionCallback, errorCallback) {
  navigator.geolocation.getCurrentPosition(positionCallback, errorCallback, {
    enableHighAccuracy: true,
    timeout: 5e3,
    maximumAge: 0
  });
}

// modules/LoadingCircle.ts
var LoadingCircle = class {
  constructor(Config) {
    this.Config = Config;
  }
  ToggleLoading(State) {
    if (!this.Config.loading_circle)
      return console.warn("Missing 'loading_circle' element.");
    if (State == void 0) {
      this.Config.loading_circle.classList.toggle("hide");
    } else {
      if (State == true) {
        this.Config.loading_circle.classList.remove("hide");
      } else if (State == false) {
        this.Config.loading_circle.classList.add("hide");
      }
    }
  }
};

// modules/WeatherApi.ts
var loadingCircle = new LoadingCircle({
  loading_circle: document.querySelector(".weather_data_loading")
});
var WeatherApi = class {
  constructor(API_URL_DEV = "http://localhost:6969/api/v1/", API_URL_HTTPS = "https://mopsflgithubio.mopsfl.repl.co/api/mopsflweather/", API_URL_HTTP = "http://prem.daki.cc:6082/api/v1/data/") {
    this.API_URL_DEV = API_URL_DEV;
    this.API_URL_HTTPS = API_URL_HTTPS;
    this.API_URL_HTTP = API_URL_HTTP;
  }
  async GetCurrentWeather(secureProtocol = HTTPS_SERVER, dev = DEV_MODE) {
    loadingCircle.ToggleLoading(true);
    const weather_data = await fetch((secureProtocol ? this.API_URL_HTTPS : dev ? this.API_URL_DEV + "data/" : this.API_URL_HTTP) + "currentweather").then((res) => res.json());
    loadingCircle.ToggleLoading(false);
    return weather_data;
  }
  async GetWeatherData(args, secureProtocol = HTTPS_SERVER, dev = DEV_MODE) {
    if (args.name && !(args.lat || args.lon)) {
      console.log("get weatherdata by name");
    } else {
      loadingCircle.ToggleLoading(true);
      const weather_data = await fetch((secureProtocol ? this.API_URL_HTTPS : dev ? this.API_URL_DEV + "data/" : this.API_URL_HTTP) + `currentweather?lat=${args.lat}&lon=${args.lon}`).then((res) => res.json());
      loadingCircle.ToggleLoading(false);
      const data = weather_data.data.data || weather_data.data;
      document.querySelector(".weather_data_cityname").innerHTML = `${data.name || data.name}<br>Temperature: ${data.main.temp || data.main.temp} \xB0C<br><br>${data.weather[0].description}`;
    }
  }
  async SearchCity(Name, secureProtocol = HTTPS_SERVER, dev = DEV_MODE) {
    loadingCircle.ToggleLoading(true);
    const results = await fetch((secureProtocol ? this.API_URL_HTTPS : dev ? this.API_URL_DEV + "data/" : this.API_URL_HTTP) + `searchcity?name=${Name}`).then((res) => res.json());
    loadingCircle.ToggleLoading(false);
    return results;
  }
  async UpdateCurrentWeather(cityData) {
    const weatherData = await this.GetWeatherData({
      lat: cityData.lat,
      lon: cityData.lng
    });
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
var weatherApi = new WeatherApi();
var SearchCity = class {
  constructor(Config, selectedCity) {
    this.Config = Config;
    this.selectedCity = selectedCity;
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
        this.Config.location_search_results.innerHTML = "";
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
      city_result.querySelector(".location_search_result_cityname")["innerText"] = `${city.city} - ${city.iso2}`;
      this.Config.location_search_results.appendChild(city_result);
      window["ripple"].registerRipples();
      city_result.addEventListener("click", async (e) => {
        this.selectedCity = city;
        await weatherApi.UpdateCurrentWeather(city);
        this.ToggleResults(false);
      });
    });
  }
};

// modules/LocalStorage.ts
var LocalStorage = class {
  constructor(Config) {
    this.Config = Config;
  }
  Set(name, value) {
    localStorage.setItem(`${this.Config.key}${name}`, value);
  }
};

// index.ts
var DEV_MODE = false;
var HTTPS_SERVER = false;
window.modules = {
  GetGeoLocation,
  WeatherApi,
  WeatherIcon,
  SearchCity,
  LoadingCircle,
  LocalStorage,
  _: frontend_exports
};
var weatherApi2 = new WeatherApi();
var weatherIcon = new WeatherIcon();
var localStorage2 = new LocalStorage({
  key: "_weatherdata_"
});
var loadingCircle2 = new LoadingCircle({
  loading_circle: document.querySelector(".weather_data_loading")
});
var searchCity = new SearchCity({
  location_search_results: document.querySelector(".location_search_results"),
  location_search_input: document.querySelector(".location_search_input"),
  location_search_result_template: document.querySelector(".location_search_result_template")
});
GetGeoLocation(SetGeoLocation, ErrorCallback);
async function SetGeoLocation(pos) {
  window.coords = pos.coords;
  localStorage2.Set("coords", JSON.stringify(window.coords));
  const results = await weatherApi2.GetWeatherData({
    lat: window.coords.latitude,
    lon: window.coords.longitude
  });
  window.currentWeather = results;
}
function ErrorCallback(err) {
  throw err;
}
if (DEV_MODE)
  console.warn("App running on DEV_MODE");
var location_search_input = document.querySelector(".location_search_input");
location_search_input.addEventListener("input", async (e) => {
  if (!e.target.validity.valid && e.target.validity.valueMissing)
    return searchCity.ToggleResults(false);
  const input = e.target.value.replace(/\s/g, "");
  if (input.length <= 1)
    return searchCity.ToggleResults(false);
  const search_results = await weatherApi2.SearchCity(e.target.value.trim(), HTTPS_SERVER, DEV_MODE);
  if (search_results.length > 0) {
    searchCity.ToggleResults(true);
    searchCity.UpdateResults(search_results);
  } else
    searchCity.ToggleResults(false);
  window.currentCitySearchResults = search_results;
});
location_search_input.addEventListener("focus", () => {
  if (location_search_input.validity.valid && window.currentCitySearchResults?.length > 0)
    searchCity.ToggleResults(true);
});
location_search_input.addEventListener("focusout", () => {
  if (!location_search_input.validity.valid)
    searchCity.ToggleResults(false);
});
export {
  DEV_MODE,
  HTTPS_SERVER
};
