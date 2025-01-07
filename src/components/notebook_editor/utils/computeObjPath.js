/**
 * Retrieves the value at the specified path of an object.
 * @param {Object} obj - The object to query.
 * @param {string} path - The path of the property to get.
 * @returns {*} - Returns the value at the specified path.
 */
export function getComputeObjPath(obj, path) {
    // !!! Event though `obj` is not used, it is necessary to pass it as an argument to the function in order to access it in the eval statement.

    // Use eval to dynamically access the property at the given path
    return eval(`obj.${path}`);
}

/**
 * Sets the value at the specified path of an object.
 * @param {Object} obj - The object to modify.
 * @param {string} path - The path of the property to set.
 * @param {*} value - The value to set.
 */
export function setComputeObjPath(obj, path, value) {
    // !!! Event though `obj` and `value` are not used, they are necessary to pass them as arguments to the function in order to access them in the eval statement.

    // Use eval to dynamically set the property at the given path
    eval(`obj.${path} = value`);
}

/**
 * Checks if the specified path is valid in the object.
 * @param {Object} obj - The object to query.
 * @param {string} path - The path to check.
 * @returns {boolean} - Returns true if the path is valid, else false.
 */
export function isPathValid(obj, path) {
    // !!! Event though `obj` is not used, it is necessary to pass it as an argument to the function in order to access it in the eval statement.

    try {
        // Use eval to check if the property at the given path exists
        eval(`obj.${path}`);
        return true;
    } catch (e) {
        // If an error is thrown, the path is not valid
        return false;
    }
}