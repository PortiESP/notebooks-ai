const CACHE_SAVE_DEBOUNCE = 1000
const DEFAULT_CACHE_NAME = 'SvgMathCoverFront'
let saveTimeout = null

import SvgMathCoverFront from '../assets/images/covers/math-cover-front.svg?react'
import SvgLenguaCoverFront from '../assets/images/covers/lengua-cover-front.svg?react'
const COVERS = { SvgMathCoverFront, SvgLenguaCoverFront }
import SvgBackground1 from '../assets/images/backgrounds/background-1.svg?react'
import SvgBackground2 from '../assets/images/backgrounds/background-2.svg?react'
import SvgBackground3 from '../assets/images/backgrounds/background-3.svg?react'
import SvgBackground4 from '../assets/images/backgrounds/background-4.svg?react'
import parseSDataToClass from './parse_sData_to_class'
const BACKGROUNDS = { SvgBackground1, SvgBackground2, SvgBackground3, SvgBackground4 }


export default async function saveToCache() {
    if (saveTimeout) {
        clearTimeout(saveTimeout)
    }

    saveTimeout = setTimeout(() => {
        const state = { ...window.state }
        if (window.debug) console.log('Saving to cache', state);
        state.history = []  // DO NOT SAVE HISTORY
        state.redoHistory = [] // DO NOT SAVE REDO HISTORY
        state.cover = state.cover?.type.name
        state.background = state.background?.type.name
        const cacheName = window.notebooks_ai?.state.cover?.type.name || DEFAULT_CACHE_NAME
        localStorage.setItem(cacheName, JSON.stringify(state));
    }, CACHE_SAVE_DEBOUNCE)
}


export function loadFromCache(coverName) {
    const cacheName = coverName || window.notebooks_ai?.state.cover?.type.name || DEFAULT_CACHE_NAME
    const stateUnparsed = localStorage.getItem(cacheName)
    if (!stateUnparsed) return null;
    const state = JSON.parse(stateUnparsed)

    const Cover = COVERS[state.cover]
    const Background = BACKGROUNDS[state.background]
    
    state.cover = <Cover /> || null
    state.background = <Background /> || null
    Object.entries(state.sections).forEach(([id, sData]) => {
        state.sections[id] = parseSDataToClass(sData)
    })

    return state
}

export function clearCache() {
    localStorage.removeItem('SvgMathCoverFront')
    localStorage.removeItem('SvgLenguaCoverFront')
}