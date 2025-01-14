import Blank from "../components/section/section_types/blank/blank_class"
import { deepClone } from "./clone"
import { private2public } from "./general"
import parseElementsDataToClassObject from "./parse_eData_to_class"

export default function parseSDataToClass(sData) {
    const templateSection = private2public(deepClone(sData))
    const newSection = new Blank({ id: templateSection.id, height: templateSection.height, title: templateSection.title, elements: parseElementsDataToClassObject(templateSection.elements) })
    return newSection
}