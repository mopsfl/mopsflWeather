export default function GetGeoLocation(positionCallback, errorCallback) {
    navigator.geolocation.getCurrentPosition(positionCallback, errorCallback, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    });
}
