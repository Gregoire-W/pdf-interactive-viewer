'use client'

import React, { useCallback, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
    Upload,
    FileText,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Trash2,
    Eye,
    ArrowRight
} from 'lucide-react'

interface PDFFile {
    file: File
    status: 'uploading' | 'success' | 'error'
    progress: number
    error?: string
}

interface PDFDropzoneProps {
    onContinue?: () => void
    pdfFile: PDFFile | null
    setPdfFile: (file: PDFFile | null) => void
}

export default function PDFDropzone({ onContinue, pdfFile, setPdfFile }: PDFDropzoneProps) {
    const [isDragOver, setIsDragOver] = useState(false)

    // Open PDF in new tab using blob URL
    const handleViewPDF = useCallback(() => {
        if (!pdfFile || pdfFile.status !== 'success') return;
        const blobUrl = URL.createObjectURL(pdfFile.file);
        window.open(blobUrl, '_blank');
        // Optionally revoke the object URL after some time
        setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
    }, [pdfFile]);

    const validatePDFFile = (file: File): string | null => {
        if (file.type !== 'application/pdf') {
            return 'Only PDF files are accepted'
        }
        if (file.size > 50 * 1024 * 1024) { // 50MB
            return 'File cannot exceed 50MB'
        }
        return null
    }

    const simulateUpload = (file: PDFFile) => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress >= 100) {
                setPdfFile({ ...file, status: 'success', progress: 100 });
                clearInterval(interval);
            } else {
                setPdfFile({ ...file, progress: Math.min(progress, 99) });
            }
        }, 200);
    }

    const handleFile = useCallback((file: File) => {
        const error = validatePDFFile(file);
        if (error) {
            setPdfFile({
                file,
                status: 'error',
                progress: 0,
                error
            });
        } else {
            const uploadingFile: PDFFile = {
                file,
                status: 'uploading',
                progress: 0
            };
            setPdfFile(uploadingFile);
            setTimeout(() => simulateUpload(uploadingFile), 100);
        }
    }, [setPdfFile]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0])
        }
    }, [handleFile])

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
    }, [])

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0])
        }
        // Reset input value to allow re-selecting the same file
        e.target.value = ''
    }, [handleFile])

    const removeFile = () => {
        setPdfFile(null)
    }

    const getStatusIcon = (status: PDFFile['status']) => {
        switch (status) {
            case 'uploading':
                return <Upload className="h-4 w-4 animate-spin" />
            case 'success':
                return <CheckCircle2 className="h-4 w-4 text-green-600" />
            case 'error':
                return <XCircle className="h-4 w-4 text-red-600" />
        }
    }

    const getStatusBadge = (status: PDFFile['status']) => {
        switch (status) {
            case 'uploading':
                return <Badge variant="secondary">Uploading...</Badge>
            case 'success':
                return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Ready</Badge>
            case 'error':
                return <Badge variant="destructive">Error</Badge>
        }
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            <Card
                className={`transition-all duration-200 ${isDragOver
                    ? 'border-primary border-2 bg-primary/5'
                    : 'border-dashed border-2 hover:border-primary/50'
                    }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                <CardContent className="p-8">
                    {!pdfFile ? (
                        // Empty state - No PDF uploaded
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-2xl font-semibold mb-2">
                                Upload your PDF file
                            </h3>
                            <p className="text-muted-foreground mb-6 max-w-md">
                                Drag and drop your PDF file here or click to select a file.
                                Maximum size: 50MB.
                            </p>
                            <Button asChild variant="default">
                                <label htmlFor="file-upload" className="cursor-pointer">
                                    <Upload className="h-4 w-4 mr-2" />
                                    Choose file
                                    <input
                                        id="file-upload"
                                        type="file"
                                        accept=".pdf,application/pdf"
                                        onChange={handleFileInput}
                                        className="hidden"
                                    />
                                </label>
                            </Button>
                        </div>
                    ) : (
                        // PDF uploaded state
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/20">
                                <div className="flex-shrink-0">
                                    {getStatusIcon(pdfFile.status)}
                                </div>

                                <div className="flex-grow min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="font-medium truncate">
                                            {pdfFile.file.name}
                                        </p>
                                        {getStatusBadge(pdfFile.status)}
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span>{(pdfFile.file.size / 1024 / 1024).toFixed(2)} MB</span>
                                        {pdfFile.status === 'uploading' && (
                                            <div className="flex-grow max-w-48">
                                                <Progress value={pdfFile.progress} className="h-2" />
                                            </div>
                                        )}
                                    </div>

                                    {pdfFile.error && (
                                        <Alert className="mt-2 border-red-200 bg-red-50">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription className="text-red-800">
                                                {pdfFile.error}
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </div>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={removeFile}
                                    className="flex-shrink-0"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Action buttons */}
                            <div className="flex justify-center gap-4 pt-4">
                                {pdfFile.status === 'success' && (
                                    <Button size="lg" className="px-8" onClick={handleViewPDF}>
                                        <Eye className="h-4 w-4 mr-2" />
                                        View PDF
                                    </Button>
                                )}

                                <Button variant="outline" size="lg">
                                    <ArrowRight className="h-4 w-4 mr-2" />
                                    Interact with PDF
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export { type PDFFile }