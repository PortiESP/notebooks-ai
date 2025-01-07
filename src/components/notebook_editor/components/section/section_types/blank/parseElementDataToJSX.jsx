import { Rnd } from "react-rnd"
import ElementText from "../../section_element/text/text_element"
import ResizeHandles from "./resize_handles"
import ElementImage from "../../section_element/image/image_element"
import ElementCalligraphy from "../../section_element/calligraphy/calligraphy"
import ElementBasicOperationV from "../../section_element/basic_operation_v/basic_operation_v"
import ElementFreeFormSVG from "../../section_element/free_form_svg_element/free_form_svg_element"
import CONSTANTS from "../../../../utils/constants"

/**
 * Parses element data to JSX
 * 
 * @param {Object} eData - Element data { id, type, x, y, width, height, text }
 * @param {Function} dispatch - Dispatch function
 * @param {String} sectionId - Section id
 * @returns JSX.Element
 */
export default function parseElementDataToJSX(eData, sectionId) {
    // Get element type
    const { type } = eData

    // Get element component
    const Element =
        type === "text" ? ElementText :
            type === "image" ? ElementImage :
                type === "calligraphy" ? ElementCalligraphy :
                    type === "basic_operation_v" ? ElementBasicOperationV :
                        type === "free_form_svg" ? ElementFreeFormSVG :
                            null

    // Check if element type not found
    if (!Element) {
        console.error("Element type not found:", type)
        return null
    }


    // Return element JSX wrapped in Rnd component (draggable and resizable)
    return <ResizeHandles elementId={eData.id} eData={eData} sectionId={sectionId}>
        <Element {...eData} sectionId={sectionId} />
    </ResizeHandles>

}