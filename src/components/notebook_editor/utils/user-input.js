/**
 * UserInput class that stores the mouse data such as cursor position, hovered element, last click, dragging data, etc.
 * 
 * UserInput is static, so it can be used without creating an instance of the class. But it needs to be started and stopped using the start() and stop() methods.
 * 
 * @class UserInput
 * 
 * @property {boolean} _eventsReady - Indicates if the mouse events are already added.
 * @property {number} _x - The x-coordinate of the cursor.
 * @property {number} _y - The y-coordinate of the cursor.
 * @property {Element} _hoveredElement - The element currently being hovered by the cursor.
 * @property {Element} _doubleClickedElement - The element that was double-clicked.
 * @property {Object} _lastClick - The data of the last click event.
 * @property {boolean} _isDragging - Indicates if an element is being dragged.
 * @property {Object} _dragData - The data of the element being dragged.
 * @property {Object} _onDragStart - The callbacks to be called when dragging starts.
 * @property {Object} _onDrag - The callbacks to be called while dragging.
 * @property {Object} _onDragEnd - The callbacks to be called when dragging ends.
 * @property {Object} _onDoubleClick - The callbacks to be called when an element is double-clicked.
 * 
 * @method start - Starts listening to mouse events.
 * @method stop - Stops listening to mouse events.
 * @method addOnDrag - Adds a callback to be called while dragging.
 * @method removeOnDrag - Removes a callback from the onDrag callbacks.
 * @method updateLastPos - Updates the last position of the dragging element.
 * @method addOnDragStart - Adds a callback to be called when dragging starts.
 * @method removeOnDragStart - Removes a callback from the onDragStart callbacks.
 * @method addOnDragEnd - Adds a callback to be called when dragging ends.
 * @method removeOnDragEnd - Removes a callback from the onDragEnd callbacks.
 * @method addOnDoubleClick - Adds a callback to be called when an element is double-clicked.
 * @method removeOnDoubleClick - Removes a callback from the onDoubleClick callbacks.
 * 
 * @example
 * UserInput.start()
 * UserInput.addOnDrag('id', (data, e) => {
 *    console.log(data)
 * })
 */
export default class UserInput {
    // Init
    static _eventsReady = false  // Indicates if the mouse events are already added

    // ================================[ Mouse ]================================

    // Cursor data
    static _x = undefined  // The x-coordinate of the cursor
    static _y = undefined  // The y-coordinate of the cursor
    static _hoveredElement = undefined  // The element currently being hovered by the cursor
    static _doubleClickedElement = undefined  // The element that was double-clicked

    // Click data
    static _lastClick = {  // The data of the last click event
        x: undefined,  // The x-coordinate of the click
        y: undefined,  // The y-coordinate of the click
        $target: undefined  // The element that was clicked
    }

    // Dragging data
    static _isDragging = false  // Indicates if an element is being dragged
    static _dragData = {  // The data of the element being dragged
        from: { x: undefined, y: undefined },  // The coordinates where the dragging started (where the mouse was pressed down)
        lastPos: { x: undefined, y: undefined },  // The last position of the dragging element
        $target: undefined,  // The element that was clicked when dragging started
        startConditions: {}  // Variable to store the start conditions of the dragging element (use the onDragStart callback to set this)
        /* The following properties are added by the dragData getter */
        // dx: undefined,  // The change in x-coordinate since the last mousemove event
        // dy: undefined,  // The change in y-coordinate since the last mousemove event
        // totalX: undefined,  // The total change in x-coordinate since the dragging started
        // totalY: undefined  // The total change in y-coordinate since the dragging started
    }

    // Callbacks
    static _onDragStart = {}  // The callbacks to be called when dragging starts
    static _onDrag = {}  // The callbacks to be called on each mousemove event while dragging
    static _onDragEnd = {}  // The callbacks to be called when dragging ends
    static _onDoubleClick = {}  // The callbacks to be called when an element is double-clicked


    // ================================[ Keyboard ]================================

    // Keyboard data
    static _lastKey = undefined  // The last key that was pressed
    static _pressedKeys = {}  // The keys that are currently pressed
    static _pressedKeysStack = []  // The stack of keys that are currently pressed

    // Callbacks
    static _onKeyDown = {}  // The callbacks to be called when a key is pressed
    static _onKeyUp = {}  // The callbacks to be called when a key is released

    // ================================[ Public methods ]================================

