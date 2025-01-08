import { useContext } from 'react'
import s from './sheet.module.scss'
import { NotebookContext } from './utils/notebook_context'
import Blank from './components/section/section_types/blank/blank_class'
import { generateUUID } from './utils/general'

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

    const handleAddSection = () => {
        const newSection = new Blank({ id: generateUUID(), type: "blank", title: "Empty section" })
        dispatch({ type: 'ADD_SECTION', payload: { section: newSection } })
    }

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
            {props.footerTitle && <div className={s.page_footer_title_wrap}><span data-editable="text" data-editable-path="footerTitle">{props.footerTitle}</span></div>}
        </div>
    </div>
}
