import s from './image_element.module.scss'

const FALLBACK_IMAGE = "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png"

/**
 * ElementText component
 * 
 * @param {object} props
 * @param {string} props.id
 * @param {string} props.sectionId
 * @param {string} props.src
 * @returns JSX.Element
 */
export default function ElementImage(props) {

    const editablePath = `sections["${props.sectionId}"].elements["${props._id}"].src`

    return (
        <div className={s.wrap} data-editable="image" data-editable-path={editablePath}>
            <img src={props._src || FALLBACK_IMAGE} alt="Image Element" />
        </div>
    )
}
