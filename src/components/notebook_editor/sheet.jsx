import { useContext } from 'react'
import s from './sheet.module.scss'
import { NotebookContext } from './utils/notebook_context'
import Blank from './components/section/section_types/blank/blank_class'
import { generateUUID } from './utils/general'
import RichText from './components/rich_text/rich_text'
import { useCallback } from 'react'

/**
 * Sheet component
 * 
 * @param {Object} props
 * @param {String} props.pageNumber Page number or ID
 * @param {String} props.footerTitle Footer title
 * @param {ReactNode} props.children Child components
 */
export default function Sheet(props) {

    const { dispatch } = useContext(NotebookContext)

    const handleAddSection = useCallback(() => {
        const newSection = new Blank({ id: generateUUID(), type: "blank", title: "Empty section" })
        const lastSectionID = [...props.sectionsThisPage].pop()
        dispatch({ type: 'ADD_SECTION', payload: { section: newSection, after: lastSectionID, addGap: "before" } })
    }, [dispatch, props.sectionsThisPage])

    return <div className={s.wrap}>
        <div className={s.sheet} data-element="sheet">
            <div className={s.sheet_inner_margins} data-element="sheet-inner-margins">
                {props.children}
                <div className={s.fake_gap} onClick={handleAddSection}>
                    <div className={s.add_section}>
                        <div className={s.add_section_label}>Add section</div>
                    </div>
                </div>
            </div>
            <div className={s.page_number_wrap}><span>{props.pageNumber}</span></div>
            {props.footerTitle && <div className={s.page_footer_title_wrap}><span data-editable="text" data-editable-path="footerTitle"><RichText>{props.footerTitle}</RichText></span></div>}
        </div>
    </div>
}
