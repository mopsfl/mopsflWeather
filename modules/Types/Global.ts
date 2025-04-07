import { WeatherApi } from "../API/WeatherApi";
import { Elements } from "../Client/Elements";
import { Client } from "../Client/Main";
import Settings from "../Client/Settings";
import { LocalStorage } from "../Misc/LocalStorage";
import Notifications from "../Misc/Notifications";

interface AppModules {
    storage?: LocalStorage;
    api?: WeatherApi;
    client?: Client;
    notifications?: Notifications,
    settings?: Settings,
    isDev?: boolean,
    elements?: Elements,
}

export const App: AppModules = {};
