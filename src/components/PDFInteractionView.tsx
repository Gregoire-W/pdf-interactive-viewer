'use client'

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
    Copy,
} from 'lucide-react'
import { PDFFile } from './PDFDropzone'
import dynamic from 'next/dynamic'

const PDFViewer = dynamic(() => import("./PDFViewer"), { ssr: false });

interface PDFInteractionViewProps {
    pdfFile: PDFFile | null
    onBack: () => void
}

export default function PDFInteractionView({ pdfFile, onBack }: PDFInteractionViewProps) {
    if (!pdfFile) return null

    const interactionTools = [
        {
            icon: <Highlighter className="h-4 w-4" />,
            title: "Highlight Bold Text",
            description: "Automatically highlight all bold text",
            action: "highlight-bold",
            color: "bg-yellow-100 text-yellow-800"
        },
        {
            icon: <Underline className="h-4 w-4" />,
            title: "Underline Large Text",
            description: "Underline text over 16px font size",
            action: "underline-large",
            color: "bg-blue-100 text-blue-800"
        },
        {
            icon: <Type className="h-4 w-4" />,
            title: "Select Text by Font",
            description: "Select all text with specific font properties",
            action: "select-font",
            color: "bg-green-100 text-green-800"
        },
        {
            icon: <MousePointer className="h-4 w-4" />,
            title: "Manual Selection",
            description: "Click and drag to select text manually",
            action: "manual-select",
            color: "bg-purple-100 text-purple-800"
        },
        {
            icon: <Copy className="h-4 w-4" />,
            title: "Copy Selected Text",
            description: "Copy all selected text to clipboard",
            action: "copy-text",
            color: "bg-orange-100 text-orange-800"
        }
    ]

    return (
        <div className="w-full max-w-full mx-auto">
            {/* Back Button */}
            <div className="mb-6">
                <Button variant="outline" onClick={onBack} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Upload
                </Button>
            </div>

            {/* Main Layout */}
            <div className="flex flex-col lg:flex-row lg:space-x-5 h-170">

                {/* Left Panel - Interaction Tools (40% / 2 columns) */}
                <div className="lg:w-2/5 space-y-4 h-full min-h-0">
                    <Card className='h-full'>
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
                            <div className="space-y-3 flex flex-col justify-center flex-1">
                                <h4 className="font-semibold text-sm">Text Interactions</h4>
                                {interactionTools.map((tool, index) => (
                                    <Card key={index} className="p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                                        <div className="flex items-start gap-3">
                                            <div className={`p-2 rounded-lg ${tool.color}`}>
                                                {tool.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h5 className="font-medium text-sm">{tool.title}</h5>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {tool.description}
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
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
                                <PDFViewer file={pdfFile} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    )
}