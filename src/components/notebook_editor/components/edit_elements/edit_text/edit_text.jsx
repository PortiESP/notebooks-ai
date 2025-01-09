import React, { useCallback, useState, useEffect, useRef } from 'react'
import s from './edit_text.module.scss'
import { useContext } from 'react'
import { NotebookContext } from '../../../utils/notebook_context'
import IconBold from '../../../assets/icons/bold.svg?react'
import IconItalic from '../../../assets/icons/italic.svg?react'
import IconUnderline from '../../../assets/icons/underline.svg?react'
import IconAlignLeft from '../../../assets/icons/align-left.svg?react'
import IconAlignCenter from '../../../assets/icons/align-center.svg?react'
import IconAlignRight from '../../../assets/icons/align-right.svg?react'
import IconColorPalette from '../../../assets/icons/palette.svg?react'
import IconTextBackground from '../../../assets/icons/type.svg?react'
import IconFont from '../../../assets/icons/font.svg?react'


/**
 * EditText component
 * 
 * @param {object} props
 * @param {HTMLElement} props.$target - The target element to edit
 * @param {object} props.eBbox - The position and size of the mouse event
 * @param {function} props.setValue - The function to set the new state
 * @param {function} props.close - The function to close the editor
 * @returns JSX
 */
export default function EditText({ $target, ...props }) {
    const [style, setStyle] = useState({})
    const $input = useRef(null)
    const $wrap = useRef(null)
    const { state, dispatch } = useContext(NotebookContext)
    const [ targetGeneralStyle, setTargetGeneralStyle ] = useState({})

    const saveEdit = useCallback(() => {
        const parsedHTML = $input.current.innerHTML.replace(/<br>/ig, "")

        if (props.type === "text-raw") {
            props.setValue($input.current.innerText)
            props.close()
            return
        }


        console.log("Parsed HTML:", parsedHTML)
        props.setValue(parsedHTML)
        const eId = $target.getAttribute("data-eid")
        const sId = $target.getAttribute("data-sid")
        dispatch({ type: "ADD_ELEMENT_STYLE", payload: { sectionId: sId, elementId: eId, style: targetGeneralStyle } })
        props.close()
    }, [props, targetGeneralStyle, $target])

    const discardEdit = useCallback(() => {
        props.close()
    }, [props])

    const handleBlur = useCallback((e) => {
        if (e.target !== e.currentTarget) return
        saveEdit()
    }, [discardEdit, saveEdit])

    const applyStyle = useCallback((command, value = null) => {
        if (props.type === "text-raw") return

        if (!command) {
            console.error('No command provided');
            return;
        }

        const selection = document.getSelection();
        // Selected text
        const substr = selection.toString();
        // If no text was selected, return
        if (!substr.length) return;

        const needsWrap = selection.anchorNode.data ? selection.anchorNode.data.length > 1 : true;

        let start;
        let end;
        let span;
        // If the selection was done when the text was NOT wrapped in a span
        if (needsWrap) {
            const startIndex = Math.min(selection.anchorOffset, selection.focusOffset);
            const endIndex = Math.max(selection.focusOffset, selection.anchorOffset);
            parseTextHTML($input.current.innerHTML)
            const children = $input.current.childNodes;
            start = children[startIndex];
            end = children[endIndex];
            span = start;
            
        } 
        // If the selection was done when the text was wrapped in a span
        else {
            const range = selection.getRangeAt(0);
            start = range.startContainer.parentElement;
            end = range.endContainer.parentElement;
            span = start;
        }

        do {
            // Toggle the style to the span
            if (span.style[command] === value) span.style[command] = ""
            else span.style[command] = value;

            // Move to the next sibling pointer
            span = span.nextSibling;
        } while (span && span.previousSibling !== end)
    }, [$input, $target]);

    const applyGeneralStyle = useCallback((command, value) => {
        // Toggle the style to the parent element
        if ($input.current.style[command] === value) {
            setTargetGeneralStyle(old => ({ ...old, [command]: "" }))
            $input.current.style[command] = ""
        }
        else {
            setTargetGeneralStyle(old => ({ ...old, [command]: value }))
            $input.current.style[command] = value
        }
    }, [$input, $target]);

    const parseTextHTML = (content) => {
        const currentHTML = content || $target.innerHTML
        // Im looking for a character that is not wrapped in a span so I can wrap it
        let parsedHTML = currentHTML
        // Replace the <b> with <span style="font-weight: bold">
        parsedHTML = parsedHTML.replaceAll(/<b>(.*?)<\/b>/ig, (match, cap) => cap.split("").map(char => `<span style="font-weight: bold">${char}</span>`).join(""))
        parsedHTML = parsedHTML.replaceAll(/<i>(.*?)<\/i>/ig, (match, cap) => cap.split("").map(char => `<span style="font-style: italic">${char}</span>`).join(""))
        parsedHTML = parsedHTML.replaceAll(/<u>(.*?)<\/u>/ig, (match, cap) => cap.split("").map(char => `<span style="text-decoration: underline">${char}</span>`).join(""))
        parsedHTML = parsedHTML.replaceAll(/(?:<span[^>]*>.*?<\/span>)|[\s\S]/ig, cap => cap.length === 1 ? `<span>${cap}</span>` : cap)
        $input.current.innerHTML = parsedHTML
    }

    const handleKeyDown = useCallback((e) => {
        if (e.key === "Enter") saveEdit()
        else if (e.key === "Escape") discardEdit()
        else if (e.ctrlKey && e.key === 'b') {
            e.preventDefault();
            applyStyle('fontWeight', 'bold');
        }
        else if (e.ctrlKey && e.key === 'i') {
            e.preventDefault();
            applyStyle('fontStyle', 'italic');
        }
        else if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            applyStyle('textDecoration', 'underline');
        }
    }, [saveEdit, discardEdit, applyStyle])

    useEffect(() => {
        // Handle keydown events
        

        $input.current.addEventListener("keydown", handleKeyDown)

        return () => {
            $input.current?.removeEventListener("keydown", handleKeyDown)
        }
    }, [saveEdit, discardEdit, applyStyle])

    // INITIAL SETUP
    useEffect(() => {
        // Get the computed style of the target element
        const compStyle = window.getComputedStyle($target)

        const eId = $target.getAttribute("data-eid")
        const sId = $target.getAttribute("data-sid")
        const $section = $target.closest("[data-element='section']")

        let x=0, y=0, width=0, height=0
        if ($section && eId){
            const { top, left } = $section.getBoundingClientRect()
            if (eId && sId) {
                const eData = state.sections[sId].elements[eId]
                x = left + eData.x
                y = top + eData.y
                width = eData.width
                height = eData.height
            }
        }
        else {
            const { left, top, width: targetWidth, height: targetHeight } = $target.getBoundingClientRect()
            x = left
            y = top
            width = targetWidth + 2
            height = targetHeight
        }

        // Set the style of the input field
        setStyle({
            top: y,
            left: x,
            width: width, // Add extra padding for because of the padding
            minHeight: height, // Add extra padding for because of the padding
            fontSize: compStyle.fontSize,
        })

        // Remove the initial wrap
        const content = $target.innerHTML.replace(/^<span[^>]*>([\s\S]+)<\/span>$/ig, "$1").replaceAll(/&nbsp;/g, " ")
        // Parse the HTML to ensure that every character is wrapped in a span
        if (props.type !== "text-raw") parseTextHTML(content)

        // Focus the input field
        $input.current.focus()

        // Select all text
        const range = document.createRange()
        range.selectNodeContents($input.current)
        const selection = window.getSelection()
        selection.removeAllRanges()
        selection.addRange(range)

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
        <div className={s.wrap} onContextMenu={e => e.stopPropagation()} onKeyDown={handleKeyDown} onClick={handleBlur}>
            <div className={s.wrap_inner} ref={$wrap} style={style}>
                {
                    props.type === "text" &&  // Only show the style menu for data-editable="text" (not for calligraphy: "text-raw")
                    <StyleEditMenu applyStyle={applyStyle}>
                        <StyleMenuButton icon={<IconBold />} command="fontWeight" value="bold" onClick={applyStyle} />
                        <StyleMenuButton icon={<IconItalic />} command="fontStyle" value="italic" onClick={applyStyle} />
                        <StyleMenuButton icon={<IconUnderline />} command="textDecoration" value="underline" onClick={applyStyle} />
                        <StyleMenuButton icon={<IconAlignLeft />} command="textAlign" value="start" onClick={applyGeneralStyle} />
                        <StyleMenuButton icon={<IconAlignCenter />} command="textAlign" value="center" onClick={applyGeneralStyle} />
                        <StyleMenuButton icon={<IconAlignRight />} command="textAlign" value="end" onClick={applyGeneralStyle} />
                        <StyleMenuColorPicker icon={<IconColorPalette />} command="color" onClick={applyStyle} $target={$target} />
                        <StyleMenuColorPicker icon={<IconTextBackground />} command="background" onClick={applyGeneralStyle} />
                        <StyleMenuButton icon={<IconFont />} command="fontFamily" value="scholar" onClick={applyStyle} />
                    </StyleEditMenu>
                }
                <div
                
                    contentEditable
                    ref={$input}
                    className={s.edit_field}
                    onChange={e => parseTextHTML(e.target.innerHTML)}
                />
            </div>
        </div>
    )
}

function StyleEditMenu({ children }) {

    return (
        <div className={s.style_menu_wrap}>
            <div className={s.style_menu}>
                {children}
            </div>
        </div>
    )
}

function StyleMenuButton({ icon, command, value, onClick }) {
    const handleClick = () => onClick(command, value)

    return (
        <button className={s.style_menu_button} onClick={handleClick}>
            {icon}
        </button>
    )
}


function StyleMenuColorPicker({ command, onClick, $target, icon }) {

    const [value, setValue] = useState("#000000")

    const handleChange = useCallback((e) => {
        const value = e.target.value
        setValue(value)
        onClick(command, value)
    }, [onClick, command])

    return (
        <div className={s.color_picker_wrap}>
            {icon}
            <input type="color" value={value} onChange={handleChange} className={s.color_picker_input}/>
        </div>
    )
}