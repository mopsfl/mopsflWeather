"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorage = void 0;
const Util_1 = __importDefault(require("./Util"));
class LocalStorage {
    key;
    defaultStorageData = {
        lastUpdated: 0,
    };
    constructor(key) {
        this.key = key;
        if (!this.Exists()) {
            const data = this.defaultStorageData;
            data.lastUpdated = new Date().getTime();
            localStorage.setItem(this.key, Util_1.default.CompressData(data));
        }
    }
    GetData() {
        try {
            const storedDataRaw = localStorage.getItem(this.key);
            if (!storedDataRaw) {
                console.warn(`Invalid localStorage key '${this.key}'`);
                return false;
            }
            const storedData = Util_1.default.UncompressData(storedDataRaw);
            return storedData;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }
    Set(name, value) {
        try {
            const storedDataRaw = localStorage.getItem(this.key);
            if (!storedDataRaw) {
                console.warn(`Invalid localStorage key '${this.key}'`);
                return false;
            }
            const storedData = Util_1.default.UncompressData(storedDataRaw);
            storedData[name] = value;
            localStorage.setItem(this.key, Util_1.default.CompressData(storedData));
            return true;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }
    Edit(name, key, value) {
        try {
            const storedDataRaw = localStorage.getItem(this.key);
            if (!storedDataRaw) {
                console.warn(`Invalid localStorage key '${this.key}'`);
                return false;
            }
            const storedData = Util_1.default.UncompressData(storedDataRaw);
            if (!storedData[name]) {
                console.warn(`no entry found at index '${name}' in '${this.key}'`);
                return false;
            }
            storedData[name][key] = value;
            localStorage.setItem(this.key, Util_1.default.CompressData(storedData));
            return true;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }
    GetKey(index) {
        try {
            const storedDataRaw = localStorage.getItem(this.key);
            if (!storedDataRaw) {
                console.warn(`Invalid localStorage key '${this.key}'`);
                return null;
            }
            const storedData = Util_1.default.UncompressData(storedDataRaw);
            return storedData[index] ?? null;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }
    DeleteKey(key) {
        try {
            const storedDataRaw = localStorage.getItem(this.key);
            if (!storedDataRaw) {
                console.warn(`Invalid localStorage key '${this.key}'`);
                return null;
            }
            const storedData = Util_1.default.UncompressData(storedDataRaw);
            storedData[key] = undefined;
            localStorage.setItem(this.key, Util_1.default.CompressData(storedData));
            return;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }
    Exists() {
        return localStorage.getItem(this.key) !== null;
    }
    Clear() {
        if (!this.Exists()) {
            console.warn(`Cannot clear: Key '${this.key}' does not exist.`);
            return false;
        }
        localStorage.removeItem(this.key);
        return true;
    }
}
exports.LocalStorage = LocalStorage;
