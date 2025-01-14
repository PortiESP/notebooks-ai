import Blank from "../components/section/section_types/blank/blank_class"
import Default from "../components/section/section_types/default/default_class"
import Gap from "../components/section/section_types/gap/gap_class"
import { deepClone } from "./clone"
import { private2public } from "./general"
import parseElementsDataToClassObject from "./parse_eData_to_class"

export default function parseSDataToClass(sData) {
    const templateSection = private2public(deepClone(sData))

    if (templateSection.type === "gap") {
        return new Gap({ id: templateSection.id, height: templateSection.height, title: templateSection.title, elements: parseElementsDataToClassObject(templateSection.elements) })
    } else if (templateSection.type === "default") {
        return new Default({ id: templateSection.id, height: templateSection.height, title: templateSection.title, elements: parseElementsDataToClassObject(templateSection.elements) })
    }

    const newSection = new Blank({ id: templateSection.id, height: templateSection.height, title: templateSection.title, elements: parseElementsDataToClassObject(templateSection.elements) })
    return newSection
}