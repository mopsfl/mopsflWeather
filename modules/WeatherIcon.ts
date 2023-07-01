export default class WeatherIcon {
    constructor(
        readonly _PATHS: { static: String, animated: String } = {
            static: "./svg/static/",
            animated: "./svg/animated/"
        }
    ) {}

    CreateWeatherIcon(Name: string, animated?: boolean, Size: "large" | "medium" | "small" = "medium", child?: HTMLElement){
        const Path = animated ? this._PATHS.animated : this._PATHS.static
        const ImageElement: HTMLImageElement = document.createElement("img")
        ImageElement.src = `${Path}${Name}.svg`
        ImageElement.classList.add(`icon-${Size}`)
        if(child) child.appendChild(ImageElement)

        return ImageElement
    }
}