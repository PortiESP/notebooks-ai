import Text from "../components/section/section_element/text/text_class"
import Image from "../components/section/section_element/image/image_class"
import Calligraphy from "../components/section/section_element/calligraphy/calligraphy_class"
import BasicOperationV from "../components/section/section_element/basic_operation_v/basic_operation_v_class"
import Blank from "../components/section/section_types/blank/blank_class"
import Gap, {DEFAULT_GAP_HEIGHT} from "../components/section/section_types/gap/gap_class"
import Default from "../components/section/section_types/default/default_class"
import FreeFormSVG from "../components/section/section_element/free_form_svg_element/svg_class"
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
    },

    DEFAULT_SECTIONS_ORDER: ["default-1", "gap-1", "debug-1", "gap-2", "template-1"],
    DEFAULT_GAP_HEIGHT,
    DEFAULT_SECTION_HEIGHT,
    GRID_SIZE: 10,
    
    
    TEMPLATES_EXERCISE_SECTIONS: templates.map(parseSDataToClass),
}



export default CONSTANTS