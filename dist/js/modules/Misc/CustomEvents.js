"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomEvents = void 0;
class CustomEvents {
    static CreateEvent(eventName, detail) {
        return new CustomEvent(eventName, { detail });
    }
    static DispatchEvent(target, event) {
        target.dispatchEvent(event);
    }
    static AddEventListener(target, eventName, listener) {
        target.addEventListener(eventName, (event) => {
            listener(event);
        });
    }
    static RemoveEventListener(target, eventName, listener) {
        target.removeEventListener(eventName, listener);
    }
}
exports.CustomEvents = CustomEvents;
