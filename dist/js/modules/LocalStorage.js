"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LocalStorage_1 = __importDefault(require("./LocalStorage"));
exports.default = {
    Create(key, value) {
        return localStorage.setItem(key, btoa(JSON.stringify(value || {})));
    },
    Set(key, name, value) {
        const _data = LocalStorage_1.default.Exists(key) && JSON.parse(decodeURIComponent(atob(localStorage.getItem(key))));
        if (!_data)
            return console.warn(`invalid localstorage key '${key}'`);
        _data[name] = value;
        localStorage.setItem(key, btoa(encodeURIComponent(JSON.stringify(_data))));
    },
    Edit(key, index, name, value) {
        const _data = LocalStorage_1.default.Exists(key) && JSON.parse(decodeURIComponent(atob(localStorage.getItem(key))));
        if (!_data)
            return console.warn(`invalid localstorage key '${key}'`);
        _data[index][name] = value;
        localStorage.setItem(key, btoa(encodeURIComponent(JSON.stringify(_data))));
    },
    GetKey(key, index) {
        const _data = LocalStorage_1.default.Exists(key) && JSON.parse(decodeURIComponent(atob(localStorage.getItem(key))));
        if (!_data)
            return console.warn(`invalid localstorage key '${key}'`);
        return _data[index];
    },
    Exists(key) {
        return localStorage.getItem(key);
    },
    Clear(key) {
        return localStorage.removeItem(key);
    }
};
