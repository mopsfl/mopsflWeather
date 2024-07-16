import self from "./LocalStorage"
import Util from "./Util";

export default {
    Create(key: string, value = {}) {
        return localStorage.setItem(key, Util.CompressData(value));
    },

    Set(key: string, name: string, value: any) {
        const storedData = self.Exists(key) && Util.UncompressData(localStorage.getItem(key));
        if (!storedData) return console.warn(`Invalid localStorage key '${key}'`);
        storedData[name] = value;
        localStorage.setItem(key, Util.CompressData(storedData));
    },

    Edit(key: string, index: number | string, name: string, value: any) {
        const storedData = self.Exists(key) && Util.UncompressData(localStorage.getItem(key));
        if (!storedData) return console.warn(`Invalid localStorage key '${key}'`);
        storedData[index][name] = value;
        localStorage.setItem(key, Util.CompressData(storedData));
    },

    GetKey(key: string, index: number | string) {
        const storedData = self.Exists(key) && Util.UncompressData(localStorage.getItem(key));
        if (!storedData) return console.warn(`Invalid localStorage key '${key}'`);
        return storedData[index];
    },

    Exists(key: string) {
        return localStorage.getItem(key);
    },

    Clear(key: string) {
        return localStorage.removeItem(key);
    }
}