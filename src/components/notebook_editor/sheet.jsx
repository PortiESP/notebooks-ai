import s from './sheet.module.scss'

/**
 * Sheet component
 * 
 * @param {Object} props
 * @param {String} props.pageNumber Page number or ID
 * @param {String} props.footerTitle Footer title
 * @param {ReactNode} props.children Child components
 */
export default function Sheet(props) {
    return <div className={s.wrap}>
        <div className={s.sheet} data-element="sheet">
            <div className={s.sheet_inner_margins} data-element="sheet-inner-margins">
                {props.children}
            </div>
            <div className={s.page_number_wrap}><span>{props.pageNumber}</span></div>
            {props.footerTitle && <div className={s.page_footer_title_wrap}><span data-editable="text" data-editable-path="footerTitle">{props.footerTitle}</span></div>}
        </div>
    </div>
}
