"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Util_1 = __importDefault(require("./Util"));
class Notifications {
    NotificationTypes;
    NotificationsContainer;
    constructor(NotificationTypes = {
        info: { backgroundColor: "#0084b7", attr: "info" },
        warn: { backgroundColor: "#ce6a00", attr: "warn" },
        error: { backgroundColor: "#b70000", attr: "error" },
    }, NotificationsContainer = document.querySelector(".notifications")) {
        this.NotificationTypes = NotificationTypes;
        this.NotificationsContainer = NotificationsContainer;
    }
    throwError(error, cause) {
        throw new Error(`[Notifications]: ${error}`, { cause: cause });
    }
    new(args) {
        if (!(args instanceof Object))
            this.throwError(`invalid NotificationArguments.`, `argument being typeof ${typeof (args)}`);
        let [notification, notificationBody, closeButton] = this.CreateNotificationDiv(args);
        notification.addEventListener("click", (e) => {
            if (e.target !== notification)
                return;
            notification.classList.toggle("notification-expand");
        }, false);
        closeButton.addEventListener("click", (e) => {
            notification.classList.add("notification-out");
            setTimeout(() => notification.remove(), 250);
        }, false);
    }
    info(title, text) {
        return this.new({ title: title.toString(), bodyText: text, backgroundColor: this.NotificationTypes.info.backgroundColor, type: "info" });
    }
    warn(title, text) {
        return this.new({ title: title.toString(), bodyText: text, backgroundColor: this.NotificationTypes.warn.backgroundColor, type: "warn" });
    }
    error(title, text) {
        return this.new({ title: title.toString(), bodyText: text, backgroundColor: this.NotificationTypes.error.backgroundColor, type: "error" });
    }
    CreateNotificationDiv(args) {
        if (!(args instanceof Object)) {
            this.throwError(`invalid NotificationArguments.`, `argument being typeof ${typeof args}`);
        }
        const { type = "info", title = "", bodyText = "" } = args;
        const { attr: attrName, backgroundColor } = this.NotificationTypes[type] || this.NotificationTypes["info"];
        const div = Util_1.default.CreateElementWithClass("div", "notification");
        const titleDiv = Util_1.default.CreateElementWithClass("div", "notification-title");
        const titleText = Util_1.default.CreateElementWithClass("span", "notification-title-text", title);
        const titleIcon = Util_1.default.CreateElementWithClass("span", "material-symbols-outlined", type === "warn" ? "warning" : type);
        const closeButton = Util_1.default.CreateElementWithClass("button", "close-button");
        const closeButtonIcon = Util_1.default.CreateElementWithClass("span", "material-symbols-outlined", "close");
        const body = Util_1.default.CreateElementWithClass("div", "notification-body", bodyText);
        if (attrName)
            div.setAttribute("notification-type", attrName);
        titleDiv.append(titleIcon, titleText);
        div.append(titleDiv, body);
        titleDiv.append(closeButton);
        closeButton.append(closeButtonIcon);
        div.style.backgroundColor = backgroundColor;
        div.style.setProperty("--notification-boxshadow-color", backgroundColor);
        this.NotificationsContainer?.appendChild(div);
        return [div, body, closeButton];
    }
}
exports.default = Notifications;
/*
<div class="notification error">
    <div class="notification-title"><span class="material-symbols-outlined">error</span><span class="notification-title-text">ApiError</span></div>
    <p class="notification-body">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam</p>
</div>
*/ 
