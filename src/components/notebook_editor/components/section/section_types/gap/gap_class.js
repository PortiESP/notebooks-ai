import Section from "../section_class"

export const DEFAULT_GAP_HEIGHT = 50

export default class Gap extends Section {
    constructor(params) {
        super(params)
        this._type ??= "gap"
        this._height ??= DEFAULT_GAP_HEIGHT
    }

    // Methods
    clone() {
        return new Gap({
            id: this.id,
            type: this.type,
            height: this.height
        })
    }
}