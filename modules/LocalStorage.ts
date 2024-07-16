import self from "./LocalStorage"
import Util from "./Util";

export default {
    Create(key: string, value = {}) {
        return localStorage.setItem(key, Util.CompressData(value));
    },

    Set(key: string, name: string, value: any) {
        try {
            const storedData = self.Exists(key) && Util.UncompressData(localStorage.getItem(key));
            if (!storedData) return console.warn(`Invalid localStorage key '${key}'`);
            storedData[name] = value;
            localStorage.setItem(key, Util.CompressData(storedData));
        } catch (error) {
            console.error(error)
        }
    },

    Edit(key: string, index: number | string, name: string, value: any) {
        try {
            const storedData = self.Exists(key) && Util.UncompressData(localStorage.getItem(key));
            if (!storedData) return console.warn(`Invalid localStorage key '${key}'`);
            storedData[index] && (storedData[index][name] = value);
            localStorage.setItem(key, Util.CompressData(storedData));
        } catch (error) {
            console.error(error)
            localStorage.setItem(key, Util.CompressData({}));
        }
    },

    GetKey(key: string, index: number | string) {
        try {
            const storedData = self.Exists(key) && Util.UncompressData(localStorage.getItem(key));
            if (!storedData) return console.warn(`Invalid localStorage key '${key}'`);
            return storedData[index];
        } catch (error) {
            return {}
        }
    },

    Exists(key: string) {
        return localStorage.getItem(key);
    },

    Clear(key: string) {
        return localStorage.removeItem(key);
    }
}