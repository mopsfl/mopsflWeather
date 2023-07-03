// modules/LoadingCircle.ts
var LoadingCircle = class {
  constructor(Config) {
    this.Config = Config;
  }
  ToggleLoading(State, LoadingCircle2) {
    const element = LoadingCircle2 ? LoadingCircle2 : this.Config.loading_circle;
    if (!element)
      return console.warn("Missing 'loading_circle' element.");
    if (State == void 0) {
      element.classList.toggle("hide");
    } else {
      if (State == true) {
        element.classList.remove("hide");
      } else if (State == false) {
        element.classList.add("hide");
      }
    }
  }
};

// modules/WeatherApi.ts
var loadingCircle = new LoadingCircle({
  loading_circle: document.querySelector(".weather_data_loading")
});
var weather_data_cityname = document.querySelector(".weather_data_cityname");
var weather_data_cityname_loading = document.querySelector(".weather_data_cityname_loading");
var WeatherApi = class {
  constructor(API_URL_DEV = "http://localhost:6969/api/v1/", API_URL_HTTPS = "https://mopsflgithubio.mopsfl.repl.co/api/mopsflweather/", API_URL_HTTP = "http://prem.daki.cc:6082/api/v1/data/") {
    this.API_URL_DEV = API_URL_DEV;
    this.API_URL_HTTPS = API_URL_HTTPS;
    this.API_URL_HTTP = API_URL_HTTP;
  }
  async GetCurrentWeather(secureProtocol = HTTPS_SERVER, dev = DEV_MODE) {
    loadingCircle.ToggleLoading(true);
    loadingCircle.ToggleLoading(true, weather_data_cityname_loading);
    weather_data_cityname.classList.add("hide");
    const weather_data = await fetch((secureProtocol ? this.API_URL_HTTPS : dev ? this.API_URL_DEV + "data/" : this.API_URL_HTTP) + "currentweather").then((res) => res.json());
    loadingCircle.ToggleLoading(false, weather_data_cityname_loading);
    weather_data_cityname.classList.remove("hide");
    return weather_data;
  }
  async GetWeatherData(args, secureProtocol = HTTPS_SERVER, dev = DEV_MODE) {
    if (!args)
      throw new Error("Missing required arguments");
    let weather_data;
    loadingCircle.ToggleLoading(true);
    loadingCircle.ToggleLoading(true, weather_data_cityname_loading);
    weather_data_cityname.classList.add("hide");
    if (args.name && !(args.lat || args.lon)) {
      console.log("get weatherdata by name");
    } else {
      weather_data = await fetch((secureProtocol ? this.API_URL_HTTPS : dev ? this.API_URL_DEV + "data/" : this.API_URL_HTTP) + `currentweather?${args.lat && args.lon ? `lat=${args.lat}&lon=${args.lon}` : ``}`).then((res) => res.json());
      loadingCircle.ToggleLoading(false);
      const data = weather_data.data;
      weather_data_cityname.innerHTML = `${data.name || data.name}`;
    }
    loadingCircle.ToggleLoading(false, weather_data_cityname_loading);
    weather_data_cityname.classList.remove("hide");
  }
  async SearchCity(Name, secureProtocol = HTTPS_SERVER, dev = DEV_MODE) {
    loadingCircle.ToggleLoading(true);
    const results = await fetch((secureProtocol ? this.API_URL_HTTPS : dev ? this.API_URL_DEV + "data/" : this.API_URL_HTTP) + `searchcity?name=${Name}`).then((res) => res.json());
    loadingCircle.ToggleLoading(false);
    return results;
  }
  async UpdateCurrentWeather(cityData) {
    const request_arguments = {};
    if (cityData) {
      request_arguments["lat"] = cityData.lat;
      request_arguments["lon"] = cityData.lng;
    }
    return await this.GetWeatherData(request_arguments);
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
  CreateWeatherIcon(Name, animated = false, Size = "medium", child) {
    if (!(Name || Size))
      throw new Error("Missing required arguments");
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
    if (!Results)
      throw new Error("Missing required arguments");
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
    if (!localStorage.getItem(this.Config.key)) {
      localStorage.setItem(this.Config.key, btoa(JSON.stringify(window.stringEncode.str2buffer(JSON.stringify({})))));
    }
  }
  Set(name, value) {
    if (!(name || value))
      throw new Error("Missing required arguments");
    const data_object = JSON.parse(window.stringEncode.buffer2str(new Uint8Array(Object.values(JSON.parse(atob(localStorage.getItem(this.Config.key)))))));
    data_object[name] = value;
    const new_buffer = window.stringEncode.str2buffer(JSON.stringify(data_object));
    localStorage.setItem(this.Config.key, btoa(JSON.stringify(new_buffer)));
  }
  Parse() {
    return JSON.parse(window.stringEncode.buffer2str(new Uint8Array(Object.values(JSON.parse(atob(localStorage.getItem(this.Config.key)))))));
  }
};

// modules/GeoLocation.ts
var GeoLocation = class {
  constructor() {
  }
  GetGeoLocation(positionCallback, errorCallback) {
    if (!(positionCallback || errorCallback))
      throw new Error("Missing required arguments");
    navigator.geolocation.getCurrentPosition(positionCallback, errorCallback, {
      enableHighAccuracy: true,
      timeout: 5e3,
      maximumAge: 0
    });
  }
};

// index.ts
var DEV_MODE = false;
var HTTPS_SERVER = true;
var geoLocation = new GeoLocation();
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
window.modules = {
  classes: { GeoLocation, WeatherApi, WeatherIcon, SearchCity, LoadingCircle, LocalStorage },
  initialized: { weatherApi: weatherApi2, weatherIcon, localStorage: localStorage2, loadingCircle: loadingCircle2, searchCity, geoLocation }
};
loadingCircle2.ToggleLoading(true);
await navigator.permissions.query({ name: "geolocation" }).then(async (res) => {
  window.geolocation_state = res.state;
  const ls_data = localStorage2.Parse();
  let saved_coords;
  if (ls_data.coords) {
    saved_coords = JSON.parse(ls_data.coords);
    window.current_geolocation_data = "saved";
  }
  if (saved_coords && typeof saved_coords == "object") {
    return SetGeoLocation(saved_coords);
  }
  window.current_geolocation_data = "none";
  geoLocation.GetGeoLocation(SetGeoLocation, ErrorCallback);
});
async function SetGeoLocation(pos) {
  window.coords = pos.coords;
  localStorage2.Set("coords", JSON.stringify(cloneAsObject(pos)));
  const results = await weatherApi2.GetWeatherData({
    lat: window.coords.latitude,
    lon: window.coords.longitude
  });
  window.currentWeather = results;
}
async function ErrorCallback(err) {
  if (window.current_geolocation_data == "none")
    await weatherApi2.UpdateCurrentWeather();
  throw err;
}
function cloneAsObject(obj) {
  if (obj === null || !(obj instanceof Object))
    return obj;
  var temp = obj instanceof Array ? [] : {};
  for (var key in obj) {
    temp[key] = cloneAsObject(obj[key]);
  }
  return temp;
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
