import { useEffect } from 'react'
import RichText from '../../../rich_text/rich_text'
import s from './text_element.module.scss'
import { useRef } from 'react'
import { useContext } from 'react'
import { NotebookContext } from '../../../../utils/notebook_context'


const FALLBACK_TEXT = "Click to edit text"

/**
 * ElementText component
 * 
 * @param {object} props
 * @param {string} props.id
 * @param {string} props.sectionId
 * @param {string} props.text
 * @returns JSX.Element
 */
export default function ElementText(props) {

    const { dispatch } = useContext(NotebookContext)
    const editablePath = `sections["${props.sectionId}"].elements["${props._id}"].text`
    const $p = useRef(null)

    useEffect(() => {
        if (props.sectionId === "preview") return

        let { width, height } = $p.current.children[0].getBoundingClientRect()
        height *= 1.2

        dispatch({ type: "EDIT_ELEMENT", payload: { sectionId: props.sectionId, elementId: props._id, elementData: { width, height } } })
    }, [])

    return (
        <div className={s.wrap}>
            <p data-editable="text" data-editable-path={editablePath} ref={$p}><RichText>{props._text || FALLBACK_TEXT}</RichText></p>
        </div>
    )
}
