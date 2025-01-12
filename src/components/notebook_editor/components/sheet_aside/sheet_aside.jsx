import s from './sheet_aside.module.scss'
import IconLandscape from '../../assets/icons/landscape.svg?react'
import IconPageDown from '../../assets/icons/file-down.svg?react'
import ImageBackground1 from '../../assets/images/backgrounds/background-1.svg?react'
import ImageBackground2 from '../../assets/images/backgrounds/background-2.svg?react'
import ImageBackground3 from '../../assets/images/backgrounds/background-3.svg?react'
import ImageBackground4 from '../../assets/images/backgrounds/background-4.svg?react'
import { useState } from 'react'
import { useCallback } from 'react'
import { useContext } from 'react'
import { NotebookContext } from '../../utils/notebook_context'
import { generatePDF } from '../../utils/pdf'
import { useEffect } from 'react'

export default function SheetAside() {

    const [scene, setScene] = useState("")

    const handleClick = useCallback((id) => {
        setScene(old => {
            if (old === id) return ""
            return id
        })
    }, [])

    console.log(state.background);
    

    return (
        <div className={s.wrap} data-element="sheet-aside">
            <div className={s.wrap_inner}>
                <div className={s.aside}>
                    <div onClick={() => handleClick("backgrounds")} className={[s.icon, scene === "backgrounds" && s.selected].join(" ")}><IconLandscape /></div>
                    <div onClick={() => handleClick("download")} className={[s.icon, scene === "download" && s.selected].join(" ")}><IconPageDown /></div>
                </div>
                {
                    scene &&
                    <div className={s.menu}>
                        {
                            scene === "backgrounds" && <SceneBackgrounds /> ||
                            scene === "download" && <SceneDownload /> ||
                            null
                        }
                    </div>
                }
            </div>
        </div>
    )
}


const BACKGROUNDS = [
    {
        img: undefined,
        title: "Blank"
    },
    {
        img: <ImageBackground1 />,
        title: "Flat Nature"
    },
    {
        img: <ImageBackground2 />,
        title: "Brush Rush"
    },
    {
        img: <ImageBackground3 />,
        title: "Imagination"
    },
    {
        img: <ImageBackground4 />,
        title: "Iceberg"
    },
]

function SceneBackgrounds() {

    const { state, dispatch } = useContext(NotebookContext)

    const handleSetBackground = useCallback((background) => {
        dispatch({ type: 'SET_BACKGROUND', payload: { background } })
    }, [])

    return (
        <div className={s.menu_wrap} data-aside-menu="backgrounds">
            <div className={s.menu_title}>
                <h6>Backgrounds</h6>
            </div>
            <div className={s.bg_body}>
                {
                    BACKGROUNDS.map((bg, index) => (
                        <div className={s.bg_item} key={index} onClick={() => handleSetBackground(bg.img)}>
                            <div className={s.bg_item_img} data-selected={state.background?.type.name === bg.img?.type.name || null}>{bg.img}</div>
                            <div className={s.bg_item_title}>{bg.title}</div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}


// Scene download
function SceneDownload() {

    const { state } = useContext(NotebookContext)
    const [min, setMin] = useState(1)
    const [max, setMax] = useState(Object.keys(state.sectionsByPage).length)
    const [docName, setDocName] = useState(`notebook-${new Date().toISOString().replace("T", "_").split(".")[0]}`)
    const [isLoading, setIsLoading] = useState(false)

    const handleDownload = useCallback(() => {
        const pages = [...document.querySelectorAll("[data-element='sheet']")]
        const selectedPages = pages.slice(min - 1, max)
        setIsLoading(true)

        generatePDF(selectedPages, docName)
            .then(pdf => {
                if (window.debug) console.log("PDF generated", pdf)
                setIsLoading(false)
            })

    }, [min, max, docName])

    useEffect(() => {
        setMax(Object.keys(state.sectionsByPage).length)
    }, [state.sectionsByPage])

    return (
        <div className={s.menu_wrap} data-aside-menu="download">
            <div className={s.menu_title}>
                <h6>Download</h6>
            </div>
            <div className={s.download_body}>
                <div className={s.pages_wrap}></div>
                <div className={s.form_wrap}>
                    <div className={s.doc_name}>
                        <label>Document name</label>
                        <input type="text" value={docName} onChange={e => setDocName(e.target.value)} />
                    </div>
                    <div className={s.min_max_wrap}>
                        <div className={s.min_max}>
                            <label>Min</label>
                            <input type="number" min="0" value={min} onChange={e => setMin(e.target.value)} />
                            <span>(inclusive)</span>
                        </div>
                        <div className={s.min_max}>
                            <label>Max</label>
                            <input type="number" min="0" value={max} onChange={e => setMax(e.target.value)} />
                            <span>(inclusive)</span>
                        </div>
                    </div>
                </div>
                <div className={s.download_btn_wrap}>
                    <button onClick={handleDownload}>{isLoading ?
                        <span className={s.loader}></span>
                        : "Download"}</button>
                </div>
            </div>
        </div>
    )
}