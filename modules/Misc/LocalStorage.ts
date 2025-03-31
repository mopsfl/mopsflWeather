import Util from "./Util";

export class LocalStorage {
    private key: string;
    readonly defaultStorageData = {
        lastUpdated: 0,
    }

    constructor(key: string) {
        this.key = key;

        if (!this.Exists()) {
            const data = this.defaultStorageData
            data.lastUpdated = new Date().getTime()

            localStorage.setItem(this.key, Util.CompressData(data));
        }
    }

    GetData() {
        try {
            const storedDataRaw = localStorage.getItem(this.key);
            if (!storedDataRaw) {
                console.warn(`Invalid localStorage key '${this.key}'`);
                return false;
            }
            const storedData = Util.UncompressData(storedDataRaw);
            return storedData
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    Set(name: string, value: any): boolean {
        try {
            const storedDataRaw = localStorage.getItem(this.key);
            if (!storedDataRaw) {
                console.warn(`Invalid localStorage key '${this.key}'`);
                return false;
            }
            const storedData = Util.UncompressData(storedDataRaw);
            storedData[name] = value;
            localStorage.setItem(this.key, Util.CompressData(storedData));
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    Edit(name: number | string, key: string, value: any): boolean {
        try {
            const storedDataRaw = localStorage.getItem(this.key);
            if (!storedDataRaw) {
                console.warn(`Invalid localStorage key '${this.key}'`);
                return false;
            }
            const storedData = Util.UncompressData(storedDataRaw);

            if (!storedData[name]) {
                console.warn(`no entry found at index '${name}' in '${this.key}'`);
                return false;
            }

            storedData[name][key] = value;
            localStorage.setItem(this.key, Util.CompressData(storedData));
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    GetKey(index: number | string): any | null {
        try {
            const storedDataRaw = localStorage.getItem(this.key);
            if (!storedDataRaw) {
                console.warn(`Invalid localStorage key '${this.key}'`);
                return null;
            }
            const storedData = Util.UncompressData(storedDataRaw);
            return storedData[index] ?? null;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    DeleteKey(key: string) {
        try {
            const storedDataRaw = localStorage.getItem(this.key);
            if (!storedDataRaw) {
                console.warn(`Invalid localStorage key '${this.key}'`);
                return null;
            }
            const storedData = Util.UncompressData(storedDataRaw);
            storedData[key] = undefined
            localStorage.setItem(this.key, Util.CompressData(storedData));

            return
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    Exists(): boolean {
        return localStorage.getItem(this.key) !== null;
    }

    Clear(): boolean {
        if (!this.Exists()) {
            console.warn(`Cannot clear: Key '${this.key}' does not exist.`);
            return false;
        }
        localStorage.removeItem(this.key);
        return true;
    }
}