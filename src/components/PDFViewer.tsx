"use client";

import { useEffect, useState, useRef } from "react";
import { type TextContent } from "pdfjs-dist/types/src/display/api";
import { PageViewport } from "pdfjs-dist";
import pdfjsLib from "@/lib/pdf-config";
import { PDFFile } from './PDFDropzone'

interface PDFViewerProps {
    file: PDFFile;
}

export default function PDFViewer({ file }: PDFViewerProps) {

    const [textContent, setTextContent] = useState<TextContent | null>(null);
    const [scale, setScale] = useState<number>(1);
    const [viewport, setViewport] = useState<PageViewport | null>(null);
    const canvasContainerRef = useRef<HTMLDivElement | null>(null);
    const [fonts, setFonts] = useState<Map<string, string>>(new Map());

    const formatTextContent = (textContent: TextContent, scale: number): void => {
        textContent.items = textContent.items.filter((item) => {
            if ("str" in item) {
                if (item.str === " ") {
                    const estimatedWidth = item.width * scale;
                    const fontSizePx = Math.abs(item.transform[3]) * scale;
                    const ratio = estimatedWidth / fontSizePx;
                    return ratio < 2
                }
                return true;
            }
        });
    }

    const isBoldFont = (fontName: string): boolean => {
        return fontName.toLowerCase().includes("bold");
    }

    const isItalicFont = (fontName: string): boolean => {
        return fontName.toLowerCase().includes("italic");
    }

    useEffect(() => {
        let resizeTimeout: NodeJS.Timeout;

        const loadPDF = async () => {
            if (canvasContainerRef.current && file) {
                // Create blob URL from user's file
                const fileUrl = URL.createObjectURL(file.file);

                try {
                    const pdf = await pdfjsLib.getDocument(fileUrl).promise;
                    const page = await pdf.getPage(1);

                    // Extract original font name
                    await page.getOperatorList();
                    const extractedFonts = new Map<string, string>();
                    for (const [idx, data] of page.commonObjs) {
                        extractedFonts.set(data.loadedName, data.name);
                    }
                    setFonts(extractedFonts);
                    console.log("Extracted fonts:", extractedFonts);

                    // Load text content into state
                    const textContent = await page.getTextContent();
                    formatTextContent(textContent, scale);
                    setTextContent(textContent);

                    // Render the page into a canvas
                    const { width } = canvasContainerRef.current.getBoundingClientRect();
                    const targetWidth = width * 0.98;
                    const canvas = document.createElement("canvas");
                    const context = canvas.getContext("2d");
                    const computeScale = targetWidth / page.getViewport({ scale: 1 }).width;
                    setScale(computeScale);
                    const viewport = page.getViewport({ scale: computeScale });
                    setViewport(viewport);
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                    if (context) {
                        const renderContext = {
                            canvasContext: context,
                            canvas: canvas,
                            viewport: viewport
                        };
                        await page.render(renderContext).promise;

                        canvasContainerRef.current.innerHTML = "";
                        canvasContainerRef.current.appendChild(canvas);
                    }
                } catch (error) {
                    console.error("Error loading PDF:", error);
                } finally {
                    // Clean up the blob URL to free memory
                    URL.revokeObjectURL(fileUrl);
                }
            }
        }

        // Initial PDF load
        loadPDF();

        // Setup ResizeObserver for container size changes
        if (canvasContainerRef.current && file) {
            const handleResize = () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    loadPDF();
                }, 500);
            };

            const resizeObserver = new ResizeObserver(handleResize);
            resizeObserver.observe(canvasContainerRef.current);

            return () => {
                clearTimeout(resizeTimeout);
                resizeObserver.disconnect();
            };
        }

    }, [file])

    // Measure text dimensions to ensure proper rendering
    const measureCanvas = useRef<HTMLCanvasElement | null>(null);
    if (!measureCanvas.current) {
        measureCanvas.current = document.createElement('canvas');
    }
    const measureCtx = measureCanvas.current.getContext('2d');

    return (

        <div className="size-full relative">
            <div className="size-full" ref={canvasContainerRef}>
            </div>
            {viewport && textContent && (
                <div
                    className="text-transparent selection:bg-primary opacity-30 pdf-text-layer"
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: viewport.width + "px",
                        height: viewport.height + "px",
                        whiteSpace: 'pre',
                        lineHeight: "1",
                    }}
                >
                    {
                        measureCtx && textContent.items.map((item, index) => {
                            if ("str" in item) {
                                // TypeScript comprend ici que item est un TextItem
                                const [a, b, c, d, e, f] = item.transform;
                                const fontHeight = Math.sqrt(a * a + b * b); // hauteur réelle avec rotation
                                const fontSizePx = fontHeight * scale;

                                // Position de la baseline (pdf.js utilise directement f)
                                const x = e * scale;
                                const y = viewport.height - (f * scale);

                                // Ajustement de la baseline (pdf.js utilise ~0.8 pour sans-serif)
                                const baselineOffset = fontSizePx * 0.8

                                // configurer le contexte de mesure avec la même police / taille
                                measureCtx.font = `${fontSizePx}px sans-serif`;
                                const measuredWidth = measureCtx.measureText(item.str).width; // largeur du texte rendu
                                const estimatedWidth = item.width * scale; // largeur estimée
                                const scaleX = measuredWidth > 0 ? (estimatedWidth / measuredWidth) : 1;

                                return (
                                    <span
                                        style={{
                                            position: 'absolute',
                                            left: `${x}px`,
                                            top: `${y - baselineOffset}px`,
                                            fontSize: `${fontSizePx}px`,
                                            fontFamily: 'sans-serif',
                                            transform: `scaleX(${scaleX})`,
                                            transformOrigin: 'left top',
                                        }}
                                        key={index}
                                        data-is-bold={isBoldFont(fonts.get(item.fontName) || item.fontName)}
                                        data-is-italic={isItalicFont(fonts.get(item.fontName) || item.fontName)}
                                        data-font-size={Math.abs(item.transform[3])}
                                    >
                                        {item.str}
                                    </span>
                                );
                            }
                        })
                    }
                </div>
            )}
        </div>

    )

}