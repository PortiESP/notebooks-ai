import { useState } from 'react'
import s from './section.module.scss'
import parseDataToJSX from './parseDataToJSX.jsx'
import { useEffect } from 'react'
import { useContext } from 'react'
import { NotebookContext } from '../../utils/notebook_context.js'
import UserInput from '../../utils/user-input.js'
import { useRef } from 'react'
import ElementLibrary from './section_extras/element_library/element_library.jsx'
import Templates from './section_extras/templates/templates.jsx'
import SectionAside from './section_extras/section_aside/section_aside.jsx'
import RichText from '../rich_text/rich_text.jsx'
import SectionAI from './section_extras/section_ai/section_ai.jsx'


const FALLBACK_TITLE = "Untitled Section"

/**
 * Section component
 * 
 * @param {Object} props - Component props
 * @param {Object} props.sData - Section data
 */
export default function Section(props) {

    const sData = props?.sData  // Section data { id, type, height, title, elements (blank-only) }
    const [showAI, setShowAI] = useState(false)  // Show AI input
    const [showTemplates, setShowTemplates] = useState(false)  // Show templates
    const [showElementLibrary, setShowElementLibrary] = useState(false)  // Show element library
    const [dataJSX, setDataJSX] = useState(parseDataToJSX(props.sData))  // JSX elements of the section
    const [height, setHeight] = useState(sData.height) // Section height in px
    const $wrap = useRef(null)  // Section wrap element
    const $resizer = useRef(null)  // Resizer element
    const { state, dispatch } = useContext(NotebookContext)  // Global state and dispatch function
    const [isDragging, setIsDragging] = useState(false)  // Is the section being dragged

    // Parse data to JSX when data changes (global state -> local state)
    useEffect(() => {
        setDataJSX(parseDataToJSX(props.sData))
    }, [sData])


    // INITIAL SETUP
    useEffect(() => {
        UserInput.addOnDragStart("section-" + sData.id, (drag) => {
            if (!$resizer.current.contains(drag.$target)) return

            const $section = drag.$target.closest(`.${s.wrap}`).querySelector("[data-element='section']")
            const { top } = $section.getBoundingClientRect()

            UserInput.dragData = {
                ...UserInput.dragData,
                startConditions: {
                    sTop: top,
                }
            }

            setIsDragging(true)
        })
        // When the section is dragged, update the height
        UserInput.addOnDrag("section-" + sData.id, (drag) => {
            // Check if the resizer is being dragged, if not, return (the resizer can be null if the section was unmounted from one page and mounted on another)
            if (!$resizer.current || !$resizer.current.contains(drag.$target)) return

            // Calculate the drag distance in px
            const newY = UserInput.y - drag.startConditions.sTop
            setHeight(old => {
                // Compare the new height with the page bottom to avoid overflow + 30px margin
                const $page = $resizer.current.closest("[data-element='sheet-inner-margins']")
                const pageBottom = $page.getBoundingClientRect().bottom

                // If the section overflows the page, return the old height
                if (newY + 30 > pageBottom) return old
                // If the section is less than 60px, return the old height (gaps are allowed to be less than 60px)
                if (sData.type !== "gap" && newY < 60) return old

                return newY
            })
        })
        UserInput.addOnDragEnd("section-" + sData.id, () => {
            setIsDragging(false)
        })

        // Cleanup
        return () => {
            UserInput.removeOnDrag("section-" + sData.id)
            UserInput.removeOnDragStart("section-" + sData.id)
            UserInput.removeOnDragEnd("section-" + sData.id)
        }
    }, [])


    // Update the global state when the height changes (local state -> global state)
    useEffect(() => {
        if (sData.type.includes("preview")) return  // The preview sections are not real sections in the global state, they are just for preview (e.g. AI preview)

        dispatch({ type: "RESIZE_SECTION", payload: { id: sData.id, height } })
    }, [height])

    useEffect(() => {
        if (!sData._id.includes("preview")) return
        // Update the section height when the global state changes
        setHeight(sData.height)
    }, [sData.height])

    return (
        <div className={s.wrap} ref={$wrap} data-section-id={sData.id}>
            <div className={s.section_inner} style={{ height: height + "px" }} data-element="section">
                {/* Section context */}
                {
                    sData.type.includes("blank") &&
                    <div className={s.section_title}>
                        <h2 data-editable="text" data-editable-path={`sections["${sData.id}"].title`}><RichText>{sData.title || FALLBACK_TITLE}</RichText></h2>
                        <span className={s.title_decoration}>{state.sectionsOrder.filter(e => state.sections[e].type === "blank").indexOf(sData.id) + 1}</span>
                    </div>
                }
                <div className={s.section_content}>
                    {dataJSX}
                </div>
            </div>
            {
                // Section side toolbar
                sData.type !== "blank-preview" &&
                <SectionAside sData={sData} dispatch={dispatch} setShowAI={setShowAI} setShowTemplates={setShowTemplates} setShowElementLibrary={setShowElementLibrary} />
            }
            {
                // Show AI input
                showAI &&
                <SectionAI sData={sData} close={() => setShowAI(false)} />
            }
            {
                // Show templates
                showTemplates &&
                <Templates setShowTemplates={setShowTemplates} sData={sData} close={() => setShowTemplates(false)} />
            }
            {
                // Show element library
                showElementLibrary &&
                <ElementLibrary setShowElementLibrary={setShowElementLibrary} sData={sData} />
            }
            {/* Resizer */}
            <div className={[s.section_resizer, isDragging ? s.expanded : ""].join(" ")} ref={$resizer}>
                <span></span>
            </div>
            {
                window.debug &&
                // DEBUG: show id on the right margin (crop the middle data, only show the first and last characters to avoid large IDs to overflow)
                <span className={s.section_id}>{sData.id.replace(/(....).+(...)/, "$1...$2")}</span>
            }
        </div>
    )
}
