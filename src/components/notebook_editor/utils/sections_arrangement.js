
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
    sections = order.map(id => {
        if (!sections[id]) throw new Error(`Section with id ${id} not found in the order array`)
        return sections[id]
    })

    // A4 dimensions
    const PAGE_HEIGHT = 970

    // Arrange sections by page
    const sectionsByPage = { 1: [] }
    let currentPage = 1
    let currentHeight = 0

    // Loop through each section
    for (const section of sections) {
        // Get the height of the section
        const sectionHeight = section.height  // In px

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