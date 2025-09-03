import { NotificationArguments, NotificationType } from "../Types/Notification";
import Util from "./Util";

export default class Notifications {
    constructor(
        public NotificationTypes: Record<string, NotificationType> = {
            notify: { backgroundColor: "#272727", attr: "notify" },
            info: { backgroundColor: "#0084b7", attr: "info" },
            warn: { backgroundColor: "#ce6a00", attr: "warn" },
            error: { backgroundColor: "#b70000", attr: "error" },
        },
        public NotificationsContainer = document.querySelector(".notifications")
    ) { }

    public create(type: keyof Notifications["NotificationTypes"], title: string | number, text: string, html?: boolean) {
        if (!this.NotificationTypes[type]) {
            this.throwError(`Unknown notification type: ${type}`);
        }

        const { backgroundColor, attr: attrName } = this.NotificationTypes[type];
        const div = Util.CreateElementWithClass("div", "notification");
        const titleDiv = Util.CreateElementWithClass("div", "notification-title");
        const titleText = Util.CreateElementWithClass("span", "notification-title-text", title.toString());
        const titleIcon = Util.CreateElementWithClass(
            "span",
            "material-symbols-outlined",
            type === "warn" ? "warning" : type === "notify" ? "info" : type
        );
        const closeButton = Util.CreateElementWithClass("button", "close-button");
        const closeButtonIcon = Util.CreateElementWithClass("span", "material-symbols-outlined", "close");
        const body = Util.CreateElementWithClass("div", "notification-body", text, html);

        if (attrName) div.setAttribute("notification-type", attrName);

        titleDiv.append(titleIcon, titleText, closeButton);
        closeButton.append(closeButtonIcon);
        div.append(titleDiv, body);

        div.style.backgroundColor = backgroundColor;
        div.style.setProperty("--notification-boxshadow-color", backgroundColor);

        this.NotificationsContainer?.appendChild(div);

        div.addEventListener("click", (e) => {
            if (e.target === div) div.classList.toggle("notification-expand");
        });

        closeButton.addEventListener("click", () => {
            div.classList.add("notification-out");
            setTimeout(() => div.remove(), 250);
        });

        return div;
    }

    private throwError(error: any, cause?: any) { throw new Error(`[Notifications]: ${error}`, { cause }) }
    public info(title: string | number, text: string, html?: boolean) { return this.create("info", title, text, html) }
    public warn(title: string | number, text: string, html?: boolean) { return this.create("warn", title, text, html) }
    public error(title: string | number, text: string, html?: boolean) { return this.create("error", title, text, html) }
    public notify(title: string | number, text: string, html?: boolean) { return this.create("notify", title, text, html) }
}
