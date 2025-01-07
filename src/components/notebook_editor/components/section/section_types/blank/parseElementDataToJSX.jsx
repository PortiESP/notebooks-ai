import { Rnd } from "react-rnd"
import ElementText from "../../section_element/text/text_element"
import ResizeHandles from "./resize_handles"
import ElementImage from "../../section_element/image/image_element"
import ElementCalligraphy from "../../section_element/calligraphy/calligraphy"
import ElementBasicOperationV from "../../section_element/basic_operation_v/basic_operation_v"
import ElementFreeFormSVG from "../../section_element/free_form_svg_element/free_form_svg_element"
import constants from "../../../../utils/constants"
import { checkKey } from "../../../../utils/shortcuts"
import { useState } from "react"
import { useEffect } from "react"
import UserInput from "../../../../utils/user-input"

const MM_TO_PIX = 3.77953
const START_DRAG_CONDITION = { offsetX: 0, offsetY: 0, sX: 0, sY: 0 }

function snapToGrid(value) {
    return Math.round(value / constants.GRID_SIZE) * constants.GRID_SIZE
}

/**
 * Parses element data to JSX
 * 
 * @param {Object} eData - Element data { id, type, x, y, width, height, text }
 * @param {Function} dispatch - Dispatch function
 * @param {String} sectionId - Section id
 * @returns JSX.Element
 */
export default function useParseElementDataToJSX(eData, dispatch, sectionId) {
    // Get element type
    const { type } = eData
    const [pos, setPos] = useState({ x: eData.x * MM_TO_PIX, y: eData.y * MM_TO_PIX })
    const [isShifting, setIsShifting] = useState(false)
    // Get element component
    const Element =
        type === "text" ? ElementText :
            type === "image" ? ElementImage :
                type === "calligraphy" ? ElementCalligraphy :
                    type === "basic_operation_v" ? ElementBasicOperationV :
                        type === "free_form_svg" ? ElementFreeFormSVG :
                            null

    // Check if element type not found
    if (!Element) {
        console.error("Element type not found:", type)
        return null
    }

    useEffect(() => {
        if (UserInput.isDragging) return
        setPos({ x: eData.x * MM_TO_PIX, y: eData.y * MM_TO_PIX })
    }, [eData.x, eData.y])

    useEffect(() => {
        const handleKeyDown = () => setIsShifting(true)
        const handleKeyUp = () => setIsShifting(false)
        
        UserInput.addOnKeyDown("ShiftLeft", handleKeyDown)
        UserInput.addOnKeyUp("ShiftLeft", handleKeyUp)

        return () => {
            UserInput.removeOnKeyDown("ShiftLeft")
            UserInput.removeOnKeyUp("ShiftLeft")
        }
    }, [])

    console.log("isShifting", isShifting)

    // Return element JSX wrapped in Rnd component (draggable and resizable)
    return <Rnd
        key={eData.id}
        size={{ width: eData.width * MM_TO_PIX, height: eData.height * MM_TO_PIX }}
        position={pos}
        onDragStart={(e, d) => {
            const { clientX, clientY } = e
            const { x: eX, y: eY } = e.target.closest(`[data-handler-for="${eData.id}"]`).getBoundingClientRect()
            const x = clientX - eX
            const y = clientY - eY
            START_DRAG_CONDITION.offsetX = x
            START_DRAG_CONDITION.offsetY = y

            const $section = d.node.closest("[data-element='section']")
            const { x: sectionX, y: sectionY } = $section.getBoundingClientRect()
            START_DRAG_CONDITION.sX = sectionX
            START_DRAG_CONDITION.sY = sectionY
        }}
        onDrag={(e, d) => {
            setPos({ x: d.x, y: d.y })
            const { sX: sectionX, sY: sectionY } = START_DRAG_CONDITION  // Section position
            const { clientX, clientY } = e  // Mouse position
            let x = clientX - sectionX - START_DRAG_CONDITION.offsetX  // Element's new x position (relative to section)
            let y = clientY - sectionY - START_DRAG_CONDITION.offsetY  // Element's new y position (relative to section)

            if (checkKey("shift")) {
                x = snapToGrid(x)
                y = snapToGrid(y)
            }

            dispatch({ type: "EDIT_ELEMENT", payload: { elementId: eData.id, sectionId, elementData: { x: x / MM_TO_PIX, y: y / MM_TO_PIX } } })
        }}
        onResize={(e, direction, ref, delta, position) => {
            const { width, height } = ref.style
            const { x, y } = position
            dispatch({ type: "EDIT_ELEMENT", payload: { elementId: eData.id, sectionId, elementData: { width: parseInt(width) / MM_TO_PIX, height: parseInt(height) / MM_TO_PIX, x: x / MM_TO_PIX, y: y / MM_TO_PIX } } })
        }}
        data-handler-for={eData.id}
        dragGrid={isShifting ? [constants.GRID_SIZE, constants.GRID_SIZE]: [1,1]}
        resizeGrid={isShifting ? [constants.GRID_SIZE, constants.GRID_SIZE]: [1,1]}
    >
        <ResizeHandles elementId={eData.id} eData={eData}>
            <Element {...eData} sectionId={sectionId} />
        </ResizeHandles>
    </Rnd>
}