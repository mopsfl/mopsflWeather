export default class WeatherIcon {
    constructor(_PATHS = {
        static: "./svg/static/",
        animated: "./svg/animated/"
    }) {
        this._PATHS = _PATHS;
    }
    CreateWeatherIcon(Name, animated = false, Size = "medium", child) {
        if (!(Name || Size))
            throw new Error("Missing required arguments");
        const Path = animated ? this._PATHS.animated : this._PATHS.static;
        const ImageElement = document.createElement("img");
        ImageElement.src = `${Path}${Name}.svg`;
        ImageElement.classList.add(`icon-${Size}`);
        if (child)
            child.appendChild(ImageElement);
        return ImageElement;
    }
}
