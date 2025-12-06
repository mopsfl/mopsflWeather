import { Element } from "../Types/Element"

export default {
    Toggle(element: Element, state: boolean) {
        state == true ? element.removeClass("hide") : element.addClass("hide")
    }
}