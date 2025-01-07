import { useState } from "react"
import s from "./resize_handles.module.scss"

/**
 * Resize handles component
 * 
 * @param {Object} props - Component props
 * @param {JSX.Element} props.children - Children components
 * @returns JSX.Element
 */
export default function ResizeHandles(props) {

    const [showTooltip, setShowTooltip] = useState(true)
    const width = Math.round(props.eData.width * 100) / 100
    const height = Math.round(props.eData.height * 100) / 100
    const x = Math.round(props.eData.x * 10) / 10
    const y = Math.round(props.eData.y * 10) / 10

    return (
        <div className={s.wrap} data-handler data-element-id={props.eData.id}>
            {props.children}
            {
                showTooltip && 
                <div className={s.tooltip_wrap} data-element-overlay="tooltip">
                    <span>{props.eData.type}</span>
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
    )
}
