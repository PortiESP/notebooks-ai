
/**
 * Arrange sections in pages
 * 
 * @param {Object} sections - An object containing the sections to arrange
 * @returns {Object} - An object containing the sections arranged by page
 * 
 * @example
 * const sections = {
 *     1: [ { id: "section-1", ... }, ... ],
 *     2: [ { id: "section-5", ... }, ... ]
 * }
 */
export default function arrangeSections(sections, order) {
    sections = order.map(id => sections[id])

    // A4 dimensions
    const PAGE_HEIGHT = 297 - 20 * 2  // 20mm margin top and bottom

    // Arrange sections by page
    const sectionsByPage = { 1: [] }
    let currentPage = 1
    let currentHeight = 0

    // Loop through each section
    for (const section of sections) {
        // Get the height of the section
        const sectionHeight = section.height  // In mm

        // If the section does not fit in the current page, update the current page pointer
        if (currentHeight + sectionHeight > PAGE_HEIGHT) {
            currentPage++
            currentHeight = 0
            sectionsByPage[currentPage] = []
        }

        // Add the section to the current page
        sectionsByPage[currentPage].push(section.id)
        currentHeight += sectionHeight
    }

    return sectionsByPage
}