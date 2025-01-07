import { useContext } from 'react'
import constants from '../../../../utils/constants'
import s from './templates.module.scss'
import { NotebookContext } from '../../../../utils/notebook_context'
import { deepClone } from '../../../../utils/clone'

export default function Templates(props) {

    const { dispatch } = useContext(NotebookContext)

    const handleUseTemplate = (index) => {
        const section = deepClone(constants.TEMPLATES_EXERCISE_SECTIONS[index])
        section.id = props.sData.id
        dispatch({ type: "REPLACE_SECTION", payload: section })
        props.close()
    }

    return <div className={s.section_templates_wrap}>
        <div className={s.section_templates_inner}>
            <div className={s.menu_title}>
                <h3>Templates</h3>
            </div>
            <div className={s.menu_body}>
                {
                    constants.TEMPLATES_EXERCISE_SECTIONS.map((section, index) => {
                        return <div key={index} className={s.template_card} onClick={() => handleUseTemplate(index)}>
                            <h4>{section.title}</h4>
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
