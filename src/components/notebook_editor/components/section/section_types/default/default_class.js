import Section from "../section_class"

export default class Default extends Section {
    constructor(params) {
        super(params)
        this._type ??= "default"
    }

    // Methods
    clone() {
        return new Default({
            id: this.id,
            type: this.type,
            height: this.height
        })
    }
}