export default class LoadingCircle {
    constructor(
        public Config: {
            loading_circle: HTMLElement
        }
    ) {}

    /**
     * Toggles the default loading circle or the given Element
     * @param State 
     * @param LoadingCircle 
     */
    ToggleLoading(State?: boolean, LoadingCircle?: Element){
        const element = LoadingCircle ? LoadingCircle : this.Config.loading_circle
        if(!element) return console.warn("Missing 'loading_circle' element.")
        
        if(State == undefined){
            element.classList.toggle("hide")
        } else {
            if(State == true) {
                element.classList.remove("hide")
            } else if(State == false) {
                element.classList.add("hide")
            }
        }
    }
}