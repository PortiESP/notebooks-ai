import BasicOperationV from "../components/section/section_element/basic_operation_v/basic_operation_v_class"
import Blank from "../components/section/section_types/blank/blank_class"
import Gap, {DEFAULT_GAP_HEIGHT} from "../components/section/section_types/gap/gap_class"
import Default from "../components/section/section_types/default/default_class"
import templates from "./templates"
import parseSDataToClass from "./parse_sData_to_class"
import { DEFAULT_SECTION_HEIGHT } from "../components/section/section_types/section_class"

const CONSTANTS = {
    DEFAULT_SECTIONS: {
        "default-1": new Default({ id: "default-1", height: 150 }),
        "gap-1": new Gap({ id: "gap-1" }),
        "debug-1": new Blank({ id: "debug-1",
            height: 200,
            title: "Resuelve las siguientes restas y rellena los cuadros en blanco",
            elements: {
                "basic_operation_v-1": new BasicOperationV({ id: "basic_operation_v-1", operator: "-", operands: ["1000", 4], result: "", x: 30, y: 40, width: 80, height: 110 }),
                "basic_operation_v-2": new BasicOperationV({ id: "basic_operation_v-2", operator: "-", operands: ["35", 23], result: "", x: 150, y: 40, width: 80, height: 110 }),
                "basic_operation_v-3": new BasicOperationV({ id: "basic_operation_v-3", operator: "-", operands: ["50", 15], result: "", x: 270, y: 40, width: 80, height: 110 }),
                "basic_operation_v-4": new BasicOperationV({ id: "basic_operation_v-4", operator: "-", operands: ["192", 83], result: "", x: 360, y: 40, width: 80, height: 110 })
            }
        }),
        "gap-2": new Gap({ id: "gap-2" }),
        "template-1": parseSDataToClass(templates[0]),
        "gap-3": new Gap({ id: "gap-3" }),
        "template-2": parseSDataToClass(templates[1]),
        "gap-4": new Gap({ id: "gap-4" }),
        "template-3": parseSDataToClass(templates[2]),
        "gap-5": new Gap({ id: "gap-5" }),
        "template-4": parseSDataToClass(templates[3]),
        "gap-6": new Gap({ id: "gap-6" }),
        "template-5": parseSDataToClass(templates[4]),
        "gap-7": new Gap({ id: "gap-7" }),
        "template-6": parseSDataToClass(templates[5]),
        "template-100-palabras": parseSDataToClass(templates[6]),
        "template-instrumentos": parseSDataToClass(templates[7]),
        "template-lista-numeros": parseSDataToClass(templates[8]),
        "template-baño": parseSDataToClass(templates[9]),
        "template-conectores": parseSDataToClass(templates[10]),
        "template-une-banderas": parseSDataToClass(templates[11]),
        "template-une-capitales": parseSDataToClass(templates[12]),
        "template-notas-pentagrama": parseSDataToClass(templates[13]),
    },

    DEFAULT_SECTIONS_ORDER: ["default-1", "gap-1", "debug-1", "gap-2", "template-1", "gap-3", "template-2", "gap-4", "template-3", "gap-5", "template-4", "gap-6", "template-5", "gap-7", "template-6", "template-100-palabras", "template-instrumentos", "template-lista-numeros", "template-baño", "template-conectores", "template-une-banderas", "template-une-capitales", "template-notas-pentagrama"],
    DEFAULT_GAP_HEIGHT,
    DEFAULT_SECTION_HEIGHT,
    GRID_SIZE: 10,
    
    
    TEMPLATES_EXERCISE_SECTIONS: templates.map(parseSDataToClass),
}



export default CONSTANTS