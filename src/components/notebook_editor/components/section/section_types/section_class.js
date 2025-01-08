import CONSTANTS from "../../../utils/constants"
import { generateUUID } from "../../../utils/general"

export const DEFAULT_SECTION_HEIGHT = 150


export default class Section {
    constructor(params) {
        // Abstract class
        if (new.target === Section) throw new TypeError("Cannot construct Abstract instances directly")

        // Properties
        this._id = params.id || generateUUID()
        this._type = params.type
        this._height = params.height || DEFAULT_SECTION_HEIGHT
    }

    // Methods
    // Abstract methods
    clone() {
        throw new TypeError("Method 'clone()' must be implemented from a child class")
    }

    // Getters & Setters
    get id() {
        return this._id
    }
    set id(id) {
        this._id = id
    }

    get type() {
        return this._type
    }
    set type(type) {
        this._type = type
    }

    get height() {
        return this._height
    }
    set height(height) {
        this._height = height
    }
}