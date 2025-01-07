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