    /**
     * Starts listening to mouse events. !!! ONLY CALL THIS ONCE IN THE APP !!!
     */
    static start() {
        // Check if the events are already added
        if (UserInput.eventsReady) return

        window.addEventListener('mousemove', UserInput._handleMousemove)
        window.addEventListener('click', UserInput._handleClick)
        window.addEventListener('mousedown', UserInput._handleMousedown)
        window.addEventListener('mouseup', UserInput._handleMouseup)
        window.addEventListener('dblclick', UserInput._handleDoubleClick)
        window.addEventListener('keydown', UserInput._handleKeyDown)
        window.addEventListener('keyup', UserInput._handleKeyUp)
        // When the window loses focus, reset states
        window.addEventListener('blur', this._handleBlur)

        UserInput.eventsReady = true
    }

    /**
     * Stops listening to mouse events.
     */
    static stop() {
        window.removeEventListener('mousemove', UserInput._handleMousemove)
        window.removeEventListener('click', UserInput._handleClick)
        window.removeEventListener('mousedown', UserInput._handleMousedown)
        window.removeEventListener('mouseup', UserInput._handleMouseup)
        window.removeEventListener('dblclick', UserInput._handleDoubleClick)
        window.removeEventListener('keydown', UserInput._handleKeyDown)
        window.removeEventListener('keyup', UserInput._handleKeyUp)
        window.removeEventListener('blur', this._handleBlur)

        UserInput.eventsReady = false
    }

    /**
     * Adds a callback to be called while dragging.
     * 
     * @param {string} id - The ID of the callback.
     * @param {Function} cb - The callback function.
     */
    static addOnDrag(id, cb) {
        UserInput._onDrag[id] = cb
    }

    /**
 * Removes a callback from the onDrag callbacks.
 * 
 * @param {string} id - The ID of the callback.
 * @returns {void}
 */
    static removeOnDrag(id) {
        delete UserInput._onDrag[id];
    }

    /**
     * Updates the last known position of the mouse.
     * 
     * @returns {void}
     */
    static updateLastPos() {
        UserInput._dragData.lastPos = { x: UserInput.x, y: UserInput.y };
    }

    /**
     * Adds a callback to be executed when dragging starts.
     * 
     * @param {string} id - The ID of the callback.
     * @param {Function} cb - The callback function.
     * @returns {void}
     */
    static addOnDragStart(id, cb) {
        UserInput._onDragStart[id] = cb;
    }

    /**
     * Removes a callback from the onDragStart callbacks.
     * 
     * @param {string} id - The ID of the callback.
     * @returns {void}
     */
    static removeOnDragStart(id) {
        delete UserInput._onDragStart[id];
    }

    /**
     * Adds a callback to be executed when dragging ends.
     * 
     * @param {string} id - The ID of the callback.
     * @param {Function} cb - The callback function.
     * @returns {void}
     */
    static addOnDragEnd(id, cb) {
        UserInput._onDragEnd[id] = cb;
    }

    /**
     * Removes a callback from the onDragEnd callbacks.
     * 
     * @param {string} id - The ID of the callback.
     * @returns {void}
     */
    static removeOnDragEnd(id) {
        delete UserInput._onDragEnd[id];
    }

    /**
     * Adds a callback to be executed on double-click.
     * 
     * @param {string} id - The ID of the callback.
     * @param {Function} cb - The callback function.
     * @returns {void}
     */
    static addOnDoubleClick(id, cb) {
        UserInput._onDoubleClick[id] = cb;
    }

    /**
     * Removes a callback from the onDoubleClick callbacks.
     * 
     * @param {string} id - The ID of the callback.
     * @returns {void}
     */
    static removeOnDoubleClick(id) {
        delete UserInput._onDoubleClick[id];
    }

    /**
     * Adds a callback to be executed when a key is pressed.
     * 
     * @param {string} key - The key to listen to.
     * @param {Function} cb - The callback function.
     * @returns {void}
     */
    static addOnKeyDown(key, cb) {
        if (!UserInput._onKeyDown[key]) UserInput._onKeyDown[key] = []
        UserInput._onKeyDown[key].push(cb)
    }

    /**
     * Removes a callback from the onKeyDown callbacks.
     * 
     * @param {string} key - The key to remove the callback from.
     * @param {Function} cb - The callback function.
     * @returns {void}
     */
    static removeOnKeyDown(key, cb) {
        if (!UserInput._onKeyDown[key]) return
        UserInput._onKeyDown[key] = UserInput._onKeyDown[key].filter(fn => fn !== cb)
    }

