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
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        const selectedText = range.toString();
        const index = $target.innerText.indexOf(selectedText);
        const children = $input.current.childNodes;  // The first child is the RichText component, then goes the character spans

        let i = 0;
        for (let char of selectedText) {

            const span = children[index + i++]

            switch (command) {
                case 'bold':
                    span.style.fontWeight = 'bold';
                    break;
                case 'italic':
                    span.style.fontStyle = 'italic';
                    break;
                case 'underline':
                    span.style.textDecoration = 'underline';
                    break;
                case 'foreColor':
                    span.style.color = value;
                    break;
                case 'fontName':
                    span.style.fontFamily = value;
                    break;
                default:
                    break;
            }
        }
    }, [$input, $target]);

    // INITIAL SETUP
    useEffect(() => {
        // Get the computed style of the target element
        const compStyle = window.getComputedStyle($target)
        const { x, y, width, height } = props.eBbox

        // Set the style of the input field
        setStyle({
            top: y - INPUT_OFFSET,
            left: x - INPUT_OFFSET,
            width: width + INPUT_OFFSET * 4, // Add extra padding for because of the padding
            height: height + INPUT_OFFSET * 2,
            fontSize: compStyle.fontSize,
        })

        // Set the initial value of the input field
        const currentHTML = $target.innerHTML
        let parsedHTML = currentHTML.replace(/^<span[^>]*>([\s\S]+)<\/span>$/ig, "$1")
        const hasNestedSpans = parsedHTML.match(/<span[^>]*>[\s\S]+<\/span>/ig)

        // Wrap each character in a span, only for data-editable="text" (not for calligraphy: "text-raw")
        if (!hasNestedSpans && props.type === "text") {
            const chars = parsedHTML.split('')
            const spannedChars = chars.map(char => `<span>${char}</span>`)
            parsedHTML = spannedChars.join('')
        }

        // Set the parsed HTML
        $input.current.innerHTML = parsedHTML

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
                applyStyle('bold');
            }
            else if (e.ctrlKey && e.key === 'i') {
                e.preventDefault();
                applyStyle('italic');
            }
            else if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
                applyStyle('underline');
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
                    <StyleMenuButton icon="B" command="bold" onClick={applyStyle} />
                    <StyleMenuButton icon="I" command="italic" onClick={applyStyle} />
                    <StyleMenuButton icon="U" command="underline" onClick={applyStyle} />
                    <StyleMenuColorPicker icon="Color" command="foreColor" onClick={applyStyle} $target={$target} />
                    <StyleMenuButton icon="Font" command="fontName" value="Arial" onClick={applyStyle} />
                </StyleEditMenu>
            }
            <div
                contentEditable
                ref={$input}
                className={s.edit_field}
                onBlur={handleBlur}
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