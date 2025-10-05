import * as pdfjsLib from "pdfjs-dist"

// Worker configuration
if (typeof window !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdfjs.worker.min.mjs";
}

export default pdfjsLib;