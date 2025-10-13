'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
    ArrowLeft,
    Highlighter,
    Underline,
    Type,
    MousePointer,
} from 'lucide-react'
import { PDFFile } from './PDFDropzone'
import dynamic from 'next/dynamic'

const PDFViewer = dynamic(() => import("./PDFViewer"), { ssr: false });

interface InteractionTool {
    icon: React.ReactNode
    title: string
    description: string
    action: string
    color: string
    execute: () => void
    cleanup?: () => void
}

interface PDFInteractionViewProps {
    pdfFile: PDFFile | null
    onBack: () => void
}

export default function PDFInteractionView({ pdfFile, onBack }: PDFInteractionViewProps) {
    const [activeTool, setActiveTool] = useState<InteractionTool | null>(null)
    const [showFontsPanel, setShowFontsPanel] = useState(false)
    const [fontStyles, setFontStyles] = useState<Map<string, string>>(new Map())

    if (!pdfFile) return null

    const handleToolClick = (tool: InteractionTool) => {
        if (activeTool?.action === tool.action) {
            // Si l'outil est déjà actif, le désactiver et nettoyer
            activeTool.cleanup?.();
            setActiveTool(null)
        } else {
            // Nettoyer l'outil précédent s'il existe
            activeTool?.cleanup?.();
            // Activer ce nouvel outil et exécuter sa fonction
            setActiveTool(tool);
            tool.execute();
        }
    }

    const interactionTools: InteractionTool[] = [
        {
            icon: <Highlighter className="h-4 w-4" />,
            title: "Highlight Bold Text",
            description: "Automatically highlight all bold text",
            action: "highlight-bold",
            color: "bg-yellow-100 text-yellow-800",
            execute: () => {
                const pdfContainer = document.querySelector('.pdf-text-layer');
                const boldSpans = pdfContainer?.querySelectorAll('span[data-is-bold="true"]');
                boldSpans?.forEach(span => {
                    (span as HTMLElement).style.backgroundColor = 'yellow';
                    (span as HTMLElement).style.opacity = '0.7';
                });
            },
            cleanup: () => {
                const pdfContainer = document.querySelector('.pdf-text-layer');
                const allSpans = pdfContainer?.querySelectorAll('span');
                allSpans?.forEach(span => {
                    (span as HTMLElement).style.backgroundColor = '';
                    (span as HTMLElement).style.opacity = '';
                });
            }
        },
        {
            icon: <Type className="h-4 w-4" />,
            title: "Highlight Italic Text",
            description: "Automatically highlight all italic text",
            action: "highlight-italic",
            color: "bg-purple-100 text-purple-800",
            execute: () => {
                const pdfContainer = document.querySelector('.pdf-text-layer');
                const italicSpans = pdfContainer?.querySelectorAll('span[data-is-italic="true"]');
                italicSpans?.forEach(span => {
                    (span as HTMLElement).style.backgroundColor = 'purple';
                    (span as HTMLElement).style.opacity = '0.7';
                });
            },
            cleanup: () => {
                const pdfContainer = document.querySelector('.pdf-text-layer');
                const allSpans = pdfContainer?.querySelectorAll('span');
                allSpans?.forEach(span => {
                    (span as HTMLElement).style.backgroundColor = '';
                    (span as HTMLElement).style.opacity = '';
                });
            }
        },
        {
            icon: <Underline className="h-4 w-4" />,
            title: "Underline Large Text",
            description: "Underline text over 14px font size",
            action: "underline-large",
            color: "bg-blue-100 text-blue-800",
            execute: () => {
                const pdfContainer = document.querySelector('.pdf-text-layer');
                const largeSpans = pdfContainer?.querySelectorAll('span');
                largeSpans?.forEach(span => {
                    const originalFontSize = parseFloat((span as HTMLElement).getAttribute('data-font-size') || '0');
                    if (originalFontSize > 14) {
                        (span as HTMLElement).style.textDecoration = 'underline';
                        (span as HTMLElement).style.textDecorationColor = 'blue';
                    }
                });
            },
            cleanup: () => {
                const pdfContainer = document.querySelector('.pdf-text-layer');
                const allSpans = pdfContainer?.querySelectorAll('span');
                allSpans?.forEach(span => {
                    (span as HTMLElement).style.textDecoration = '';
                });
            }
        },
        {
            icon: <Type className="h-4 w-4" />,
            title: "Select Text by Font",
            description: "Select all text with specific font properties",
            action: "select-font",
            color: "bg-green-100 text-green-800",
            execute: () => {
                setShowFontsPanel(true);
            },
            cleanup: () => {
            }
        },
    ]

    return (
        <div className="w-full max-w-full mx-auto">

            {/* Main Layout */}
            <div className="flex flex-col lg:flex-row lg:space-x-5 h-205">

                {/* Left Panel - Interaction Tools (40% / 2 columns) */}
                <div className="lg:w-2/5 space-y-4 h-full min-h-0 flex flex-col items-center justify-center">
                    {/* Back Button */}
                    <div className="">
                        <Button variant="outline" onClick={onBack} className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Upload
                        </Button>
                    </div>
                    <Card className=''>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MousePointer className="h-5 w-5" />
                                PDF Interaction Tools
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 flex flex-col flex-1">
                            {/* File Info */}
                            <div className="p-3 bg-muted/50 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="secondary">Ready</Badge>
                                    <span className="text-sm font-medium truncate">
                                        {pdfFile.file.name}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {(pdfFile.file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>

                            <Separator />

                            {/* Interaction Tools */}
                            <div className="space-y-3 flex flex-col justify-center">
                                <h4 className="font-semibold text-sm">Text Interactions</h4>
                                {interactionTools.map((tool, index) => {
                                    const isActive = activeTool?.action === tool.action
                                    return (
                                        <Card
                                            key={index}
                                            className={`p-3 transition-all duration-200 cursor-pointer transform ${isActive
                                                ? 'bg-primary/10 border-primary shadow-md scale-[1.02] ring-2 ring-primary/20'
                                                : 'hover:bg-muted/50 hover:shadow-sm'
                                                }`}
                                            onClick={() => handleToolClick(tool)}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`p-2 rounded-lg transition-colors ${isActive
                                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                                    : tool.color
                                                    }`}>
                                                    {tool.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <h5 className={`font-medium text-sm ${isActive ? 'text-primary font-semibold' : ''
                                                            }`}>
                                                            {tool.title}
                                                        </h5>
                                                        {isActive && (
                                                            <Badge variant="default" className="text-xs px-2 py-0.5">
                                                                Active
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className={`text-xs mt-1 ${isActive ? 'text-primary/70' : 'text-muted-foreground'
                                                        }`}>
                                                        {tool.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </Card>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Panel - PDF Display (60% / 3 columns) */}
                <div className="lg:w-3/5 h-full min-h-0">
                    <Card className="h-full flex flex-col min-h-0">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                PDF Viewer
                                <Badge variant="outline">Interactive</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 min-h-0 flex flex-col overflow-hidden">
                            <div
                                className="size-full rounded-lg border-2 border-dashed border-muted-foreground/25 flex-1 overflow-auto h-full"
                            >
                                <PDFViewer file={pdfFile} fontStyles={fontStyles} setFontStyles={setFontStyles} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    )
}