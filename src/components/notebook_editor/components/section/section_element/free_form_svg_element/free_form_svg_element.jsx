import s from "./free_form_svg_element.module.scss"
import React from "react"

export default function ElementFreeFormSVG(props) {

    const viewBox = props.viewBox
    let content = props._content

    // Create jsx from js object
    if (!content.$$typeof) {
        content = React.createElement(content.type, { key: "generated-form-data", ...content.props })
    }


    return (
        <>
            {
                props._content.type === "rect" ?
                    <div className={s.rect} /> :
                props._content.type === "line" ?
                    <div className={s.line} /> :
                    <svg xmlns="http://www.w3.org/2000/svg"
                        className={s.svg_wrap}
                        viewBox={viewBox}
                        width={props._width}
                        height={props._height}
                        preserveAspectRatio="xMidYMid meet"
                    >
                        {content}
                    </svg>
            }
        </>
    )
}