    // ================================[ Private methods ]================================
    static _handleMousemove(e) {
        // Update cursor data
        UserInput._x = e.clientX
        UserInput._y = e.clientY
        UserInput._hoveredElement = e.target

        // Update dragging data
        if (UserInput.isDragging) {
            const data = UserInput.dragData
            Object.values(UserInput.onDrag).forEach(cb => cb(data, e))
        }
    }

    static _handleClick(e) {
        UserInput._lastClick = {
            x: e.clientX,
            y: e.clientY,
            $target: e.target
        }
    }

    static _handleMousedown(e) {
        UserInput._isDragging = true
        UserInput._dragData = {
            from: { x: e.clientX, y: e.clientY },
            lastPos: { x: e.clientX, y: e.clientY },
            $target: e.target,
            startConditions: {}
        }

        // Call onDragStart callbacks
        Object.values(UserInput._onDragStart).forEach(cb => cb(UserInput._dragData))
    }

    static _handleMouseup(e) {
        UserInput._isDragging = false

        // Call onDragEnd callbacks
        Object.values(UserInput._onDragEnd).forEach(cb => cb(UserInput._dragData))
    }

    static _handleDoubleClick(e) {
        UserInput._doubleClickedElement = e.target

        // Call onDoubleClick callbacks
        Object.values(UserInput._onDoubleClick).forEach(cb => cb(e))
    }

    static _handleKeyDown(e) {
        const key = e.code
        UserInput._lastKey = key
        UserInput._pressedKeys[key] = true
        UserInput._pressedKeysStack.push(key)

        // Call onKeyDown callbacks
        UserInput._onKeyDown[key]?.forEach(cb => cb(e))
    }

    static _handleKeyUp(e) {
        const key = e.code
        UserInput._pressedKeys[key] = false
        UserInput._pressedKeysStack = UserInput._pressedKeysStack.filter(key => key !== key)

        // Call onKeyUp callbacks
        UserInput._onKeyUp[key]?.forEach(cb => cb(e))
    }

    static _handleBlur() {
        // Reset states
        UserInput._isDragging = false
        UserInput._pressedKeys = {}
        UserInput._pressedKeysStack = []
    }

    // ================================[ Getters & Setters ]================================
    static get eventsReady() {
        return UserInput._eventsReady
    }
    static set eventsReady(value) {
        UserInput._eventsReady = value
    }

    static get x() {
        return UserInput._x
    }
    static set x(value) {
        UserInput._x = value
    }

    static get y() {
        return UserInput._y
    }
    static set y(value) {
        UserInput._y = value
    }

    static get hoveredElement() {
        return UserInput._hoveredElement
    }
    static set hoveredElement(value) {
        UserInput._hoveredElement = value
    }

    static get lastClick() {
        return UserInput._lastClick
    }

    static get isDragging() {
        return UserInput._isDragging
    }
    static set isDragging(value) {
        UserInput._isDragging = value
    }

    static get dragData() {
        const newData = {
            ...UserInput._dragData,
            dx: UserInput.x - UserInput._dragData.lastPos.x,
            dy: UserInput.y - UserInput._dragData.lastPos.y,
            totalX: UserInput.x - UserInput._dragData.from.x,
            totalY: UserInput.y - UserInput._dragData.from.y
        }

        this.updateLastPos()

        return newData
    }
    static set dragData(value) {
        UserInput._dragData = value
    }

    static get onDrag() {
        return UserInput._onDrag
    }
    static set onDrag(value) {
        UserInput._onDrag = value
    }

    static get onDragStart() {
        return UserInput._onDragStart
    }
    static set onDragStart(value) {
        UserInput._onDragStart = value
    }

    static get onDragEnd() {
        return UserInput._onDragEnd
    }
    static set onDragEnd(value) {
        UserInput._onDragEnd = value
    }

    static get onDoubleClick() {
        return UserInput._onDoubleClick
    }
    static set onDoubleClick(value) {
        UserInput._onDoubleClick = value
    }

    static get lastKey() {
        return UserInput._lastKey
    }
    static set lastKey(value) {
        UserInput._lastKey = value
    }

    static get pressedKeys() {
        return UserInput._pressedKeys
    }
    static set pressedKeys(value) {
        UserInput._pressedKeys = value
    }

    static get pressedKeysStack() {
        return UserInput._pressedKeysStack
    }
    static set pressedKeysStack(value) {
        UserInput._pressedKeysStack = value
    }

    static get onKeyDown() {
        return UserInput._onKeyDown
    }
    static set onKeyDown(value) {
        UserInput._onKeyDown = value
    }

    static get onKeyUp() {
        return UserInput._onKeyUp
    }
    static set onKeyUp(value) {
        UserInput._onKeyUp = value
    }

}