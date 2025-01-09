import { generateUUID } from "./general"
import { parseElementDataToClassObject } from "./parse_eData_to_class"
import UserInput from "./user-input"

// ============================================================================================================== KEY DOWN SHORTCUTS =======================================================>>>
export const SHORTCUTS_KEY_DOWN = {
    "delete": deleteElement,
    "control+c": copyElement,
    "control+v": pasteElement,
    "control+z": () => window.notebooks_ai.dispatch({ type: "UNDO" }),
    "control+shift+z": () => window.notebooks_ai.dispatch({ type: "REDO" }),
}


// ============================================================================================================== KEY UP SHORTCUTS =======================================================>>>
export const SHORTCUTS_KEY_UP = {}






// ============================================================================================================== SHORTCUT DEFINITIONS =======================================================>>>
function deleteElement(state) {
    const { dispatch, realTimeState: { hoverSection, hoverElement } } = window.notebooks_ai

    // Get the section and element ids
    const sectionId = hoverSection?.dataset.sectionId
    const elementId = hoverElement?.dataset.elementId

    // If no element is hovered, return
    if (!sectionId || !elementId) return

    // Delete the element
    dispatch({ type: "DELETE_ELEMENT", payload: { sectionId, elementId } })
}

function copyElement(forceData) {
    const { realTimeState: { hoverSection, hoverElement } } = window.notebooks_ai

    // Get the section and element ids
    const sectionId = forceData?.sectionId ?? hoverSection?.dataset.sectionId
    const elementId = forceData?.elementId ?? hoverElement?.dataset.elementId

    // If no element is hovered, return
    if (!sectionId || !elementId) return

    // Get the element data
    const { state } = window.notebooks_ai
    const element = state.sections[sectionId].elements[elementId]

    // Save to clipboard
    try {
        navigator.clipboard.writeText(JSON.stringify({ app: "notebooks-ai", action: "copy-element", element }))
    } catch (err) {
        console.error("Failed to copy element to clipboard")
    }
}

function pasteElement(forceData) {
    // Get the section and element ids from the clipboard
    navigator.clipboard.readText().then(text => {
        try {
            const data = JSON.parse(text)
            if (!data?.app || data.app !== "notebooks-ai" || data.action !== "copy-element") return
    
            const { element } = data
            const sectionId = forceData?.sectionId ?? window.notebooks_ai.realTimeState.hoverSection?.dataset.sectionId
            const { dispatch } = window.notebooks_ai
    
            // Check if the section is hovered
            if (!sectionId) return
    
            const newElement = parseElementDataToClassObject(element)
            newElement.id = generateUUID()
            const { top: sY, left: sX } = document.querySelector(`[data-section-id="${sectionId}"] > div`).getBoundingClientRect()
            const { x: mX, y: mY } = UserInput
            newElement.x = (mX - sX) - (newElement.width / 2)
            newElement.y = (mY - sY) - (newElement.height / 2)
    
            // Add the element
            dispatch({ type: "ADD_ELEMENT", payload: { section: sectionId, newElement } })           
        } catch (err) {
            if (window.debug) console.error(`Failed to paste element [${text}]: `, err)
        }
    })
}