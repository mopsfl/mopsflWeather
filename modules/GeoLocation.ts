export function GetGeoLocation(positionCallback: PositionCallback, errorCallback: PositionErrorCallback){
    navigator.geolocation.getCurrentPosition(positionCallback, errorCallback, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    })
}