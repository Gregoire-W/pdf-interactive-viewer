import * as pdfjsLib from "pdfjs-dist"

console.log("loading pdfjsLib from pdf-config.ts");

// Worker configuration
if (typeof window !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
}

export default pdfjsLib;