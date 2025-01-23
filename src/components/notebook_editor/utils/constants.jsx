import { templatesMath, templatesLengua, templatesGeneral } from "./templates"
import parseSDataToClass from "./parse_sData_to_class"
import ImageCoverMath from '../assets/images/covers/math-cover-front.svg?react'
import ImageCoverLiterature from '../assets/images/covers/lengua-cover-front.svg?react' 

// Templates thumbnails
import ImgTemplateThumbConectores from '../assets/images/templates/thumbnail-conectores.png'
import ImgTemplateThumbHistory from '../assets/images/templates/thumbnail-historia.png'
import ImgTemplateThumbHistory2 from '../assets/images/templates/thumbnail-historia-2.png'
import ImgTemplateThumbInstrumentos from '../assets/images/templates/thumbnail-instrumentos.png'
import ImgTemplateThumbListaNumeros from '../assets/images/templates/thumbnail-lista-numeros.png'
import ImgTemplateThumbNotasPentagrama from '../assets/images/templates/thumbnail-notas-pentagrama.png'
import ImgTemplateThumbUneBanderas from '../assets/images/templates/thumbnail-une-banderas.png'
import ImgTemplateThumbUneCapitales from '../assets/images/templates/thumbnail-une-capitales.png'
import ImgTemplateThumbBasicOps from '../assets/images/templates/thumbnail-basic-ops.png'
import ImgTemplateThumbPriceCircle from '../assets/images/templates/thumbnail-price-circle.png'
import ImgTemplateThumbBaño from '../assets/images/templates/thumbnail-baño.png'
import ImgTemplateThumbSumaFracciones from '../assets/images/templates/thumbnail-suma-fracciones.png'
import ImgTemplateThumbAdivinaFiguras from '../assets/images/templates/thumbnail-adivina-figuras.png'
import ImgTemplateThumbResuelveProblemas from '../assets/images/templates/thumbnail-resuelve-problemas.png'
import ImgTemplateVerbPhrases from '../assets/images/templates/thumbnail-verbos.png'
// import ImgTemplateThumbTextGaps from '../assets/images/templates/thumbnail-text-gaps.png'
import ImgTemplateThumbOrtografía1 from '../assets/images/templates/thumbnail-ortografía-1.png'
// import ImgTemplateThumb100Palabras from '../assets/images/templates/thumbnail-100-palabras.png'
import ImgTemplateThumbAgudasLlanasEsdrujulas from '../assets/images/templates/thumbnail-agudas-llanas-esdrujulas.png'
// import ImgTemplateThumbObservaYResponde from '../assets/images/templates/thumbnail-observa-y-responde.png'
import ImgTemplateThumbRegaloMario from '../assets/images/templates/thumbnail-regalo-mario.png'
import ImgTemplateThumbOrdenaCronologicamente from '../assets/images/templates/thumbnail-ordena-cronológicamente.png'

const CONSTANTS = {
    TEMPLATES_EXERCISE_SECTIONS_MATH: templatesDataToTemplateSections(templatesMath),
    TEMPLATES_EXERCISE_SECTIONS_LENGUA: templatesDataToTemplateSections(templatesLengua),
    TEMPLATES_EXERCISE_SECTIONS_GENERAL: templatesDataToTemplateSections(templatesGeneral),
}

CONSTANTS.COVERS = [
    {
        img: <ImageCoverMath />,
        title: "Matemáticas",
        sections: CONSTANTS.TEMPLATES_EXERCISE_SECTIONS_MATH,
        order: Object.values(templatesMath).map(key => key._id)
    },
    {
        img: <ImageCoverLiterature />,
        title: "Lengua",
        sections: CONSTANTS.TEMPLATES_EXERCISE_SECTIONS_LENGUA,
        order: Object.values(templatesLengua).map(key => key._id)
    }
]

CONSTANTS.TEMPLATES_THUMBNAILS_GENERAL = {
    "template-une-banderas": ImgTemplateThumbUneBanderas,
    "template-une-capitales": ImgTemplateThumbUneCapitales,
    "template-instrumentos": ImgTemplateThumbInstrumentos,
    "template-notas-pentagrama": ImgTemplateThumbNotasPentagrama,
}

CONSTANTS.TEMPLATES_THUMBNAILS_MATH = {
    "template-lista-numeros": ImgTemplateThumbListaNumeros,
    "template-resuelve-problemas": ImgTemplateThumbResuelveProblemas,
    "template-suma-fracciones": ImgTemplateThumbSumaFracciones,
    "template-adivina-figuras": ImgTemplateThumbAdivinaFiguras,
    "template-baño": ImgTemplateThumbBaño,
    "template-basic-ops": ImgTemplateThumbBasicOps,
    "template-price-circle": ImgTemplateThumbPriceCircle,
}


CONSTANTS.TEMPLATES_THUMBNAILS_LENGUA = {
    "template-verb-phrases": ImgTemplateVerbPhrases,
    "template-history": ImgTemplateThumbHistory2,
    "template-ortografía-1": ImgTemplateThumbOrtografía1,
    "template-100-palabras": ImgTemplateThumbHistory,
    "template-conectores": ImgTemplateThumbConectores,
    "template-agudas-llanas-esdrujulas": ImgTemplateThumbAgudasLlanasEsdrujulas,
    "template-observa-y-responde": ImgTemplateThumbPriceCircle,
    "template-regalo-mario": ImgTemplateThumbRegaloMario,
    "template-ordena-cronológicamente": ImgTemplateThumbOrdenaCronologicamente,
}





export default CONSTANTS

// --------

function templatesDataToTemplateSections(templates) {
    return Object.keys(templates).reduce((acc, key) => {
        const t = templates[key]
        acc[t._id] = parseSDataToClass(t)
        return acc
    }, {})
}