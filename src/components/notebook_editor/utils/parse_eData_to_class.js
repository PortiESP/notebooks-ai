import BasicOperationV from "../components/section/section_element/basic_operation_v/basic_operation_v_class";
import Calligraphy from "../components/section/section_element/calligraphy/calligraphy_class";
import FreeFormSVG from "../components/section/section_element/free_form_svg_element/svg_class";
import Image from "../components/section/section_element/image/image_class";
import Text from "../components/section/section_element/text/text_class";
import { private2public } from "./general";

export default function parseElementsDataToClassObject(data) {
    const elements = {}
    data = private2public(data)
    for (const id in data) {
        const eData = data[id]
        elements[id] = parseElementDataToClassObject(eData)
    }
    return elements
}

export function parseElementDataToClassObject(eData) {
    eData = private2public(eData)
    switch (eData.type) {
        case "text": return new Text(eData); 
        case "image": return new Image(eData); 
        case "basic_operation_v": return new BasicOperationV(eData); 
        case "calligraphy": return new Calligraphy(eData); 
        case "free_form_svg": return new FreeFormSVG(eData);
        default: console.error("Element type not found:", eData)
    }
    return null
}