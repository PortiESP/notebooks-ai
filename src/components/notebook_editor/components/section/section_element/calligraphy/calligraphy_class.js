import Element from "../element_class.js"

export default class Calligraphy extends Element {
    constructor(params) {
        super(params)
        if (!params) return
        
        // Set properties
        this._type ??= "calligraphy"
        this._text = params.text
        this._font = params.font
        this._size = params.size

        // Check for undefined values
        if (window.debug) {
            if (params.text === undefined) console.warn(`Element ${this._id} has text value undefined`)
            if (params.font === undefined) console.warn(`Element ${this._id} has font value undefined`)
            if (params.size === undefined) console.warn(`Element ${this._id} has size value undefined`)
        }
    }

    // Methods
    clone() {
        const clone = new Calligraphy()
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

    get font() {
        return this._font
    }
    set font(value) {
        this._font = value
    }

    get size() {
        return this._size
    }
    set size(value) {
        this._size = value
    }
}