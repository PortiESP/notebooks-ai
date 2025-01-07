import Shape from "./shape_class";

export default class Circle extends Shape {
    constructor(params) {
        super(params)
        if (!params) return

        // Set properties
        this._type ??= "circle"
        this._radius = params.radius || 0
    }

    // Methods
    clone() {
        const clone = new Circle()
        Object.assign(clone, this)
        return clone
    }

    // Getters & Setters
    get radius() {
        return this._radius
    }
    set radius(value) {
        this._radius = value
    }
}