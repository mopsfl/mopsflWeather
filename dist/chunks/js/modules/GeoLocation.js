export default class GeoLocation {
    constructor() { }
    GetGeoLocation(positionCallback, errorCallback) {
        if (!(positionCallback || errorCallback))
            throw new Error("Missing required arguments");
        navigator.geolocation.getCurrentPosition(positionCallback, errorCallback, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        });
    }
}
