import { useEffect } from 'react'
import RichText from '../../../rich_text/rich_text'
import s from './text_element.module.scss'
import { useRef } from 'react'
import { useContext } from 'react'
import { NotebookContext } from '../../../../utils/notebook_context'
import { useState } from 'react'


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

    const { state } = useContext(NotebookContext)
    const [style, setStyle] = useState({})

    useEffect(() => {
        if (props.sectionId.includes("preview")) return
        const stl = state.sections[props.sectionId].elements[props._id].style
        console.log("Setting style", stl)
        setStyle(stl)
    }, [state.sections[props.sectionId]?.elements[props._id]?.style])


    const editablePath = `sections["${props.sectionId}"].elements["${props._id}"].text`
    const $p = useRef(null)

    return (
        <div className={s.wrap} style={style}>
            <p data-editable="text" data-editable-path={editablePath} data-eid={props._id} data-sid={props.sectionId} ref={$p}><RichText>{props._text || FALLBACK_TEXT}</RichText></p>
        </div>
    )
}
