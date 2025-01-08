import { useContext } from 'react'
import s from './calligraphy.module.scss'
import { NotebookContext } from '../../../../utils/notebook_context'
import { useRef } from 'react'
import { useEffect } from 'react'

const DEFAULT_FONT = "scholar-dots"
const DEFAULT_FONT_SIZE = 32
const FALLBACK_TEXT = "Lorem ipsum dolor sit amet, consectetur adipiscing elit."

export default function ElementCalligraphy(props) {

    const { dispatch } = useContext(NotebookContext)
    const $p = useRef(null)

    const style = {
        fontFamily: props._font === "stroke" ? "scholar" : DEFAULT_FONT,
        fontSize: props._size || DEFAULT_FONT_SIZE,
    }

    const editablePath = `sections["${props.sectionId}"].elements["${props._id}"].text`

    useEffect(() => {
        let { width, height } = $p.current.getBoundingClientRect()

        dispatch({ type: "EDIT_ELEMENT", payload: { sectionId: props.sectionId, elementId: props._id, elementData: { width, height } } })
    }, [])

    return (
        <div className={s.wrap}>
            <p data-editable="text-raw" data-editable-path={editablePath} className={s.text} style={style} ref={$p}>{props._text || FALLBACK_TEXT}</p>
        </div>
    )
}
