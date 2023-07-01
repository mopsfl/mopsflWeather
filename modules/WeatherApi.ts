export default class WeatherApi {
    constructor(
        readonly API_URL_DEV: String = "http://localhost:6969/api/v1/",
        readonly API_URL: String = "http://prem.daki.cc:6082/api/v1/"
    ) {}

    async GetCurrentWeather(){
        return await fetch(this.API_URL + "data/currentweather").then(res => res.json())
    }
}