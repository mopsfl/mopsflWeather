export default class GeoLocation {
    constructor() {}

    /**
     * @description Gets the current user geoLocation. (if permissions are denied, default city will be used)
     * @param positionCallback 
     * @param errorCallback 
     */
    GetGeoLocation(positionCallback: PositionCallback, errorCallback: PositionErrorCallback){
        if(!(positionCallback || errorCallback)) throw new Error("Missing required arguments")
        navigator.geolocation.getCurrentPosition(positionCallback, errorCallback, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        })
    }
}