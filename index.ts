import { WeatherApi } from "./modules/API/WeatherApi";
import { Elements } from "./modules/Client/Elements";
import { Client } from "./modules/Client/main";
import Settings from "./modules/Client/Settings";
import { LocalStorage } from "./modules/Misc/LocalStorage";
import Notifications from "./modules/Misc/Notifications";
import { App } from "./modules/Types/Global";

App.isDev = location.hostname === "localhost";
App.storage = new LocalStorage("_mopsflWeather");
App.elements = new Elements();
App.api = new WeatherApi().init();
App.settings = new Settings()
App.client = new Client().init();
App.notifications = new Notifications()


App.isDev && ((window as any).App = App)

export { App };