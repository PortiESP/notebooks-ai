import { generateUUID } from "../../../utils/general"

export default class Element {
    constructor(params) {
        if (!params) return
        // Abstract class: If instance is not a subclass of Element, throw an error
        if (this.constructor === Element) throw new TypeError(`Abstract class "Element" cannot be instantiated directly`)

        // Set properties
        this._id = params.id || generateUUID()
        this._x = params.x
        this._y = params.y
        this._width = params.width
        this._height = params.height
        this._type = params.type
        this._sectionId = params.sectionId
        this._style = params.style

        // Check for undefined values
        if (window.debug) {
            if (params.x === undefined) console.warn(`Element ${this._id} has x value undefined`)
            if (params.y === undefined) console.warn(`Element ${this._id} has y value undefined`)
            if (params.width === undefined) console.warn(`Element ${this._id} has width value undefined`)
            if (params.height === undefined) console.warn(`Element ${this._id} has height value undefined`)
        }
    }

    // Methods 
    clone() {
        throw new TypeError("Method `clone` must be implemented by subclass, and the constructor include the line `if (!params) return`")
    }

    // Getters & Setters
    get id() {
        return this._id
    }
    set id(value) {
        this._id = value
    }

    get x() {
        return this._x
    }
    set x(value) {
        this._x = value
    }

    get y() {
        return this._y
    }
    set y(value) {
        this._y = value
    }

    get width() {
        return this._width
    }
    set width(value) {
        this._width = value
    }

    get height() {
        return this._height
    }
    set height(value) {
        this._height = value
    }

    get type() {
        return this._type
    }
    set type(value) {
        this._type = value
    }

    get sectionId() {
        return this._sectionId
    }
    set sectionId(value) {
        this._sectionId = value
    }

    get style() {
        return this._style
    }
    set style(value) {
        this._style = value
    }

}