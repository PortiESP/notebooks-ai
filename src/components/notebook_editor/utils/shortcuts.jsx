import UserInput from "./user-input"

/**
 * Check if a combination of keys is pressed, and no other keys are pressed meanwhile.
 * 
 * The format of the string should be "<key>+<key>+...+<key>", where each key is a key code or alias.
 * 
 * @See {@link getKeysFromAlias} for the list of aliases.
 * 
 * @param {String} string The shortcut to be checked. It should be in the format: "Ctrl+Shift+Z"
 * @returns Boolean indicating if the shortcut is pressed
 */
export function checkShortcut(string){
    const keys = string.split("+")  // Split the string into an array of keys

    // Check if all the keys that should be pressed are pressed
    const allPressed = keys.every(key => {
        if (checkKey(key)) return true
    })

    // If not all the keys are pressed, return false
    if (!allPressed) return false

    // Check if the only keys pressed are the keys of the shortcut
    const validKeys = keys.map(key => getKeysFromAlias(key)).flat()  // Generate a list of keys that are valid/allowed
    // Iterate over all the keys
    for (const key in UserInput.pressedKeys){
        const isPressed = UserInput.pressedKeys[key] // Check if the key is pressed
        const includes = validKeys.includes(key)   // Check if the key is part of the valid keys list
        if (!includes && isPressed) return false   // If the key is not part of the valid keys list, and it is pressed, return false
    }

    // Otherwise,
    return true
}

/**
 * Check if a key is pressed.
 * 
 * The key can be a key code, or an alias for a group of keys.
 * 
 * @See {@link getKeysFromAlias} for the list of aliases.
 * 
 * @param {String} aliasOrKey The key code or alias to be checked
 * @returns Boolean indicating if the key is pressed
 */
export function checkKey(aliasOrKey){
    const keys = getKeysFromAlias(aliasOrKey)  // Get the list of aliases associated with the key
    return keys.some(key => UserInput.pressedKeys[key])  // Check if any of the aliases are pressed
}


/**
 * Get the list of keys associated with an alias.
 * 
 * The aliases are:
 * - "Control" for both left and right control keys.
 * - "Alt" for both left and right alt keys.
 * - "Shift" for both left and right shift keys.
 * - "Meta" for both left and right meta keys.
 * - "Arrow" for the arrow keys (Up, Down, Left, Right).
 * 
 * @param {String} code The alias to be checked
 * @returns Array of key codes associated with the alias
 */
function getKeysFromAlias(code){
    // Is digit: (1) -> [Digit1, Numpad1]
    if (code.match(/^\d$/)) return ["Digit"+code, "Numpad"+code]

    // Is letter: (a) -> [KeyA]
    if (code.match(/^[a-z]$/i)) return ["Key"+code.toUpperCase()]

    // Is special key
    switch(code.toLowerCase()){
        case "control": return ["ControlLeft", "ControlRight"]
        case "alt": return ["AltLeft", "AltRight"]
        case "shift": return ["ShiftLeft", "ShiftRight"]
        case "meta": return ["MetaLeft", "MetaRight"]
        case "arrow": return ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]
        default: return [code]
    }
}


/**
 * Get the shortcut of the pressed keys.
 * 
 * The shortcut is a string with the keys separated by "+".
 * 
 * @returns {String} The shortcut of the pressed keys
 */
export function getPressedShortcut(){
    let shortcut = []
    if (UserInput.pressedKeys["ControlLeft"] || UserInput.pressedKeys["ControlRight"]) shortcut.push("control")
    if (UserInput.pressedKeys["AltLeft"] || UserInput.pressedKeys["AltRight"]) shortcut.push("alt")
    if (UserInput.pressedKeys["ShiftLeft"] || UserInput.pressedKeys["ShiftRight"]) shortcut.push("shift")
    if (UserInput.pressedKeys["MetaLeft"] || UserInput.pressedKeys["MetaRight"]) shortcut.push("meta")
        
    const keys = Object.keys(UserInput.pressedKeys).sort().filter(key => UserInput.pressedKeys[key] && !key.match(/(control|alt|shift|meta)/i)).map(key => getKeyFromCode(key))
    shortcut = shortcut.concat(keys)

    return shortcut.join("+")
}
    

/**
 * Get the key from a key code. This will merge the left and right keys into a single key, for example, "ControlLeft" and "ControlRight" will be converted to "control".
 * 
 * @param {String} code The key code to be converted
 * @returns {String} The key
 */
export function getKeyFromCode(code){
    switch(code){
        case "ControlLeft" || "ControlRight": return "control"
        case "AltLeft" || "AltRight": return "alt"
        case "ShiftLeft" || "ShiftRight": return "shift"
        case "MetaLeft" || "MetaRight": return "meta"
    }

    const key = code.replace(/(key|digit|numpad)/i, "").toLowerCase()
    return key
}


/**
 * Handle a shortcut.
 * 
 * The shortcuts are a dictionary where the key is the shortcut and the value is the callback function.
 * 
 * The callback function will receive the key that was pressed.
 * 
 * @param {Object} SHORTCUTS The dictionary of shortcuts
 * @returns {Boolean} True if a shortcut was handled, false otherwise
 */
export function useHandleShortcut(SHORTCUTS){
    const shortcut = getPressedShortcut()
    const shortcutCallback = SHORTCUTS[shortcut]

    if (window.debug) console.log(`Shortcut [${shortcut}] down key ${shortcutCallback ? "DEFINED": "NOT DEFINED"}`)

    if (shortcutCallback) {
        shortcutCallback()
        return true
    }

    return false
}