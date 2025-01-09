import { useContext } from 'react'
import s from './gap.module.scss'
import { NotebookContext } from '../../../../utils/notebook_context'
import { generateUUID } from '../../../../utils/general'
import Blank from '../blank/blank_class'
import Section from '../section_class'


/**
 * Gap component
 * @param {Object} props
 * @param {Section} props.sData - Section data
 * @returns JSX.Element
 */
export default function Gap(props) {

  const { dispatch } = useContext(NotebookContext)

  const handleAddSection = () => {
    const newSection = new Blank({ id: generateUUID(), type: "blank", title: "Empty section" })
    dispatch({ type: 'ADD_SECTION', payload: {section: newSection, after: props.sData.id, addGap: "after" } })
  }

  return (
      <div className={s.wrap}>
        <div className={s.add_section_wrap} onClick={handleAddSection}>
          <div className={s.add_section}>
            <div className={s.add_section_label}>Add section</div>
          </div>
        </div>
      </div>
  )
}
