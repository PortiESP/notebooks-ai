import { useContext } from "react"
import { NotebookContext } from "../../utils/notebook_context"
import { useEffect, useState, useCallback } from "react"
import s from "./context_menu.module.scss"
import UserInput from "../../utils/user-input"
import { generatePDF } from "../../utils/pdf"
import { SHORTCUTS_KEY_DOWN } from "../../utils/constants_shortcuts"
import Blank from "../section/section_types/blank/blank_class"


const CONTEXT_MENU_WIDTH = 200
// !!! In the callbacks, the state is passed as an argument to avoid stale closures
const CONTEXT_OPTIONS = {
    element: [
        { label: "Delete element", callback: contextMenuDeleteElement },
    ],
    section: [
        { label: "Delete section", callback: contextMenuDeleteSection },
        { label: "Add section below", callback: contextMenuAddSectionBelow },
    ],
}

const GLOBAL_OPTIONS = [
    // { label: "Undo", callback: () => console.log("Undo") },
    // { label: "Redo" },
    // { label: "Cut" },
    { label: "Copy", callback: contextMenuCopy },
    { label: "Paste", callback: contextMenuPaste },
    { divider: true },
    { label: "Download Notebook", callback: ()=>generatePDF() },
]




export default function ContextMenu(props) {

    const { state, dispatch } = useContext(NotebookContext)
    const [style, setStyle] = useState(undefined)
    const [context, setContext] = useState(undefined)  // Determines the default options to show along with the options from `optionsData`
    const [optionsData, setOptionsData] = useState(undefined)  // Custom options to show along with the default options
    const [show, setShow] = useState(false)



    useEffect(() => {
        if (!state.contextMenu) {
            setShow(false)
            return
        }

        setContext(state.contextMenu.context)
        setOptionsData(state.contextMenu.options)

        // Check if the context menu is going to overflow the window
        let { x, y } = UserInput
        if (x + CONTEXT_MENU_WIDTH > window.innerWidth) x = window.innerWidth - CONTEXT_MENU_WIDTH

        setStyle({ top: y, left: x, width: CONTEXT_MENU_WIDTH+"px" })

        setShow(true)
    }, [state.contextMenu])

    const close = useCallback(() => {
        dispatch({ type: "SET_CONTEXT_MENU", payload: undefined })
    }, [])

    // Hide after clicking anywhere
    useEffect(() => {
        if (show) {
            window.addEventListener("click", close)
            return () => window.removeEventListener("click", close)
        }
    }, [show])

    // Manage the context menu events
    useEffect(() => {
        // Add a listener to spawn the context menu
        const handleContextMenu = e => {
            e.preventDefault()

            const { hoverSection, hoverElement } = window.notebooks_ai.realTimeState

            // Determine the context
            let context = undefined
            if (hoverElement) context = "element"
            else if (hoverSection) context = "section"
            else context = "global"

            // Obtain the section and element ids at the time of the context menu event
            const sectionId = hoverSection?.dataset.sectionId
            const elementId = hoverElement?.dataset.elementId

            dispatch({ type: "SET_CONTEXT_MENU", payload: { context, sectionId, elementId } })
        }

        window.addEventListener("contextmenu", handleContextMenu)
        return () => window.removeEventListener("contextmenu", handleContextMenu)
    }, [])

    return (show &&
        <div className={s.wrap} style={style}>
            <div className={s.context_inner}>
                {
                    optionsData && <>
                        {optionsData.map((option, i) => <ContextOption key={i} {...option} />)}
                        <div className={s.divider}></div>
                    </>
                }
                {
                    context && CONTEXT_OPTIONS[context] && <>
                        {CONTEXT_OPTIONS[context].map((option, i) => <ContextOption key={i} {...option} />)}
                        <div className={s.divider}></div>
                    </>
                }
                {
                    GLOBAL_OPTIONS.map((option, i) => <ContextOption key={i} {...option} />)
                }
            </div>
        </div>
    )
}


function ContextOption(props) {

    const { state } = useContext(NotebookContext)

    const handleClick = useCallback(() => {
        if (props.callback) props.callback(state)
    }, [state.contextMenu])

    if (props.divider) return <div className={s.divider}></div>
    return <div className={s.option_wrap} onClick={handleClick}><div className={s.option_inner}>{props.label}</div></div>
}


// ----------------------------------------------------------------------------------------------------->> Functions

function contextMenuCopy(state) {
    const {sectionId, elementId} = state.contextMenu
    SHORTCUTS_KEY_DOWN["control+c"]({ sectionId, elementId })
}

function contextMenuPaste(state) {
    const {sectionId, elementId} = state.contextMenu
    SHORTCUTS_KEY_DOWN["control+v"]({ sectionId, elementId })
}

function contextMenuDeleteElement(state) {
    const {sectionId, elementId} = state.contextMenu
    window.notebooks_ai.dispatch({ type: "DELETE_ELEMENT", payload: { sectionId, elementId } })
}

function contextMenuDeleteSection(state) {
    const {sectionId} = state.contextMenu
    window.notebooks_ai.dispatch({ type: "REMOVE_SECTION", payload: { id: sectionId } })
}

function contextMenuAddSectionBelow(state) {
    const {sectionId: afterSectionId} = state.contextMenu
    const newSection = new Blank({ height: 40})

    window.notebooks_ai.dispatch({ type: "ADD_SECTION", payload: { section: newSection, after: afterSectionId, addGapAfter: true } })
}