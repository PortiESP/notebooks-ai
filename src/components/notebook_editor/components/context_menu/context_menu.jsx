import { useContext } from "react"
import { NotebookContext } from "../../utils/notebook_context"
import { useEffect, useState, useCallback } from "react"
import s from "./context_menu.module.scss"
import UserInput from "../../utils/user-input"
import { generatePDF } from "../../utils/pdf"
import { SHORTCUTS_KEY_DOWN } from "../../utils/constants_shortcuts"
import Blank from "../section/section_types/blank/blank_class"
import Gap from "../section/section_types/gap/gap_class"


const CONTEXT_MENU_WIDTH = 200
// !!! In the callbacks, the state is passed as an argument to avoid stale closures
const CONTEXT_OPTIONS = {
    element: [
        { label: "Editar con IA!", callback: contextMenuEditWithAI },
        { label: "Eliminar elemento", callback: contextMenuDeleteElement },
    ],
    section: [
        { label: "Eliminar sección", callback: contextMenuDeleteSection },
        { label: "Añadir sección abajo", callback: contextMenuAddSectionBelow },
        { label: "Añadir espacio abajo", callback: contextMenuAddGapBelow },
    ],
}

const GLOBAL_OPTIONS = [
    // { label: "Undo", callback: () => console.log("Undo") },
    // { label: "Redo" },
    // { label: "Cut" },
    { label: "Copiar", callback: contextMenuCopy },
    { label: "Pegar", callback: contextMenuPaste },
    { divider: true },
    { label: "Descargar cuadernillo", callback: () => generatePDF() },
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

        setStyle({ top: y, left: x, width: CONTEXT_MENU_WIDTH + "px" })

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

    return props.divider
        ? <div className={s.divider}></div>
        : <div className={s.option_wrap} onClick={handleClick}><div className={s.option_inner}>{props.label}</div></div>
}


// ----------------------------------------------------------------------------------------------------->> Functions

function contextMenuCopy(state) {
    const { sectionId, elementId } = state.contextMenu
    SHORTCUTS_KEY_DOWN["control+c"]({ sectionId, elementId })
}

function contextMenuPaste(state) {
    const { sectionId, elementId } = state.contextMenu
    SHORTCUTS_KEY_DOWN["control+v"]({ sectionId, elementId })
}

function contextMenuDeleteElement(state) {
    const { sectionId, elementId } = state.contextMenu
    window.notebooks_ai.dispatch({ type: "DELETE_ELEMENT", payload: { sectionId, elementId } })
}

function contextMenuDeleteSection(state) {
    const { sectionId } = state.contextMenu
    window.notebooks_ai.dispatch({ type: "REMOVE_SECTION", payload: { id: sectionId } })
}

function contextMenuAddSectionBelow(state) {
    const { sectionId: afterSectionId } = state.contextMenu
    const newSection = new Blank({})

    window.notebooks_ai.dispatch({ type: "ADD_SECTION", payload: { section: newSection, after: afterSectionId, addGap: "after" } })
}

function contextMenuAddGapBelow(state) {
    const { sectionId: afterSectionId } = state.contextMenu
    const newSection = new Gap({})

    window.notebooks_ai.dispatch({ type: "ADD_SECTION", payload: { section: newSection, after: afterSectionId } })
}

function contextMenuEditWithAI(state) {
    const { sectionId, elementId } = state.contextMenu
    const eData = state.sections[sectionId].elements[elementId]
    const prompt = window.prompt("Introduce el prompt para la IA:")
    fetch("/api/ai/element", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: prompt, element: eData})
    })
    .then(res => res.json())
    .then(data => {
        const element = JSON.parse(data.element)
        window.notebooks_ai.dispatch({ type: "EDIT_ELEMENT", payload: { sectionId, elementId, elementData: element } })
        console.log(data)
    })
}