import Shape from "./shape_class";

export default class Rectangle extends Shape {
    constructor(params) {
        super(params)
        if (!params) return

        // Set properties
        this._type ??= "rectangle"
    }

    // Methods
    clone() {
        const clone = new Rectangle()
        Object.assign(clone, this)
        return clone
    }
}