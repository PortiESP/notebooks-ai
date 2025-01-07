import Element from "../element_class"

export default class BasicOperationV extends Element {
    constructor(params) {
        super(params)
        if (!params) return

        // Set properties
        this._type ??= "basic_operation_v"
        this._operator = params.operator
        this._operands = params.operands
        this._result = params.result

        // Check for undefined values
        if (window.debug) {
            if (params.operator === undefined) console.error(`Element ${this._id} has operator value undefined`)
            if (params.operands === undefined) console.error(`Element ${this._id} has operands value undefined`)
            if (params.result === undefined) console.error(`Element ${this._id} has result value undefined`)
        }
    }

    // Methods
    clone() {
        const clone = new BasicOperationV()
        Object.assign(clone, this)
        return clone
    }

    // Getters & Setters
    get operator() {
        return this._operator
    }
    set operator(value) {
        this._operator = value
    }

    get operands() {
        return this._operands
    }
    set operands(value) {
        this._operands = value
    }

    get result() {
        return this._result
    }
    set result(value) {
        this._result = value
    }
}