import s from './section_aside.module.scss'
import IconComponent from '../../../../assets/icons/component.svg?react'
import IconBook from '../../../../assets/icons/book.svg?react'
import IconTrash from '../../../../assets/icons/trash.svg?react'

export default function SectionAside(props) {

    const { setShowAI, setShowTemplates, setShowElementLibrary, sData: { id: sectionId } } = props

    return <div className={s.section_aside} data-element-type="section-aside">
        <div className={s.section_aside_toolbar}>
            {
                props.sData.type !== "gap" && <>
                    <button className={s.toolbar_button} onClick={() => setShowElementLibrary(true)}><IconComponent /></button>
                    <button className={s.toolbar_button} onClick={() => setShowTemplates(true)}><IconBook /></button>
                    <button className={s.toolbar_button} onClick={() => setShowAI(old => !old)}>AI</button>
                </>
            }
            <button className={s.toolbar_button} onClick={() => dispatch({ type: "REMOVE_SECTION", payload: { id: sectionId } })}><IconTrash /></button>
        </div>
    </div>
}
