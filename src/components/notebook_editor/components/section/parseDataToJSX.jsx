import SectionTypeBlank from "./section_types/blank/blank"
import SectionTypeDebug from "./section_types/debug/debug_section"
import SectionTypeDefault from "./section_types/default/default_section"
import Gap from "./section_types/gap/gap"


/**
 * Parse section data to JSX
 * 
 * @param {Object} sData - Section data
 * @returns {JSX.Element} - JSX element
 */
export default function parseDataToJSX(sData) {
    const { type } = sData
    const Component =
        type === "default" ? SectionTypeDefault :
        type === "gap" ? Gap :
        type.includes("blank") ? SectionTypeBlank :
        type === "debug" ? SectionTypeDebug :
        null

    if (!Component) {
        console.error("Section type not found:", type)
        return null
    }

    return <Component sData={sData} />
}