export default class LocalStorage {
    constructor(
        public Config: {
            key: string,
        }
    ) {
        if (!localStorage.getItem(this.Config.key)) {
            localStorage.setItem(this.Config.key, btoa(JSON.stringify(window.stringEncode.str2buffer(JSON.stringify({})))))
        }
    }

    /**
     * @description Adds or sets a value to the localStorage
     * @param name
     * @param value 
     */
    Set(name: string, value: string) {
        if (!(name || value)) throw new Error("Missing required arguments")
        const data_object: Object = JSON.parse(window.stringEncode.buffer2str(new Uint8Array(Object.values(JSON.parse(atob(localStorage.getItem(this.Config.key)))))))
        data_object[name] = value

        const new_buffer = window.stringEncode.str2buffer(JSON.stringify(data_object))
        localStorage.setItem(this.Config.key, btoa(JSON.stringify(new_buffer)))
    }

    /**
     * @description Gets a specific key from the localstorage
     * @param key 
     */
    GetKey(key: string) {
        if (!key) throw new Error("Missing required arguments.")
        const data_object: Object = JSON.parse(window.stringEncode.buffer2str(new Uint8Array(Object.values(JSON.parse(atob(localStorage.getItem(this.Config.key)))))))
        if (!data_object[key]) return
        return JSON.parse(data_object[key])
    }

    /**
     * @description Parses the encoded localStorage data
     */
    Parse() {
        return JSON.parse(window.stringEncode.buffer2str(new Uint8Array(Object.values(JSON.parse(atob(localStorage.getItem(this.Config.key)))))))
    }
}