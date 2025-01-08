import React, { useCallback, useState, useEffect, useRef } from 'react'
import s from './edit_text.module.scss'
import UserInput from '../../../utils/user-input'

const INPUT_OFFSET = 5

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

    const saveEdit = useCallback(() => {
        const parsedHTML = $input.current.innerHTML.replace(/<br>/ig, "")
        console.log("Parsed HTML:", parsedHTML)
        props.setValue(parsedHTML)
        props.close()
    }, [props])

    const discardEdit = useCallback(() => {
        props.close()
    }, [props])

    const handleBlur = useCallback((e) => {
        if ($wrap.current.contains(UserInput.hoveredElement)) return
        saveEdit()
    }, [discardEdit, saveEdit])

    const applyStyle = useCallback((command, value = null) => {

        if (!command) {
            console.error('No command provided');
            return;
        }

        const selection = document.getSelection();
        // Selected text
        const substr = selection.toString();
        // If no text was selected, return
        if (!substr.length) return;

        const needsWrap = selection.anchorNode.data.length > 1

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

    const parseTextHTML = (content) => {
        const currentHTML = content || $target.innerHTML
        // Im looking for a character that is not wrapped in a span so I can wrap it
        const parsedHTML = currentHTML.replaceAll(/(?:<span[^>]*>.*?<\/span>)|[\s\S]/ig, cap => cap.length === 1 ? `<span>${cap}</span>` : cap)
        $input.current.innerHTML = parsedHTML
    }

    // INITIAL SETUP
    useEffect(() => {
        // Get the computed style of the target element
        const compStyle = window.getComputedStyle($target)
        const { x, y, width, height } = props.eBbox

        // Set the style of the input field
        setStyle({
            top: y - INPUT_OFFSET,
            left: x - INPUT_OFFSET,
            width: width + INPUT_OFFSET * 4 + 5, // Add extra padding for because of the padding
            height: height + INPUT_OFFSET * 2,
            fontSize: compStyle.fontSize,
        })

        // Remove the initial wrap
        const content = $target.innerHTML.replace(/^<span[^>]*>([\s\S]+)<\/span>$/ig, "$1")
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

        // Handle keydown events
        const handleKeyDown = (e) => {
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
        }

        $input.current.addEventListener("keydown", handleKeyDown)

        return () => {
            $input.current?.removeEventListener("keydown", handleKeyDown)
        }
    }, [])

    return (
        <div className={s.wrap} style={style} ref={$wrap}>
            {
                props.type === "text" &&  // Only show the style menu for data-editable="text" (not for calligraphy: "text-raw")
                <StyleEditMenu applyStyle={applyStyle}>
                    <StyleMenuButton icon="B" command="fontWeight" value="bold" onClick={applyStyle} />
                    <StyleMenuButton icon="I" command="fontStyle" value="italic" onClick={applyStyle} />
                    <StyleMenuButton icon="U" command="textDecoration" value="underline" onClick={applyStyle} />
                    <StyleMenuColorPicker icon="Color" command="color" onClick={applyStyle} $target={$target} />
                    <StyleMenuButton icon="Font" command="fontFamily" value="Arial" onClick={applyStyle} />
                </StyleEditMenu>
            }
            <div
                contentEditable
                ref={$input}
                className={s.edit_field}
                onBlur={handleBlur}
                onChange={e => parseTextHTML(e.target.innerHTML)}
            />
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


function StyleMenuColorPicker({ command, onClick, $target }) {

    const [value, setValue] = useState("#000000")

    const handleChange = useCallback((e) => {
        const substr = getSelection().toString()
        const i0 = $target.innerText.indexOf(substr)
        const i1 = i0 + substr.length

        const value = e.target.value
        setValue(value)
        onClick(command, value, [i0, i1])
    }, [onClick, command])

    return (
        <div>
            <input type="color" value={value} onChange={handleChange} />
        </div>
    )
}