import s from './sheet_aside.module.scss'
import IconCover from '../../assets/icons/book-closed.svg?react'
import IconLandscape from '../../assets/icons/landscape.svg?react'
import IconPageDown from '../../assets/icons/file-down.svg?react'
import ImageBackground1 from '../../assets/images/backgrounds/background-1.svg?react'
import ImageBackground2 from '../../assets/images/backgrounds/background-2.svg?react'
import ImageBackground3 from '../../assets/images/backgrounds/background-3.svg?react'
import ImageBackground4 from '../../assets/images/backgrounds/background-4.svg?react'
import ImageCoverMath from '../../assets/images/covers/math-cover-front.svg?react'
import ImageCoverLiterature from '../../assets/images/covers/lengua-cover-front.svg?react'
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

    return (
        <div className={s.wrap} data-element="sheet-aside">
            <div className={s.wrap_inner}>
                <div className={s.aside}>
                    <div onClick={() => handleClick("cover")} className={[s.icon, scene === "cover" && s.selected].join(" ")}><IconCover /></div>
                    <div onClick={() => handleClick("backgrounds")} className={[s.icon, scene === "backgrounds" && s.selected].join(" ")}><IconLandscape /></div>
                    <div onClick={() => handleClick("download")} className={[s.icon, scene === "download" && s.selected].join(" ")}><IconPageDown /></div>
                </div>
                {
                    scene &&
                    <div className={s.menu}>
                        {
                            scene === "cover" && <SceneCover /> ||
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


const COVERS = [
    {
        img: undefined,
        title: "None"
    },
    {
        img: <ImageCoverMath />,
        title: "Mathematics"
    },
    {
        img: <ImageCoverLiterature />,
        title: "Literature"
    },
]


function SceneCover(){

    const { state, dispatch } = useContext(NotebookContext)

    const handleSetCover = useCallback((cover) => {
        dispatch({ type: 'SET_COVER', payload: { cover } })
    }, [])
    
    return (
        <div className={s.menu_wrap} data-aside-menu="cover">
            <div className={s.menu_title}>
                <h6>Cover</h6>
            </div>
            <div className={s.menu_body_grid}>
                {
                    COVERS.map((cover, index) => (
                        <div className={s.menu_grid_item} key={index} onClick={() => handleSetCover(cover.img)} data-selected={state.cover?.type.name === cover.img?.type.name || null}>
                            <div className={s.menu_item_img}>{cover.img}</div>
                            <div className={s.menu_item_title}>{cover.title}</div>
                        </div>
                    ))
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
            <div className={s.menu_body_grid}>
                {
                    BACKGROUNDS.map((bg, index) => (
                        <div className={s.menu_grid_item} key={index} onClick={() => handleSetBackground(bg.img)}>
                            <div className={s.menu_item_img} data-selected={state.background?.type.name === bg.img?.type.name || null}>{bg.img}</div>
                            <div className={s.menu_item_title}>{bg.title}</div>
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