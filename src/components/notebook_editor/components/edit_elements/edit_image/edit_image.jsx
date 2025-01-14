import { useState } from 'react'
import s from './edit_image.module.scss'
import { useEffect } from 'react'
import { useCallback } from 'react'

const DEFAULT_IMAGES = [
    { src: "https://plus.unsplash.com/premium_photo-1686617826184-f4188a62c3be?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Rm9uZG8lMjBkZSUyMHBhbnRhbGxhJTIwZGUlMjBlc2NyaXRvcmlvfGVufDB8fDB8fHww" },
    { src: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Rm9uZG8lMjBkZSUyMHBhbnRhbGxhJTIwZGUlMjBlc2NyaXRvcmlvfGVufDB8fDB8fHww" },
    { src: "https://images.unsplash.com/photo-1479030160180-b1860951d696?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Rm9uZG8lMjBkZSUyMHBhbnRhbGxhJTIwZGUlMjBlc2NyaXRvcmlvfGVufDB8fDB8fHww" },
    { src: "https://plus.unsplash.com/premium_photo-1676009547155-32d75ba9d089?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Rm9uZG8lMjBkZSUyMHBhbnRhbGxhJTIwZGUlMjBlc2NyaXRvcmlvfGVufDB8fDB8fHww" },
    { src: "https://images.unsplash.com/photo-1475598322381-f1b499717dda?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Rm9uZG8lMjBkZSUyMHBhbnRhbGxhJTIwZGUlMjBlc2NyaXRvcmlvfGVufDB8fDB8fHww" },
    { src: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fEZvbmRvJTIwZGUlMjBwYW50YWxsYSUyMGRlJTIwZXNjcml0b3Jpb3xlbnwwfHwwfHx8MA%3D%3D" },

    { src: "https://images.unsplash.com/photo-1735236270655-907c43955b93?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8" },
    { src: "https://plus.unsplash.com/premium_photo-1728654439502-af094286476b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8" },
    { src: "https://images.unsplash.com/photo-1735181056575-1f05648efbad?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0fHx8ZW58MHx8fHx8" },
    { src: "https://images.unsplash.com/photo-1735276680696-f1c5bca7cdef?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8" },
    { src: "https://plus.unsplash.com/premium_photo-1731948132439-29777fe3be46?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8" },
    { src: "https://images.unsplash.com/photo-1735236270655-907c43955b93?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8" },

    { src: "https://plus.unsplash.com/premium_photo-1686617826184-f4188a62c3be?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Rm9uZG8lMjBkZSUyMHBhbnRhbGxhJTIwZGUlMjBlc2NyaXRvcmlvfGVufDB8fDB8fHww" },
    { src: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Rm9uZG8lMjBkZSUyMHBhbnRhbGxhJTIwZGUlMjBlc2NyaXRvcmlvfGVufDB8fDB8fHww" },
    { src: "https://images.unsplash.com/photo-1479030160180-b1860951d696?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Rm9uZG8lMjBkZSUyMHBhbnRhbGxhJTIwZGUlMjBlc2NyaXRvcmlvfGVufDB8fDB8fHww" },
    { src: "https://plus.unsplash.com/premium_photo-1676009547155-32d75ba9d089?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Rm9uZG8lMjBkZSUyMHBhbnRhbGxhJTIwZGUlMjBlc2NyaXRvcmlvfGVufDB8fDB8fHww" },
    { src: "https://images.unsplash.com/photo-1475598322381-f1b499717dda?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Rm9uZG8lMjBkZSUyMHBhbnRhbGxhJTIwZGUlMjBlc2NyaXRvcmlvfGVufDB8fDB8fHww" },
    { src: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fEZvbmRvJTIwZGUlMjBwYW50YWxsYSUyMGRlJTIwZXNjcml0b3Jpb3xlbnwwfHwwfHx8MA%3D%3D" },

    { src: "https://images.unsplash.com/photo-1735236270655-907c43955b93?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8" },
    { src: "https://plus.unsplash.com/premium_photo-1728654439502-af094286476b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8" },
    { src: "https://images.unsplash.com/photo-1735181056575-1f05648efbad?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0fHx8ZW58MHx8fHx8" },
    { src: "https://images.unsplash.com/photo-1735276680696-f1c5bca7cdef?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8" },
    { src: "https://plus.unsplash.com/premium_photo-1731948132439-29777fe3be46?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8" },
    { src: "https://images.unsplash.com/photo-1735236270655-907c43955b93?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8" },
]  // DEBUG

export default function EditImage(props) {

    const [results, setResults] = useState(DEFAULT_IMAGES)
    const [resultsAI, setResultsAI] = useState([])
    const [search, setSearch] = useState("")
    const [filters, setFilters] = useState({})
    const [aiLoading, setAILoading] = useState(false)

    useEffect(() => {
        if (!search) {
            setResults(DEFAULT_IMAGES)
            return
        }

        // Debounce the search
        const timeout = setTimeout(async () => {
            let url = `/api/images?q=${search}`
            if (filters.style) url += `&style=${filters.style}`
            if (filters.color) url += `&color=${filters.color}`
            const response = await fetch(url)
            if (!response.ok) {
                console.error("Error fetching images:", response)
                return
            }
            const data = await response.json() || undefined
            setResults(data)
        }, 300)
        return () => clearTimeout(timeout)
    }, [search, filters])

    const handleSetValue = (value) => {
        props.setValue(value)
        props.close()
    }

    const handleGenerate = useCallback(async () => {
        try{
            setAILoading(true)
            const res = await fetch(`/api/images/generate?prompt=${search}`)
            setAILoading(false)
            const images = await res.json()
            if (!images) return
            setResultsAI(old => [...images, ...old, ])
        } catch (error) {
            console.error("Error generating image:", error)
            setAILoading(false)
        }
    }, [search])

    useEffect(() => {
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

    return (
        <div className={s.wrap}>
            <div className={s.image_library_inner}>
                <div className={s.library_header}>
                    <div className={s.library_header_title}>Image Library</div>
                    <div className={s.library_header_search}>
                        <input type="text" placeholder="Search images..." value={search} onChange={e => setSearch(e.target.value)} />
                        <div className={s.search_filters}>
                            <select name="style" onChange={e => setFilters({ ...filters, style: e.target.value })}>
                                <option value="">Select style</option>
                                <option value="watercolor">watercolor</option>
                                <option value="flat">flat</option>
                                <option value="cartoon">cartoon</option>
                                <option value="geometric">geometric</option>
                                <option value="gradient">gradient</option>
                                <option value="isometric">isometric</option>
                                <option value="3d">3d</option>
                                <option value="hand-drawn">hand-drawn</option>
                            </select>
                            <select name="color" onChange={e => setFilters({ ...filters, color: e.target.value })}>
                                <option value="">Color</option>
                                <option value="black">black</option>
                                <option value="blue">blue</option>
                                <option value="gray">gray</option>
                                <option value="green">green</option>
                                <option value="orange">orange</option>
                                <option value="red">red</option>
                                <option value="white">white</option>
                                <option value="yellow">yellow</option>
                                <option value="purple">purple</option>
                                <option value="cyan">cyan</option>
                                <option value="pink">pink</option>
                            </select>
                        </div>
                        <button className={s.button_ai_gen} onClick={handleGenerate}>{aiLoading ? "Loading...": "Generate with AI"}</button>
                    </div>
                    <span className={s.close} onClick={props.close}>Close</span>
                </div>
                <div className={s.library_body}>
                    {
                        resultsAI?.map((result, index) => <ImageCard key={index} data={result} setValue={handleSetValue} ai/>) || null
                    }
                    {
                        results?.map((result, index) => <ImageCard key={index} data={result} setValue={handleSetValue} />) || <span className={s.no_results}>No results found</span>
                    }
                </div>
            </div>
        </div>
    )
}



function ImageCard({ data, setValue, ai }) {

    const [imageData, setImageData] = useState({})

    useEffect(() => {
        setImageData({ src: data.src || data })
    }, [data])

    return (
        <div className={s.image_card} onClick={() => setValue(imageData.src)}>
            <img src={imageData.src} alt="Image" />
            {
                ai && <span className={s.ai_tag}>AI</span>
            }
        </div>
    )
}