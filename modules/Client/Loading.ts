import { Element } from "../Types/Element"
import { App } from "../Types/Global"

export default {
    Toggle(element: Element, state: boolean) {
        state == true ? element.removeClass("hide") : element.addClass("hide")
    }
}