import Section from "../section_class"

export default class Debug extends Section {
    constructor(params) {
        super(params)
        this._type ??= "debug"
    }

    // Methods
    clone() {
        return new Debug({
            id: this.id,
            type: this.type,
            height: this.height
        })
    }
}