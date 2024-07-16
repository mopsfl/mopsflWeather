"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LocalStorage_1 = __importDefault(require("./LocalStorage"));
const Util_1 = __importDefault(require("./Util"));
exports.default = {
    Create(key, value = {}) {
        return localStorage.setItem(key, Util_1.default.CompressData(value));
    },
    Set(key, name, value) {
        try {
            const storedData = LocalStorage_1.default.Exists(key) && Util_1.default.UncompressData(localStorage.getItem(key));
            if (!storedData)
                return console.warn(`Invalid localStorage key '${key}'`);
            storedData[name] = value;
            localStorage.setItem(key, Util_1.default.CompressData(storedData));
        }
        catch (error) {
            console.error(error);
        }
    },
    Edit(key, index, name, value) {
        try {
            const storedData = LocalStorage_1.default.Exists(key) && Util_1.default.UncompressData(localStorage.getItem(key));
            if (!storedData)
                return console.warn(`Invalid localStorage key '${key}'`);
            storedData[index] && (storedData[index][name] = value);
            localStorage.setItem(key, Util_1.default.CompressData(storedData));
        }
        catch (error) {
            console.error(error);
            localStorage.setItem(key, Util_1.default.CompressData({}));
        }
    },
    GetKey(key, index) {
        try {
            const storedData = LocalStorage_1.default.Exists(key) && Util_1.default.UncompressData(localStorage.getItem(key));
            if (!storedData)
                return console.warn(`Invalid localStorage key '${key}'`);
            return storedData[index];
        }
        catch (error) {
            return {};
        }
    },
    Exists(key) {
        return localStorage.getItem(key);
    },
    Clear(key) {
        return localStorage.removeItem(key);
    }
};
