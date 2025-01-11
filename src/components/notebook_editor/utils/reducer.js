import Gap from "../components/section/section_types/gap/gap_class"
import { deepClone } from "./clone"
import { setComputeObjPath } from "./computeObjPath"
import { generateUUID } from "./general"
import Element from "../components/section/section_element/element_class"
import Section from "../components/section/section_types/section_class"


// ======================================== UTILS FUNCTIONS ========================================

function cloneState(state) {
    const newState = { ...state }
    // We deep clone just the sections object due to performance reasons (the memento history causes recursive deep cloning and it's expensive)
    newState.sections = deepClone(state.sections)
    return newState
}

export function takeSnapshot(state) {
    // If the history is empty, add the current state to the history
    if (state.history.length === 0) {
        state.history.push(cloneState(state))
        return
    }

    // If the current state is the same as the last snapshot, don't add it to the history
    const currentSnapshot = state.history[state.history.length - 1]
    if (JSON.stringify(currentSnapshot.sections) === JSON.stringify(state.sections)) return

    // Add the current state to the history
    state.history.push(cloneState(state))
}


// ======================================== REDUCER FUNCTIONS ========================================

// Adds a new section to the sections object
const addSection = (state, section, afterId, addGap) => {
    // Check if section id is defined
    if (section.id === undefined) { console.error("Section id is undefined"); return state }
    // Check if section already exists
    if (existsSection(state, section.id)) { console.error("Section already exists"); return state }

    // If the section has no elements, add an empty elements object
    if (section.elements === undefined) section.elements = {}

    state = cloneState(state)

    // Add the new section to the sections object
    state.sections[section.id] = section

    // If addGap is true, add a gap section after the new section
    let gapId = section.id + "_gap"
    if (addGap) {
        const gap = new Gap({ id: gapId })  // Create the gap section
        state.sections[gapId] = gap  // Add the gap section to the sections object
    }
    
    // Get the position where the new section should be inserted
    let position = state.sectionsOrder.indexOf(afterId) + 1 || Infinity
    if (addGap){
        if (addGap === "before") state.sectionsOrder.splice(position, 0, gapId, section.id)  // Insert the gap section in the order
        else state.sectionsOrder.splice(position, 0, section.id, gapId)  // Insert the gap section in the order
    } else {
        // Insert the new section in the order
        state.sectionsOrder.splice(position, 0, section.id)
    }

    return state
}

// Removes a section from the sections object
const removeSection = (state, id) => {
    // Check if section exists
    if (!existsSection(state, id)) { console.error("Section does not exist"); return state }

    state = cloneState(state)
    delete state.sections[id]
    state.sectionsOrder = state.sectionsOrder.filter(i => i !== id)
    return state
}

// Checks if a section exists in the sections object
const existsSection = (state, id) => {
    return state.sections[id] !== undefined
}

// Sets the height of a section
const setSectionHeight = (state, id, height) => {
    // Check if section exists
    if (!existsSection(state, id)) { console.error("Section does not exist"); return state }

    state = cloneState(state)
    state.sections[id].height = height
    state.forceUpdate++  // Increment the forceUpdate value to force a re-render
    return state
}

// Replaces the entire section in the sections object with a new one
const replaceSection = (state, id, newSection) => {
    // Check if section exists
    if (!existsSection(state, id)) { console.error("Section does not exist"); return state }
    // Check if section is a class (polymorphism check)
    if (!(newSection instanceof Section)) { console.error("Section is not a class"); return state }

    state = cloneState(state)
    state.sections[id] = newSection
    state.sectionsOrder = state.sectionsOrder.map(i => i === id ? newSection.id : i)
    return state
}

// Edits a section's data in the sections object
const editSection = (state, id, sectionData) => {
    // Check if section exists
    if (!existsSection(state, id)) { console.error("Section does not exist"); return state }
    // Check if section id is defined
    if (sectionData.id) { console.error("Cannot edit section id"); return state }

    state = cloneState(state)
    const section = state.sections[id]
    const newSection = {
        ...section,
        ...sectionData
    }
    state.sections[id] = newSection
    return state
}

// Edits the footer title shown in on each page
const editFooterTitle = (state, title) => {
    state = cloneState(state)
    state.footerTitle = title
    return state
}


// Adds a new element to a section
const addElement = (state, sectionId, newElement) => {
    // Check if section exists
    if (!existsSection(state, sectionId)) { console.error("Section does not exist"); return state }
    // Check if element id is defined
    if (newElement.id === undefined) { console.error("Element id is undefined"); return state }
    // Check if element is a class (polymorphism check)
    if (!(newElement instanceof Element)) { console.error("Element is not a class"); return state }

    state = cloneState(state)
    const section = state.sections[sectionId]

    // If the section has no elements, add an empty elements object
    if (section.elements === undefined) section.elements = {}

    section.elements[newElement.id] = newElement
    return state
}


