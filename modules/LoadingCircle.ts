export default class LoadingCircle {
    constructor(
        public Config: {
            loading_circle: HTMLElement
        }
    ) {}

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