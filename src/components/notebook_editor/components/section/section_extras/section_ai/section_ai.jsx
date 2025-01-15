import { useState } from 'react'
import s from './section_ai.module.scss'
import { useCallback } from 'react'
import { useContext } from 'react'
import { NotebookContext } from '../../../../utils/notebook_context'
import Section from '../../section'
import Blank from '../../section_types/blank/blank_class'
import parseSDataToClass from '../../../../utils/parse_sData_to_class'
import { useEffect } from 'react'
import { deepClone } from '../../../../utils/clone'
import IconSend from '../../../../assets/icons/send.svg?react'

const DEFAULT_SECTION_DRAFT = {
    id: "preview",
    type: "blank-preview",
    height: 300,
}

const NEAE_OPTIONS = [
    { value: "none", label: "None" },
    { value: "nee", label: "Necesidades educativas especiales" },
    { value: "rm", label: "Retraso madurativo" },
    { value: "tdlc", label: "Trastorno del desarrollo del lenguaje y la comunicación" },
    { value: "taa", label: "Trastornos de atención y aprendizaje" },
    { value: "dgla", label: "Desconocimiento grave de la lengua de aprendizaje" },
    { value: "svs", label: "Situaciones de vulnerabilidad socioeducativa" },
    { value: "aci", label: "Altas capacidades intelectuales" },
    { value: "special", label: "Condiciones especiales o de historia escolar" },
]

const CURSO_OPTIONS = [
    { value: "none", label: "None" },
    { value: "1p", label: "1º Primaria" },
    { value: "2p", label: "2º Primaria" },
    { value: "3p", label: "3º Primaria" },
    { value: "4p", label: "4º Primaria" },
    { value: "5p", label: "5º Primaria" },
    { value: "6p", label: "6º Primaria" },
    { value: "1s", label: "1º Secundaria" },
    { value: "2s", label: "2º Secundaria" },
    { value: "3s", label: "3º Secundaria" },
    { value: "4s", label: "4º Secundaria" },
]
    

