// Style
import s from "./notebook_editor.module.scss"
// Utils
import constants from "./utils/constants"
import { NotebookProvider } from "./utils/notebook_context"
import Sheet from "./sheet"
import { useEffect } from "react"
import { useState } from "react"
import UserInput from "./utils/user-input"
import Section from "./components/section/section"
import arrangeSections from "./utils/sections_arrangement"
import EditManager from "./components/edit_elements/edit_manager"
import { generatePDF } from "./utils/pdf"
import { useCallback } from "react"
import { handleShortcut } from "./utils/shortcuts"
import { SHORTCUTS_KEY_DOWN, SHORTCUTS_KEY_UP } from "./utils/constants_shortcuts"
import useGlobalState from "./hooks/use_global_state"
import ContextMenu from "./components/context_menu/context_menu"


// Initial State
const initialState = {
    sections: constants.DEFAULT_SECTIONS,  // Sections of the notebook by id
    sectionsOrder: constants.DEFAULT_SECTIONS_ORDER,  // Order of the sections
    sectionsByPage: arrangeSections(constants.DEFAULT_SECTIONS, constants.DEFAULT_SECTIONS_ORDER),  // Sections arranged by page
    footerTitle: "Notebook Title 1",
    contextMenu: null,  // The show/hide state is inferred from the value (null = hide, object = show)
}

let DEDUPLICATE_KEY_DOWN_TS = null
let DEDUPLICATE_KEY_UP_TS = null

/**
 * NotebookEditor component
 * 
 * @returns JSX.Element
 */
export default function NotebookEditor(props) {

    // State
    const [state, dispatch, realTimeState] = useGlobalState(initialState)  // Global state

    const [sectionsByPage, setSectionsByPage] = useState({})     // Array of Arrays, each array represents a page with its sections

    const handleGeneratePDF = useCallback(() => {
        const pages = [...document.querySelectorAll(`[data-element="sheet"]`)]
        generatePDF(pages)
    }, [])

    // INITIAL SETUP
    useEffect(() => {
        UserInput.start()  // Start listening to user input events (mouse and keyboard)

        const handleMouseMove = e => {
            const $section = e.target.closest("[data-section-id]")
            const $element = e.target.closest("[data-element-id]")

            // Update the global state with the current hovered section and element, or null if none
            realTimeState.hoverSection = $section || null
            realTimeState.hoverElement = $element || null
        }

        const handleKeyDown = (e) => {
            // Prevent duplicate keydown events
            if (DEDUPLICATE_KEY_DOWN_TS === e.timeStamp) return
            DEDUPLICATE_KEY_DOWN_TS = e.timeStamp
            
            handleShortcut(SHORTCUTS_KEY_DOWN)
        }

        const handleKeyUp = (e) => {
            // Prevent duplicate keyup events
            if (DEDUPLICATE_KEY_UP_TS === e.timeStamp) return
            DEDUPLICATE_KEY_UP_TS = e.timeStamp

            handleShortcut(SHORTCUTS_KEY_UP)
        }

        
        // Add event listeners
        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("keydown", handleKeyDown)
        window.addEventListener("keyup", handleKeyUp)

        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("keydown", handleShortcut)
            window.removeEventListener("keyup", handleShortcut)
        }   
    }, [])

    // DEBUG, Make state and dispatch available globally
    useEffect(() => {
        window.debug = true  // DEBUG
        window.state = state  // DEBUG
        window.sections = state.sections  // DEBUG
        window.sectionsOrder = state.sectionsOrder  // DEBUG
        window.sectionsByPage = state.sectionsByPage  // DEBUG
        window.dispatch = dispatch  // DEBUG
        window.UserInput = UserInput  // DEBUG
    }, [state])

    // Recalculate sections by page when sections change (add, remove, resize, etc)
    useEffect(() => {
        // Calculate sections by page
        const res = arrangeSections(state.sections, state.sectionsOrder)
        // Store the result in the state global state
        dispatch({ type: "SET_SECTIONS_BY_PAGE", payload: res })
    }, [state.sections, state.sectionsOrder])

    // When the global state changes, update the local state (this will trigger a re-render with the changes)
    useEffect(() => {
        setSectionsByPage(state.sectionsByPage)
    }, [state.sectionsByPage])

    return (
        <NotebookProvider value={{ state, dispatch }}>
            <div className={s.wrapper}>
                {
                    Object.keys(sectionsByPage).map((pageId, i) => {
                        return <Sheet key={i} pageNumber={pageId} footerTitle={state.footerTitle || "Notebook Title"}>
                            {sectionsByPage[i + 1]?.map(sectionId => {
                                const sData = state.sections[sectionId]
                                if (!sData) return null  // Skip if section data is not found (this can happen for a short time when a section is removed, until the state updates triggers all the useEffects)
                                return <Section key={sData.id} sData={sData} />
                            })}
                        </Sheet>
                    })
                }
                <button onClick={handleGeneratePDF} className={s.generatePDF}>Generate PDF</button>
                <EditManager />
                <ContextMenu />
            </div>
        </NotebookProvider>
    )
}
