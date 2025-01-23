import { useContext } from 'react'
import CONSTANTS from '../../../../utils/constants'
import s from './templates.module.scss'
import { NotebookContext } from '../../../../utils/notebook_context'
import { deepClone } from '../../../../utils/clone'
import { private2public } from '../../../../utils/general'
import { useEffect } from 'react'

export default function Templates(props) {

    const { dispatch } = useContext(NotebookContext)

    const handleUseTemplate = (id, sections) => {
        const newSection = deepClone(sections[id])
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
                <h3>Plantillas</h3>
            </div>
            <div className={s.menu_body}>
                <h3>General</h3>
                {
                    Object.values(CONSTANTS.TEMPLATES_EXERCISE_SECTIONS_GENERAL).map((section, index) => {
                        section = private2public(section)
                        return <TemplateCard key={index} index={index} handleUseTemplate={()=>handleUseTemplate(section.id, CONSTANTS.TEMPLATES_EXERCISE_SECTIONS_GENERAL)} icon={CONSTANTS.TEMPLATES_THUMBNAILS_GENERAL[section.id]} />
                    })
                }
                <h3>Matemáticas</h3>
                {
                    Object.values(CONSTANTS.TEMPLATES_EXERCISE_SECTIONS_MATH).map((section, index) => {
                        section = private2public(section)
                        return <TemplateCard key={index} index={index} handleUseTemplate={()=>handleUseTemplate(section.id, CONSTANTS.TEMPLATES_EXERCISE_SECTIONS_MATH)} icon={CONSTANTS.TEMPLATES_THUMBNAILS_MATH[section.id]} />
                    })
                }
                <h3>Lengua</h3>
                {
                    Object.values(CONSTANTS.TEMPLATES_EXERCISE_SECTIONS_LENGUA).map((section, index) => {
                        section = private2public(section)
                        return <TemplateCard key={index} index={index} handleUseTemplate={()=>handleUseTemplate(section.id, CONSTANTS.TEMPLATES_EXERCISE_SECTIONS_LENGUA)} icon={CONSTANTS.TEMPLATES_THUMBNAILS_LENGUA[section.id]} />
                    })
                }
            </div>
            <div className={s.templates_close}>
                <button onClick={() => props.setShowTemplates(false)}>Cerrar</button>
            </div>
        </div>
    </div>
}


function TemplateCard(props) {

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
