import BasicOperationV from "../components/section/section_element/basic_operation_v/basic_operation_v_class";
import Calligraphy from "../components/section/section_element/calligraphy/calligraphy_class";
import Image from "../components/section/section_element/image/image_class";
import Circle from "../components/section/section_element/shape/circle_class";
import Rectangle from "../components/section/section_element/shape/rectangle_class";
import Triangle from "../components/section/section_element/shape/triangle_class";
import Text from "../components/section/section_element/text/text_class";
import { private2public } from "./general";

export default function parseElementsDataToClassObject(data) {
    const elements = {}
    data = private2public(data)
    for (const id in data) {
        const elementData = data[id]
        switch (elementData.type) {
            case "text": elements[id] = new Text(elementData); break
            case "image": elements[id] = new Image(elementData); break
            case "basic_operation_v": elements[id] = new BasicOperationV(elementData); break
            case "circle": elements[id] = new Circle(elementData); break
            case "triangle": elements[id] = new Triangle(elementData); break
            case "rectangle": elements[id] = new Rectangle(elementData); break
            case "calligraphy": elements[id] = new Calligraphy(elementData); break
            default: console.error("Element type not found:", elementData)
        }
    }
    return elements
}

export function parseElementDataToClassObject(eData) {
    eData = private2public(eData)
    switch (eData.type) {
        case "text": return new Text(eData); 
        case "image": return new Image(eData); 
        case "basic_operation_v": return new BasicOperationV(eData); 
        case "circle": return new Circle(eData); 
        case "triangle": return new Triangle(eData); 
        case "rectangle": return new Rectangle(eData); 
        case "calligraphy": return new Calligraphy(eData); 
        default: console.error("Element type not found:", eData)
    }
    return null
}