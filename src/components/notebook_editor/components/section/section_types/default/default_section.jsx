import { useContext } from 'react'
import s from './default_section.module.scss'
import { NotebookContext } from '../../../../utils/notebook_context'
import Blank from '../blank/blank_class'


/**
 * Default section component
 * 
 * @param {Object} props - Component props
 * @param {Object} props.sData - Section data { id, type, height, title, elements }
 * @returns JSX.Element
 */
export default function SectionTypeDefault(props) {

    const { dispatch } = useContext(NotebookContext)

    // Replace section by a blank section
    const handleDoubleClick = () => {
        dispatch({ type: "REPLACE_SECTION", payload: new Blank({ id: props.sData.id, type: "blank", title: "Empty section" }) })
    }

    return (
        <div className={s.wrap} onDoubleClick={handleDoubleClick}>
            <h3>Default Section</h3>
            <span>Choose a template or Double-Click to replace by an empty section</span>
        </div>
    )
}
