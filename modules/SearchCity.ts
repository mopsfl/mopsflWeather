import WeatherApi, { CityData } from "./WeatherApi"

const weatherApi = new WeatherApi()

export default class SearchCity {
    constructor(
        public Config: {
            location_search_results: HTMLElement,
            location_search_input: HTMLElement,
            location_search_result_template: any
        },
        public selectedCity?: Object,
    ) {}

    ToggleResults(State?: boolean){
        if(!this.Config.location_search_results) return console.warn("Missing 'location_search_results' element.")
        if(!this.Config.location_search_input) return console.warn("Missing 'location_search_input' element.")
        if(State == undefined){
            this.Config.location_search_input.classList.toggle("results_visible")
            this.Config.location_search_results.classList.toggle("hide_location_search_results")
        } else {
            if(State == true) {
                this.Config.location_search_input.classList.add("results_visible")
                this.Config.location_search_results.classList.remove("hide_location_search_results")
            } else if(State == false) {
                this.Config.location_search_input.classList.remove("results_visible")
                this.Config.location_search_results.classList.add("hide_location_search_results")
                this.Config.location_search_results.innerHTML = ""
            }
        }
    }

    UpdateResults(Results: [ CityData ]){
        if(!(Results)) throw new Error("Missing required arguments")
        if(!this.Config.location_search_result_template) return console.warn("Missing 'location_search_result_template' element.")
        this.Config.location_search_results.innerHTML = ""
        Results.forEach(city => {
            const city_result: HTMLElement = this.Config.location_search_result_template.content.cloneNode(true).childNodes[1]
            city_result.setAttribute("city-id", city.id)
            city_result.setAttribute("city-name", city.city_ascii)
            city_result.classList.add("location_search_result_animate")
            city_result.querySelector(".location_search_result_cityname")["innerText"] = `${city.city} - ${city.iso2}`
            this.Config.location_search_results.appendChild(city_result)
            window["ripple"].registerRipples();

            city_result.addEventListener("click", async (e) => {
                this.selectedCity = city
                await weatherApi.UpdateCurrentWeather(city)
                this.ToggleResults(false)
            })
        })
    }
}