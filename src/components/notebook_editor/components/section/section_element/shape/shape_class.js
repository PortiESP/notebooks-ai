import Element from '../element_class.js'

export default class Shape extends Element {
    constructor(params) {
        super(params)
        if (!params) return

        // Set properties
        this._fill = params.fill
        this._stroke = params.stroke

        
        if (window.debug) {
            if (params.fill === undefined) console.warn(`Shape ${this._id} has fill value undefined`)
            if (params.stroke === undefined) console.warn(`Shape ${this._id} has stroke value undefined`)
        }
    }

    // Getters & Setters
    get fill() {
        return this._fill
    }
    set fill(value) {
        this._fill = value
    }

    get stroke() {
        return this._stroke
    }
    set stroke(value) {
        this._stroke = value
    }
}