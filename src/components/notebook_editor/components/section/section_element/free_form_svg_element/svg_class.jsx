import Element from "../element_class"
import { Fragment } from "react"

export default class FreeFormSVG extends Element {
    constructor(params) {
        super(params)
        if (!params) return

        this._type ??= "free_form_svg"
        this._content = (typeof params.content === 'string')
            ? <g dangerouslySetInnerHTML={{ __html: params.content }} />
            : params.content

        if (window.debug) {
            if (params.content === undefined) console.warn(`SVGElement ${this._id} has content value undefined`)
        }
    }

    // Methods
    clone() {
        const clone = new FreeFormSVG()
        Object.assign(clone, this)
        return clone
    }

    // Getters & Setters
    get content() {
        return this._content
    }
    set content(value) {
        this._content = value
    }
}