import Gap, {DEFAULT_GAP_HEIGHT} from "../components/section/section_types/gap/gap_class"
import Default from "../components/section/section_types/default/default_class"
import templates from "./templates"
import parseSDataToClass from "./parse_sData_to_class"
import ImageCoverMath from '../assets/images/covers/math-cover-front.svg?react'
import ImageCoverLiterature from '../assets/images/covers/lengua-cover-front.svg?react' 


const CONSTANTS = {
    TEMPLATES_EXERCISE_SECTIONS: templates.map(parseSDataToClass),
}

CONSTANTS.COVERS = [
    {
        img: <ImageCoverMath />,
        title: "Mathematics",
        sections: {
            "template-1": parseSDataToClass(templates[0]),
            "template-2": parseSDataToClass(templates[1]),
            "template-baño": parseSDataToClass(templates[9]),
            "template-lista-numeros": parseSDataToClass(templates[8]),
        },
        order: ["template-1", "template-2", "template-baño", "template-lista-numeros"]
    },
    {
        img: <ImageCoverLiterature />,
        title: "Literature",
        sections: {
            "template-3": parseSDataToClass(templates[2]),
            "template-conectores": parseSDataToClass(templates[10]),
            "template-100-palabras": parseSDataToClass(templates[6]),
            "template-4": parseSDataToClass(templates[3]),
            "template-5": parseSDataToClass(templates[4]),
            "template-6": parseSDataToClass(templates[5]),
        },
        order: ["template-3", "template-conectores", "template-100-palabras", "template-4", "template-5", "template-6"]
    }
]



export default CONSTANTS