// Edits an element's data in a section
const editElement = (state, sectionId, elementId, elementData) => {
    // Check if section exists
    if (!existsSection(state, sectionId)) { console.error(`Section does not exist [${sectionId}]`); return state }

    state = cloneState(state)
    const section = state.sections[sectionId]

    // If the section has no elements, add an empty elements object
    if (!section.elements) { section.elements = {}; console.error("Elements object not found"); return state }

    const element = section.elements[elementId]

    // Check if element exists
    if (!element) { console.error("Element not found"); return state }

    // Update element data
    Object.assign(element, elementData)

    return state
}


// Edits an element's data in a section
const addElementStyle = (state, sectionId, elementId, appendStyle) => {
    // Check if section exists
    if (!existsSection(state, sectionId)) { console.error(`Section does not exist [${sectionId}]`); return state }

    state = cloneState(state)
    const section = state.sections[sectionId]

    // If the section has no elements, add an empty elements object
    if (!section.elements) { section.elements = {}; console.error("Elements object not found"); return state }

    const element = section.elements[elementId]

    // Check if element exists
    if (!element) { console.error("Element not found"); return state }

    // Update element data
    element.style = { ...element.style, ...appendStyle }

    return state
}

// Sets a value in the state object by path
const setByPath = (state, path, value) => {
    // Prevent setting the id
    if (path.slice(-3) === ".id") { console.error("Cannot set id"); return state }

    state = cloneState(state)
    setComputeObjPath(state, path, value)
    return state
}


// Sets the order of the sections
const setSectionsOrder = (state, order) => {
    state = cloneState(state)
    state.sectionsOrder = order
    return state
}

// Moves a section to a new position in the sections order
const moveSection = (state, id, newIndex) => {
    state = cloneState(state)
    const currentIndex = state.sectionsOrder.indexOf(id)
    state.sectionsOrder.splice(currentIndex, 1)  // Remove from current position
    state.sectionsOrder.splice(newIndex, 0, id)  // Insert in new position
    return state
}

// Delete element from section
const deleteElement = (state, sectionId, elementId) => {
    state = cloneState(state)
    const section = state.sections[sectionId]
    delete section.elements[elementId]
    return state
}

// Undo
export function undo(state) {
    if (history.length === 0) {
        if (window.debug) console.error("No snapshots to undo")
        return state
    }

    const snapshot = state.history.pop()
    state.redoHistory.push(cloneState(state))
    return snapshot
}

// Redo
export function redo(state) {
    if (state.redoHistory.length === 0) {
        if (window.debug) console.error("No snapshots to redo")
        return state
    }

    const snapshot = state.redoHistory.pop()
    state.history.push(cloneState(state))
    return snapshot
}

// Reducer function
export default function reducer(state, action) {

    if (window.debug) console.log("Action:", action)
    const { payload } = action

    switch (action.type) {
        case "ADD_SECTION":
            takeSnapshot(state)
            // Add section
            return addSection(state, payload.section, payload.after, payload.addGap)
        case "REMOVE_SECTION":
            takeSnapshot(state)
            // Remove section
            return removeSection(state, payload.id)
        case "SET_SECTIONS_BY_PAGE":
            // Reassign sectionsByPage
            return { ...state, sectionsByPage: payload }
        case "RESIZE_SECTION":
            // Resize section
            return setSectionHeight(state, payload.id, payload.height)
        case "REPLACE_SECTION":
            takeSnapshot(state)
            // Replace section
            return replaceSection(state, payload.id, payload)
        case "EDIT_SECTION":
            // Edit section
            return editSection(state, payload.id, payload)
        case "ADD_ELEMENT":
            takeSnapshot(state)
            // Add element
            return addElement(state, payload.section, payload.newElement)
        case "EDIT_ELEMENT":
            if (payload.sectionId === "preview") return state
            // Edit element
            return editElement(state, payload.sectionId, payload.elementId, payload.elementData)
        case "ADD_ELEMENT_STYLE":
            takeSnapshot(state)
            // Add element style
            return addElementStyle(state, payload.sectionId, payload.elementId, payload.style)
        case "EDIT_FOOTER_TITLE":
            takeSnapshot(state)
            // Edit footer title
            return editFooterTitle(state, payload)
        case "SET_BY_PATH":
            takeSnapshot(state)
            // Set value by path
            return setByPath(state, payload.path, payload.value)
        case "SET_SECTIONS_ORDER":
            // Set sections order
            return setSectionsOrder(state, payload.order)
        case "MOVE_SECTION":
            // Move section
            return moveSection(state, payload.id, payload.newIndex)
        case "DELETE_ELEMENT":
            takeSnapshot(state)
            // Delete element
            return deleteElement(state, payload.sectionId, payload.elementId)
        case "SET_CONTEXT_MENU":
            // Set context menu
            return { ...state, contextMenu: payload }
        case "UNDO":
            // Undo
            return undo(state)
        case "REDO":
            // Redo
            return redo(state)
        case "SET_BACKGROUND":
            // Set background
            return { ...state, background: payload.background }
        default:
            // Invalid action type
            console.error("Invalid action type")
            return state
    }
}

