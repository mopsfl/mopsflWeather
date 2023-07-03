export default class LoadingCircle {
    constructor(Config) {
        this.Config = Config;
    }
    ToggleLoading(State, LoadingCircle) {
        const element = LoadingCircle ? LoadingCircle : this.Config.loading_circle;
        if (!element)
            return console.warn("Missing 'loading_circle' element.");
        if (State == undefined) {
            element.classList.toggle("hide");
        }
        else {
            if (State == true) {
                element.classList.remove("hide");
            }
            else if (State == false) {
                element.classList.add("hide");
            }
        }
    }
}
