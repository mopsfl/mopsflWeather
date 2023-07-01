export default class WeatherIcon {
    constructor(_PATHS = {
        static: "./svg/static/",
        animated: "./svg/animated/"
    }) {
        this._PATHS = _PATHS;
    }
    CreateWeatherIcon(Name, animated, Size = "medium", child) {
        const Path = animated ? this._PATHS.animated : this._PATHS.static;
        const ImageElement = document.createElement("img");
        ImageElement.src = `${Path}${Name}.svg`;
        ImageElement.classList.add(`icon-${Size}`);
        if (child)
            child.appendChild(ImageElement);
        return ImageElement;
    }
}
