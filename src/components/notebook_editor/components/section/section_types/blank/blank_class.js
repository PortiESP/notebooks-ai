import Section from "../section_class"

export default class Blank extends Section {
    constructor(params) {
        super(params)
        this._type ??= "blank"
        this._title = params.title
        this._elements = params.elements || {}
    }

    // Methods
    clone() {
        return new Blank({
            id: this.id,
            type: this.type,
            height: this.height,
            title: this.title,
            elements: Object.values(this.elements).reduce((acc, element) => {
                acc[element.id] = element.clone()
                return acc
            }, {})
        })
    }

    // Getters & Setters
    get title() {
        return this._title
    }
    set title(title) {
        this._title = title
    }

    get elements() {
        return this._elements
    }
    set elements(elements) {
        this._elements = elements
    }
}