export default function SectionAI(props) {

    const [prompt, setPrompt] = useState("")
    const { dispatch } = useContext(NotebookContext)
    const [draftSectionData, setDraftSectionData] = useState(DEFAULT_SECTION_DRAFT)
    const [loading, setLoading] = useState(true)
    const [history, setHistory] = useState([])
    const [textHistory, setTextHistory] = useState([])
    const [timeElapsed, setTimeElapsed] = useState(0)
    const [versionNumber, setVersionNumber] = useState(1)
    const [attempts, setAttempts] = useState(0)
    const [errorMsg, setErrorMsg] = useState("")

    // Options
    const [neae, setNeae] = useState("none")
    const [neaeDetails, setNeaeDetails] = useState("")
    const [subject, setSubject] = useState("")
    const [curso, setCurso] = useState("none")

    useEffect(() => {
        const auxSection = deepClone(props.sData)
        auxSection.id = "preview"
        auxSection.type = "blank-preview"
        setDraftSectionData(auxSection)

        // Disable scrolling
        document.body.style.overflow = "hidden"
        document.body.style.touchAction = "none"
        document.body.style.paddingRight = "17px"

        return () => {
            document.body.style.overflow = "auto"
            document.body.style.touchAction = "auto"
            document.body.style.paddingRight = "0px"
        }
    }, [])

    const handleSend = useCallback(() => {
        setLoading(true)
        setTimeElapsed(0)
        setErrorMsg("")
        setAttempts(0)
        
        // Update time elapsed
        const interval = setInterval(() => {
            setTimeElapsed(old => old + 1)
        }, 1000)

        const doFetch = (attempt) => {
            if (attempt > 3) {
                console.error("AI request failed too many times")
                setLoading(false)
                setErrorMsg("The AI request failed too many times, try again with a new prompt.")
                return
            }

            setAttempts(attempt)

            fetch("/api/ai/section", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    q: prompt,
                    history,
                    textHistory,
                    currentSection: props.sData,
                    attempt,
                    neae: neae !== "none" ? neae : null,
                    neaeDetails,
                    subject,
                    curso: curso !== "none" ? curso : null,
                })
            })
                .then(res => res.json())
                .then(res => {
                    console.log("AI response:", res)
                    const answerJSON = res.exerciseJson
                    const answerText = res.exerciseText
                    try {
                        const parsedJSON = JSON.parse(answerJSON)
                        const newSection = parseSDataToClass(parsedJSON)
                        newSection.id = "preview"
                        newSection.type = "blank-preview"
                        newSection.height = 300
                        setDraftSectionData(newSection)
                        setHistory(old => [...old, { prompt, response: answerJSON }])
                        setTextHistory(old => [...old, { prompt, response: answerText }])
                        setTimeElapsed(0)
                        setVersionNumber(old => old + 1)
                        clearInterval(interval)
                    }
                    catch (e) {
                        console.error("AI response is not a valid section:", response)
                        alert("Inténtalo de nuevo")
                    }
                    finally { setLoading(false) }
                })
                .catch(err => {
                    console.error("AI request failed:", err)
                    console.error("Retrying...")
                    doFetch(attempt + 1)
                })
        }

        // Fetch to the API
        doFetch(1)

    }, [prompt, props.sData, history, textHistory, neae, neaeDetails, subject, curso])

    const handleClose = useCallback(e => {
        if (e.target.classList.contains(s.wrap)) props.close()
    }, [props])

    const handleAccept = useCallback(() => {
        if (!draftSectionData || draftSectionData.doNotAccept) {
            console.error("Draft section is invalid:", draftSectionData)
            return
        }

        const newSection = new Blank({ id: props.sData.id, title: draftSectionData.title, elements: draftSectionData.elements, height: draftSectionData.height })
        dispatch({ type: "REPLACE_SECTION", payload: newSection })
        props.close()
    }, [draftSectionData])

    const handleKeyDown = useCallback(e => {
        if (e.key === "Enter") handleSend()
    }, [handleSend])

    return (
        <div className={s.wrap} onMouseDown={handleClose} onContextMenu={e => e.stopPropagation()}>
            <div className={s.section_ai_inner}>
                <search className={s.ai_input_wrap}>
                    <div className={s.ai_input_text_wrap}>
                        <input type="text" placeholder="AI input" value={prompt} onChange={e => setPrompt(e.target.value)} onKeyDown={handleKeyDown} />
                        <button onClick={handleSend}>
                            <IconSend />
                            {
                                <div className={s.loading_overlay}>
                                    <span className={s.loading_info}>
                                        <span>{timeElapsed}/~15s</span>
                                        <span>{attempts}/3</span>
                                        <span>v{versionNumber}</span>
                                        {
                                            errorMsg &&
                                            <span className={s.error_msg}>{errorMsg}</span>
                                        }
                                    </span>
                                </div>
                                
                            }
                        </button>
                    </div>
                    <div className={s.ai_input_options}>
                        <div className={s.ai_option_select}>
                            <span>NEAE</span>
                            <select name="neae" id="neae" value={neae} onChange={e => setNeae(e.target.value)}>
                                {
                                    NEAE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)
                                }
                            </select>
                            {
                                neae !== "none" &&
                                <input type="text" placeholder="Describe al alumno con el máximo detalle posible" value={neaeDetails} onChange={e => setNeaeDetails(e.target.value)} />
                            }
                        </div>
                        <div className={s.ai_option_text}>
                            <span>Subject</span>
                            <input type="text" placeholder="Asignatura o la temática del ejercicio" />
                        </div>
                        <div className={s.ai_option_select}>
                        <span>Curso</span>
                            <select name="curso" id="curso" value={curso} onChange={e => setCurso(e.target.value)}>
                                {
                                    CURSO_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)
                                }
                            </select>
                        </div>
                    </div>
                </search>
                <div className={s.information_wrap}>
                    <span>You can chain questions to the AI. Just keep asking for changes to the AI until you get the desired result.</span>
                </div>
                <div className={s.ai_section_draft_wrap}>
                    <div className={s.preview_section} onDoubleClick={e => e.stopPropagation()}>
                        <Section sData={draftSectionData} />
                    </div>
                </div>
                <div className={s.ai_buttons}>
                    <div className={s.ai_buttons_inner}>
                        <button onClick={handleAccept} disabled={!draftSectionData || draftSectionData.doNotAccept}>Accept</button>
                        <button onClick={props.close}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    )
}



// ------------------------------------------------------------------------------------------------

