import Element from "../element_class.js"

export default class Text extends Element {
    constructor(params) {
        super(params)
        if (!params) return

        this._type ??= "text"
        this._text = params.text

        if (window.debug) {
            if (params.text === undefined) console.warn(`Text ${this._id} has text value undefined`)
        }
    }

    // Methods
    clone() {
        const clone = new Text()
        Object.assign(clone, this)
        return clone
    }

    // Getters & Setters
    get text() {
        return this._text
    }
    set text(value) {
        this._text = value
    }
}