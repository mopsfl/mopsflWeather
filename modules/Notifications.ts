import Util from "./Util"

export default class Notifications {
    constructor(
        public NotificationTypes: { [key: string]: NotificationType } = {
            info: { backgroundColor: "#0084b7", attr: "info" },
            warn: { backgroundColor: "#ce6a00", attr: "warn" },
            error: { backgroundColor: "#b70000", attr: "error" },
        },
        public NotificationsContainer = document.querySelector(".notifications")
    ) { }

    private throwError(error: any, cause?: any) {
        throw new Error(`[Notifications]: ${error}`, { cause: cause })
    }

    private new(args: NotificationArguments) {
        if (!(args instanceof Object)) this.throwError(`invalid NotificationArguments.`, `argument being typeof ${typeof (args)}`)

        let [notification, notificationBody, closeButton] = this.CreateNotificationDiv(args)
        console.log(notificationBody);
        notification.addEventListener("click", (e) => {
            if (e.target !== notification) return
            notification.classList.toggle("notification-expand")
        }, false); closeButton.addEventListener("click", (e) => {
            notification.classList.add("notification-out")
            setTimeout(() => notification.remove(), 250);
        }, false)
    }

    public info(title: string | number, text: string) {
        return this.new({ title: title.toString(), bodyText: text, backgroundColor: this.NotificationTypes.info.backgroundColor, type: "info" })
    }

    public warn(title: string | number, text: string) {
        return this.new({ title: title.toString(), bodyText: text, backgroundColor: this.NotificationTypes.warn.backgroundColor, type: "warn" })
    }

    public error(title: string | number, text: string) {
        return this.new({ title: title.toString(), bodyText: text, backgroundColor: this.NotificationTypes.error.backgroundColor, type: "error" })
    }

    private CreateNotificationDiv(args: NotificationArguments) {
        if (!(args instanceof Object)) {
            this.throwError(`invalid NotificationArguments.`, `argument being typeof ${typeof args}`);
        }

        const { type = "info", title = "", bodyText = "" } = args;
        const { attr: attrName, backgroundColor } = this.NotificationTypes[type] || this.NotificationTypes["info"];

        const div = Util.CreateElementWithClass("div", "notification");
        const titleDiv = Util.CreateElementWithClass("div", "notification-title");
        const titleText = Util.CreateElementWithClass("span", "notification-title-text", title);
        const titleIcon = Util.CreateElementWithClass("span", "material-symbols-outlined", type === "warn" ? "warning" : type);
        const closeButton = Util.CreateElementWithClass("button", "notification-close");
        const closeButtonIcon = Util.CreateElementWithClass("span", "material-symbols-outlined", "close");
        const body = Util.CreateElementWithClass("div", "notification-body", bodyText);

        if (attrName) div.setAttribute("notification-type", attrName);

        titleDiv.append(titleIcon, titleText);
        div.append(titleDiv, body);
        titleDiv.append(closeButton)
        closeButton.append(closeButtonIcon)
        div.style.backgroundColor = backgroundColor;
        div.style.setProperty("--notification-boxshadow-color", backgroundColor);

        this.NotificationsContainer?.appendChild(div);
        return [div, body, closeButton];
    }

}

export interface NotificationArguments {
    title: string,
    bodyText: string,
    type: string,
    duration?: number,
    backgroundColor?: string,
}

interface NotificationType {
    backgroundColor: string;
    class?: string;
    attr?: string
}

/*
<div class="notification error">
    <div class="notification-title"><span class="material-symbols-outlined">error</span><span class="notification-title-text">ApiError</span></div>
    <p class="notification-body">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam</p>
</div>
*/