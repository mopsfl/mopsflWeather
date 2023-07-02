export default class LoadingCircle {
    constructor(
        public Config: {
            loading_circle: HTMLElement
        }
    ) {}

    ToggleLoading(State?: boolean){
        if(!this.Config.loading_circle) return console.warn("Missing 'loading_circle' element.")
        if(State == undefined){
            this.Config.loading_circle.classList.toggle("hide")
        } else {
            if(State == true) {
                this.Config.loading_circle.classList.remove("hide")
            } else if(State == false) {
                this.Config.loading_circle.classList.add("hide")
            }
        }
    }
}