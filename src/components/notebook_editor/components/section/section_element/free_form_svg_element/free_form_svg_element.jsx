import s from "./free_form_svg_element.module.scss"

export default function ElementFreeFormSVG(props) {

    const viewBox = props._viewBox
    const content = props._content

    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={s.svg_wrap} viewBox={viewBox}>
            {content}
        </svg>
    )
}
