import { App } from "../Types/Global"

export default {
    GetLocation(): Promise<GeolocationPosition> {
        const settings = App.settings.GetSettings()

        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: settings.high_accuracy_location || false,
                timeout: 5000,
                maximumAge: 120000,
            })
        })
    }
}