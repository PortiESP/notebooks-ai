import { useState } from "react"
import s from "./resize_handles.module.scss"
import { useEffect } from "react"
import { useContext } from "react"
import { NotebookContext } from "../../../../utils/notebook_context"
import UserInput from "../../../../utils/user-input"
import { Rnd } from "react-rnd"
import CONSTANTS from "../../../../utils/constants"
import { use } from "react"

const START_DRAG_CONDITION = { offsetX: 0, offsetY: 0, sX: 0, sY: 0 }


function snapToGrid(value) {
    return Math.round(value / CONSTANTS.GRID_SIZE) * CONSTANTS.GRID_SIZE
}
/**
 * Resize handles component
 * 
 * @param {Object} props - Component props
 * @param {JSX.Element} props.children - Children components
 * @returns JSX.Element
 */
export default function ResizeHandles({eData, sectionId, ...props}) {

    const { dispatch } = useContext(NotebookContext)
    const [pos, setPos] = useState({ x: eData.x, y: eData.y })
    const [isShifting, setIsShifting] = useState(false)
    const [showTooltip, setShowTooltip] = useState(true)
    const width = Math.round(eData.width * 100) / 100
    const height = Math.round(eData.height * 100) / 100
    const x = Math.round(eData.x * 10) / 10
    const y = Math.round(eData.y * 10) / 10

    useEffect(() => {
        if (isShifting) return
        setPos({ x: eData.x, y: eData.y })
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

    useEffect(() => {
        if (isShifting){
            setPos({ x: snapToGrid(pos.x), y: snapToGrid(pos.y) })
        }
    }, [isShifting])

    

    useEffect(() => {
        if (!eData.firstPlacement) return
        const disableMoving = () => {
            dispatch({ type: "EDIT_ELEMENT", payload: { elementId: eData.id, sectionId, elementData: { firstPlacement: false } } })
        }
        const $section = document.querySelector(`[data-section-id="${sectionId}"] [data-element="section"]`)
        if (!$section) return { x: 0, y: 0 }
        const { x: sectionX, y: sectionY } = $section.getBoundingClientRect()
        const calcRelativePos = () => {
            const { x, y } = UserInput
            const relX = x - sectionX
            const relY = y - sectionY
            return { x: relX, y: relY }
        }
        const updatePos = () => {
            const {x, y} = calcRelativePos()
            setPos({x: x-width/2, y: y-height/2 })
        }

        $section.addEventListener("mousemove", updatePos) 
        $section.addEventListener("mousedown", disableMoving)
        return () => {
            $section.removeEventListener("mousemove", updatePos)
            $section.removeEventListener("mousedown", disableMoving)
        }
    }, [eData.firstPlacement])

    return (<Rnd
        key={eData.id}
        size={{ width: eData.width, height: eData.height }}
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
            const { sX: sectionX, sY: sectionY } = START_DRAG_CONDITION  // Section position
            const { clientX, clientY } = e  // Mouse position
            let x = clientX - sectionX - START_DRAG_CONDITION.offsetX  // Element's new x position (relative to section)
            let y = clientY - sectionY - START_DRAG_CONDITION.offsetY  // Element's new y position (relative to section)
            
            if (isShifting) {
                x = snapToGrid(x)
                y = snapToGrid(y)
            }
    
            setPos({ x, y })
        }}
        onDragStop={(e, d) => {
            const { x, y } = d
            dispatch({ type: "EDIT_ELEMENT", payload: { elementId: eData.id, sectionId, elementData: { x, y } } })
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
            const { width, height } = ref.style
            const { x, y } = position
            dispatch({ type: "EDIT_ELEMENT", payload: { elementId: eData.id, sectionId, elementData: { width: parseInt(width), height: parseInt(height), x, y } } })
        }}
        data-handler-for={eData.id}
        dragGrid={isShifting ? [CONSTANTS.GRID_SIZE, CONSTANTS.GRID_SIZE] : [1, 1]}
        resizeGrid={isShifting ? [CONSTANTS.GRID_SIZE, CONSTANTS.GRID_SIZE] : [1, 1]}
    >
        <div className={s.wrap} data-handler data-element-id={eData.id}>
            {props.children}
            {
                showTooltip &&
                <div className={s.tooltip_wrap} data-element-overlay="tooltip">
                    <span>{eData.type}</span>
                    <span>[{x},{y}]</span>
                    <span>{width}x{height}</span>
                </div>
            }
            {/* This handlers hover event are styled in the section stylesheet */}
            <div className={s.handle} data-handler-pos="TL"></div>
            <div className={s.handle} data-handler-pos="TC"></div>
            <div className={s.handle} data-handler-pos="TR"></div>
            <div className={s.handle} data-handler-pos="CL"></div>
            <div className={s.handle} data-handler-pos="CR"></div>
            <div className={s.handle} data-handler-pos="BL"></div>
            <div className={s.handle} data-handler-pos="BC"></div>
            <div className={s.handle} data-handler-pos="BR"></div>
        </div>
    </Rnd>
    )
}
