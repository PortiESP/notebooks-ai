/**
 * Deep clone an object.
 * 
 * This function will deep clone an object, meaning that it will create a new object with the same properties as the original object, and will recursively clone any objects that are properties of the original object.
 * 
 * @param {Object} obj - The object to clone.
 * @returns {Object} The cloned object.
 */
export function deepClone(obj) {
    // If the object is null or not an object (e.g. a string, number, etc.), return the object as is.
    if (obj === null || typeof obj !== 'object') return obj
    // If the object is an array, map over the array and recursively call deepClone on each element.
    if (Array.isArray(obj)) return obj.map(deepClone)

    // If the obj is a class with a clone method, call the clone method.
    if (obj.clone && typeof obj.clone === 'function') return obj.clone()

    // In all other cases, create a new object and recursively call deepClone on each property of the object.
    const clonedObj = {}
    for (const key in obj) 
        // Check if the object has the property directly on itself (and not on its prototype chain).
        if (obj.hasOwnProperty(key)) 
            clonedObj[key] = deepClone(obj[key])

    return clonedObj
}
