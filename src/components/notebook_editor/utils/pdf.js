import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Generate a PDF document from an array of HTML pages.
 * 
 * @param {HTMLElement[]} pages - An array of HTML pages to convert to a PDF document.
 * @param {string} outname - The filename of the generated PDF document.
 */
export async function generatePDF(pages, outname = "document.pdf") {
    const pdf = new jsPDF('p', 'mm', 'a4'); // Create a new jsPDF instance with portrait orientation, millimeter units, and A4 page size
    const pdfWidth = pdf.internal.pageSize.getWidth(); // Get the width of the PDF page
    const options = {
        scale: 3, // Increase the scale to improve resolution
        useCORS: true, // Enable CORS to handle cross-origin images
        allowTaint: false // Do not allow tainted images
    };

    // Loop through each page (HTMLElement) in the pages array
    for (let i = 0; i < pages.length; i++) {
        const $page = pages[i]; // Get the current page (HTMLElement)

        // Ensure all images have the crossOrigin attribute set
        const images = $page.getElementsByTagName('img');
        for (let img of images) {
            img.setAttribute('crossOrigin', 'anonymous');
            if (!img.complete) {
                await new Promise((resolve) => {
                    img.onload = resolve;
                    img.onerror = resolve;
                });
            }
        }

        const canvas = await html2canvas($page, options); // Convert the current page to a canvas using html2canvas with the specified options
        const imgData = canvas.toDataURL('image/png'); // Get the image data URL of the canvas in PNG format
        const imgProps = pdf.getImageProperties(imgData); // Get the properties of the image (width and height)
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width; // Calculate the height of the image to maintain aspect ratio

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight); // Add the image to the PDF at position (0, 0) with the calculated width and height

        // If this is not the last page
        if (i < pages.length - 1) pdf.addPage();
    }

    pdf.save(outname); // Download the generated PDF with the filename specified
}