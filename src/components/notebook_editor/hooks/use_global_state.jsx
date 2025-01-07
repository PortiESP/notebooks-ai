import { useReducer } from "react";
import reducer from "../utils/reducer";
import { useEffect } from "react";



export default function useGlobalState(initialState) {
    const [state, dispatch] = useReducer(reducer, initialState)  // Global state
    const realTimeState = {
        hoverSection: null,
        hoverElement: null,
        selection: [],
    }

    useEffect(() => {
        window.notebooks_ai = {
            // Regular states (with reducer)
            state,
            dispatch,
            // States that are updated so frequently that using the reducer would slow down the app
            realTimeState,
        }
    }, [])

    return [state, dispatch, realTimeState]
}

