import { useContext } from 'react'
import CONSTANTS from '../../../../utils/constants'
import s from './templates.module.scss'
import { NotebookContext } from '../../../../utils/notebook_context'
import { deepClone } from '../../../../utils/clone'
import { private2public } from '../../../../utils/general'
import { useEffect } from 'react'
import ImgTemplateThumb1 from '../../../../assets/images/templates/thumbnail_1.png'
import ImgTemplateThumb2 from '../../../../assets/images/templates/thumbnail_2.png'
import ImgTemplateThumb3 from '../../../../assets/images/templates/thumbnail_3.png'
import ImgTemplateThumb4 from '../../../../assets/images/templates/thumbnail_4.png'
import ImgTemplateThumb5 from '../../../../assets/images/templates/thumbnail_5.png'
import ImgTemplateThumb6 from '../../../../assets/images/templates/thumbnail_6.png'
const THUMBNAILS = [ImgTemplateThumb1, ImgTemplateThumb2, ImgTemplateThumb3, ImgTemplateThumb4, ImgTemplateThumb5, ImgTemplateThumb6]

export default function Templates(props) {

    const { dispatch } = useContext(NotebookContext)

    const handleUseTemplate = (index) => {
        const newSection = deepClone(CONSTANTS.TEMPLATES_EXERCISE_SECTIONS[index])
        newSection.id = props.sData.id
        dispatch({ type: "REPLACE_SECTION", payload: newSection })
        props.close()
    }

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") props.close()
        }
        window.addEventListener("keydown", handleKeyDown)
        // Disable scrolling
        document.body.style.overflow = "hidden"
        document.body.style.touchAction = "none"
        document.body.style.paddingRight = "17px"

        return () => {
            document.body.style.overflow = "auto"
            document.body.style.touchAction = "auto"
            document.body.style.paddingRight = "0px"
            window.removeEventListener("keydown", handleKeyDown)
        }
        
    }, [])

    return <div className={s.section_templates_wrap} onClick={(e) => e.target.className === s.section_templates_wrap && props.close()} onContextMenu={(e) => e.stopPropagation()}>
        <div className={s.section_templates_inner}>
            <div className={s.menu_title}>
                <h3>Templates</h3>
            </div>
            <div className={s.menu_body}>
                {
                    CONSTANTS.TEMPLATES_EXERCISE_SECTIONS.map((section, index) => {
                        section = private2public(section)
                        return <TemplateCard key={index} index={index} handleUseTemplate={handleUseTemplate} icon={THUMBNAILS[index]} />
                    })
                }
            </div>
            <div className={s.templates_close}>
                <button onClick={() => props.setShowTemplates(false)}>Close</button>
            </div>
        </div>
    </div>
}


function TemplateCard(props) {

    const rawText = CONSTANTS.TEMPLATES_EXERCISE_SECTIONS[props.index].title.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ')

    return (
        <div className={s.template_card_wrap} onClick={() => props.handleUseTemplate(props.index)}>
            <div className={s.template_card_inner}>
                <div className={s.template_card_icon}>
                    <img className={s.icon} src={props.icon}></img>
                </div>
            </div>
        </div>
    )
}
