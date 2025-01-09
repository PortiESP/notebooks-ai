import s from "./free_form_svg_element.module.scss"

export default function ElementFreeFormSVG(props) {

    const viewBox = props.viewBox
    const content = props._content

    console.log(props)

    return (
        <svg xmlns="http://www.w3.org/2000/svg"
            className={s.svg_wrap} 
            viewBox={viewBox} 
            width={props._width} 
            height={props._height}
            preserveAspectRatio="xMidYMid meet"
        >
            {content}
        </svg>
    )
}
