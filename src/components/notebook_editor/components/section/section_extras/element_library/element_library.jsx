import { useCallback } from 'react'
import s from './element_library.module.scss'
import { useContext } from 'react'
import { NotebookContext } from '../../../../utils/notebook_context'
import { generateUUID } from '../../../../utils/general'
import IconText from '../../../../assets/icons/type.svg?react'
import IconImage from '../../../../assets/icons/image.svg?react'
import IconBasicOp from '../../../../assets/icons/calculator.svg?react'
import IconTable from '../../../../assets/icons/table.svg?react'
import Text from '../../section_element/text/text_class'
import Image from '../../section_element/image/image_class'
import BasicOperationV from '../../section_element/basic_operation_v/basic_operation_v_class'

const SPAWN_POS_X = (210 - 20*2) * 0.25

export default function ElementLibrary(props) {

    const { dispatch } = useContext(NotebookContext)

    const handleAddElement = useCallback((e) => {
        const type = e.currentTarget.getAttribute("data-add-element-type")
        const id = generateUUID()

        if (!type) {
            console.error("Element type not found")
            return
        }

        // Create new element
        const newElementData = { id, type, x: SPAWN_POS_X, y: props.sData.height/2, width: 40, height: 40 }
        let newElement
        // Add default data based on element type
        if (type === "text") newElement = new Text(newElementData)
        else if (type === "image") newElement = new Image(newElementData)
        else if (type === "basic_operation_v") {
            newElement = new BasicOperationV(newElementData)
            newElement.operator = "+"
            newElement.operands = ["", ""]
            newElement.result = ""
        }


        dispatch({ type: "ADD_ELEMENT", payload: { section: props.sData.id, newElement } })

        props.setShowElementLibrary(false)
    }, [props.sData.id, props.dispatch])

    return (
        <div className={s.section_element_library_wrap}>
            <div className={s.section_element_library}>
                <div className={s.element_library_title}>
                    <h3>Element Library</h3>
                </div>
                <div className={s.element_library_content}>
                    <h3>Basic</h3>
                    <div className={s.element_section}>
                        <ElementCard type="text" handleClick={handleAddElement} icon={IconText}>Text</ElementCard>
                        <ElementCard type="image" handleClick={handleAddElement} icon={IconImage}>Image</ElementCard>
                        <ElementCard type="basic_operation_v" handleClick={handleAddElement} icon={IconBasicOp}>Basic Operation</ElementCard>
                        <ElementCard type="table" handleClick={handleAddElement} icon={IconTable}>Table</ElementCard>
                    </div>
                    <h3>Text</h3>
                    <div className={s.element_section}>
                        <ElementCard type="text" handleClick={handleAddElement} icon={IconText}>Text</ElementCard>
                        <ElementCard type="calligraphy" handleClick={handleAddElement} icon={IconText}>Calligraphy</ElementCard>
                    </div>
                    <h3>Math</h3>
                    <div className={s.element_section}>
                        <ElementCard type="basic_operation_v" handleClick={handleAddElement} icon={IconBasicOp}>Basic Operation</ElementCard>
                    </div>
                </div>
                <div className={s.element_library_close}>
                    <button onClick={() => props.setShowElementLibrary(false)}>Close</button>
                </div>
            </div>
        </div>
    )
}



function ElementCard({ type, handleClick, icon: Icon, children }) {

    return (
        <div className={s.element_card} onClick={handleClick} data-add-element-type={type}>
            <div className={s.element_card_icon}>
                <Icon />
            </div>
            <div className={s.element_card_title}>
                <h4>{children}</h4>
            </div>
        </div>
    )
}
