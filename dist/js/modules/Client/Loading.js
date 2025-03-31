"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    Toggle(element, state) {
        state == true ? element.removeClass("hide") : element.addClass("hide");
    }
};
