import { Fragment } from 'react'
import s from './blank.module.scss'
import parseElementDataToJSX from './parseElementDataToJSX'
import { useContext } from 'react'
import { NotebookContext } from '../../../../utils/notebook_context'
import Section from '../section_class'


/**
 * Blank section component
 * 
 * @param {Object} props - Component props
 * @param {Section} props.sData - Section data { id, type, height, title, elements }
 * @returns JSX.Element
 */
export default function SectionTypeBlank(props) {

    const { dispatch } = useContext(NotebookContext)

    return (
        <div className={s.wrap}>
            {
                Object.values(props.sData.elements || [])?.map((eData, i) => <Fragment key={i}>{parseElementDataToJSX(eData, dispatch, props.sData.id)}</Fragment>)
            }
        </div>
    )
}
