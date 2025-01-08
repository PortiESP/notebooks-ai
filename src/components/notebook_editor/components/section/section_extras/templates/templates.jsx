import { useContext } from 'react'
import CONSTANTS from '../../../../utils/constants'
import s from './templates.module.scss'
import { NotebookContext } from '../../../../utils/notebook_context'
import { deepClone } from '../../../../utils/clone'
import { private2public } from '../../../../utils/general'

export default function Templates(props) {

    const { dispatch } = useContext(NotebookContext)

    const handleUseTemplate = (index) => {
        const newSection = deepClone(CONSTANTS.TEMPLATES_EXERCISE_SECTIONS[index])
        newSection.id = props.sData.id
        dispatch({ type: "REPLACE_SECTION", payload: newSection })
        props.close()
    }

    return <div className={s.section_templates_wrap}>
        <div className={s.section_templates_inner}>
            <div className={s.menu_title}>
                <h3>Templates</h3>
            </div>
            <div className={s.menu_body}>
                {
                    CONSTANTS.TEMPLATES_EXERCISE_SECTIONS.map((section, index) => {
                        section = private2public(section)
                        return <div key={index} className={s.template_card} onClick={() => handleUseTemplate(index)}>
                            <h4 dangerouslySetInnerHTML={{__html: section.title}}/>
                        </div>
                    })
                }
            </div>
            <div className={s.templates_close}>
                <button onClick={() => props.setShowTemplates(false)}>Close</button>
            </div>
        </div>
    </div>
}
