import Shape from "./shape_class";

export default class Triangle extends Shape {
    constructor(params) {
        super(params)
        if (!params) return

        // Set properties
        this._type ??= "triangle"
    }

    // Methods
    clone() {
        const clone = new Triangle()
        Object.assign(clone, this)
        return clone
    }

}