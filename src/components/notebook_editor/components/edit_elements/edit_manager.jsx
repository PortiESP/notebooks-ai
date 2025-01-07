import { useEffect } from 'react'
import EditText from './edit_text/edit_text'
import { useState } from 'react'
import UserInput from '../../utils/user-input'
import { useContext } from 'react'
import { NotebookContext } from '../../utils/notebook_context'
import EditImage from './edit_image/edit_image'


/**
 * EditManager component
 * 
 * This component is responsible for choosing which `edit_` component to render based on the element clicked.
 * 
 * @param {object} props
 * @returns JSX.Element
 */
export default function EditManager(props) {

    const [showEditForm, setShowEditForm] = useState(null)  // Stores the formulary to render based on the element clicked. It should render a different form for each type of element (text, image, etc)
    const { dispatch } = useContext(NotebookContext)

    // Handle double click event (choose the form to render)
    const handleDoubleClick = (e) => {
        // Get the element clicked (or the closest element with the attribute)
        const $target = e.target.closest("[data-editable]")

        // If there's no element clicked, return
        if (!$target) return

        // Extract data from the element clicked and check if it's editable
        const dataEditable = $target.getAttribute("data-editable")
        const dataEditablePath = $target.getAttribute("data-editable-path")
        if (!dataEditable || !dataEditablePath) return

        // Get the position of the element clicked and the mouse position
        const elementBbox = $target.getBoundingClientRect()
        const mousePosition = { x: e.clientX, y: e.clientY }

        // Prepare the props for the formulary
        const close = () => setShowEditForm(null)
        const setValue = value => dispatch({ type: "SET_BY_PATH", payload: { path: dataEditablePath, value } })
        const newProps = { eBbox: elementBbox, mPos: mousePosition, $target, close, setValue, type: dataEditable }

        // Render the formulary based on the type of element clicked
        if (dataEditable === "text") setShowEditForm(<EditText {...newProps}/>)
        else if (dataEditable === "text-raw") setShowEditForm(<EditText {...newProps}/>)
        else if (dataEditable === "image") setShowEditForm(<EditImage {...newProps}/>)
        
    }

    // INITIAL SETUP
    useEffect(() => {
        UserInput.addOnDoubleClick("edit-manager", handleDoubleClick)
        return () => UserInput.removeOnDoubleClick("edit-manager")
    }, [])

    return showEditForm
}
