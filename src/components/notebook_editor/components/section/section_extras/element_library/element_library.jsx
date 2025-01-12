import { useCallback } from 'react'
import s from './element_library.module.scss'
import { useContext } from 'react'
import { NotebookContext } from '../../../../utils/notebook_context'
import { generateUUID } from '../../../../utils/general'
import IconText from '../../../../assets/icons/type.svg?react'
import IconImage from '../../../../assets/icons/image.svg?react'
import IconBasicOp from '../../../../assets/icons/calculator.svg?react'
import IconTable from '../../../../assets/icons/table.svg?react'
import IconCircle from '../../../../assets/icons/circle.svg?react'
import IconTriangle from '../../../../assets/icons/triangle.svg?react'
import IconSquare from '../../../../assets/icons/square.svg?react'
import Text from '../../section_element/text/text_class'
import Image from '../../section_element/image/image_class'
import BasicOperationV from '../../section_element/basic_operation_v/basic_operation_v_class'
import FreeFormSVG from '../../section_element/free_form_svg_element/svg_class'
import { useEffect } from 'react'
import Calligraphy from '../../section_element/calligraphy/calligraphy_class'

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
        const newElementData = { id, type, x: SPAWN_POS_X, y: props.sData.height/2, width: 80, height: 40 }
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
        else if (["circle", "triangle", "square"].includes(type)) {
            newElement = new FreeFormSVG(newElementData)
            newElement.type = "free_form_svg"
            newElement.content = 
                type === "circle" ? <circle cx="20" cy="20" r="20" fill="red" /> :
                type === "triangle" ? <polygon points="20,0 40,40 0,40" fill="blue" /> :
                type === "square" ? <rect x="0" y="0" width="40" height="40" fill="green" /> : null
            newElement.viewBox = "0 0 40 40"
        }
        else if (type === "calligraphy") {
            newElement = new Calligraphy(newElementData)
            newElement.width = 430
            newElement.height = 80
        }


        dispatch({ type: "ADD_ELEMENT", payload: { section: props.sData.id, newElement } })

        props.setShowElementLibrary(false)
    }, [props.sData.id, props.dispatch])

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") props.setShowElementLibrary(false)
        }

        window.addEventListener("keydown", handleKeyDown)
        // Disable scrolling
        document.body.style.overflow = "hidden"
        document.body.style.touchAction = "none"
        document.body.style.paddingRight = "17px"

        return () => {
            document.body.style.overflow = "auto"
            document.body.style.touchAction = "auto"
            document.body.style.paddingRight = "0px"
            window.removeEventListener("keydown", handleKeyDown)
        }

    }, [])

    return (
        <div className={s.section_element_library_wrap} onClick={(e) => e.target.className === s.section_element_library_wrap && props.setShowElementLibrary(false)} onContextMenu={(e) => e.stopPropagation()}>
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
                    <h3>Shapes</h3>
                    <div className={s.element_section}>
                        <ElementCard type="circle" handleClick={handleAddElement} icon={IconCircle}>Circle</ElementCard>
                        <ElementCard type="triangle" handleClick={handleAddElement} icon={IconTriangle}>Triangle</ElementCard>
                        <ElementCard type="square" handleClick={handleAddElement} icon={IconSquare}>Square</ElementCard>
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
