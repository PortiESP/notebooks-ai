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

export default function SectionAI(props) {

    const [prompt, setPrompt] = useState("")
    const { dispatch } = useContext(NotebookContext)
    const [draftSectionData, setDraftSectionData] = useState(DEFAULT_SECTION_DRAFT)
    const [loading, setLoading] = useState(false)
    const [history, setHistory] = useState([])
    const [textHistory, setTextHistory] = useState([])

    useEffect(() => {
        const auxSection = deepClone(props.sData)
        auxSection.id = "preview"
        auxSection.type = "blank-preview"
        setDraftSectionData(auxSection)
    }, [])

    const handleSend = useCallback(() => {
        setLoading(true)
        fetch("/api/ai/section", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ q: prompt, history, textHistory, currentSection: props.sData})
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
                    setHistory(old => [...old, {prompt, response: answerJSON}])
                    setTextHistory(old => [...old, {prompt, response: answerText}])
                } 
                catch (e) {
                    console.error("AI response is not a valid section:", response)
                    alert("Inténtalo de nuevo")
                } 
                finally {setLoading(false)}
            })
    }, [prompt, props.sData, history, textHistory])

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
                <div className={s.ai_input_wrap}>
                    <input type="text" placeholder="AI input" value={prompt} onChange={e => setPrompt(e.target.value)} onKeyDown={handleKeyDown}/>
                    <button onClick={handleSend}>
                        <IconSend />
                        {
                            loading &&
                            <div className={s.loading_overlay}>
                                <span className={s.loader}></span>
                            </div>
                        }
                    </button>
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

