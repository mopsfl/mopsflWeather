export default class LocalStorage{
    constructor(
        public Config: {
            key: String,
        }
    ) {}

    Set(name: String, value: string){
        localStorage.setItem(`${this.Config.key}${name}`, value)
    }
}