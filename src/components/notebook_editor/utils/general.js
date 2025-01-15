// Generate a UUID
export function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


export function clamp(min, value, max) {
    return Math.min(Math.max(value, min), max)
}

// Remove the "_" from the beginning of every key in an object
export function private2public(obj) {
    const newObj = {}
    for (const key in obj) {
        newObj[key.replace(/^_/, "")] = obj[key]
    }
    return newObj
}


/**
 * Creates a debounced function that delays invoking the provided function until after a specified wait time has elapsed
 * since the last time the debounced function was invoked. 
 *
 * @param {Function} func - The function to debounce.
 * @param {number} wait - The number of milliseconds to delay.
 * @returns {Function} - Returns the new debounced function.
 */
export function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        const later = () => {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
