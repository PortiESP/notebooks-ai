import s from './basic_operation_v.module.scss'


const FALLBACK_RESULT = ""
const FALLBACK_OPERANDS = ["", ""]
const FALLBACK_OPERATOR = "+"

export default function ElementBasicOperationV(props) {

    const operator = props._operator === "*" ? "×"
        : props._operator === "/" ? "÷"
        : props._operator === undefined ? FALLBACK_OPERATOR 
        : props._operator
    const operands = props._operands || FALLBACK_OPERANDS
    const result = props._result || FALLBACK_RESULT

    const PATH_OPTR = `sections["${props.sectionId}"].elements["${props._id}"].operator`
    const PATH_OPND = `sections["${props.sectionId}"].elements["${props._id}"].operands`
    const PATH_RES  = `sections["${props.sectionId}"].elements["${props._id}"].result`

    return (
        <div className={s.wrap}>
            <div className={s.op_top}>
                <div className={s.operator_wrap}>
                    <span className={s.operator} data-editable="text-raw" data-editable-path={PATH_OPTR}>{operator}</span>
                </div>
                <div className={s.operands_wrap}>
                    {
                        operands.map((operand, index) => {
                            const PATH = PATH_OPND + `[${index}]`
                            return <span
                                key={index}
                                className={[s.operand, !operand ? s.gap_box : ""].join(" ")}
                                data-editable="text-raw"
                                data-editable-path={PATH}
                            >{operand}</span>
                        })
                    }
                </div>
            </div>
            <span className={s.divider}></span>
            <div className={s.op_bottom}>
                <span className={[s.result, !result ? s.gap_box : ""].join(" ")} data-editable="text-raw" data-editable-path={PATH_RES}>{result}</span>
            </div>
        </div>
    )
}
