import Element from '../element_class.js'

export default class Image extends Element {
    constructor(params) {
        super(params)
        if (!params) return

        // Set properties
        this._type ??= "image"
        this._src = params.src
        
        if (window.debug) {
            if (params.src === undefined) console.warn(`Image ${this._id} has src value undefined`)
        }
    }

    // Methods
    clone() {
        const clone = new Image()
        Object.assign(clone, this)
        return clone
    }

    // Getters & Setters
    get src() {
        return this._src
    }
    set src(value) {
        this._src = value
    }
}