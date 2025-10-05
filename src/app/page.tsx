"use client"

import PDFDropzone, { PDFFile } from '@/components/PDFDropzone'
import PDFInteractionView from '@/components/PDFInteractionView'
import { useState } from 'react'
import { FileCode } from 'lucide-react'

export default function Home() {

  const [pdfFile, setPdfFile] = useState<PDFFile | null>(null)
  const [showDropzone, setShowDropzone] = useState(true)

  const handleContinue = () => {
    setShowDropzone(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                PDF Interactive Viewer
              </h1>
              <p className="text-muted-foreground mt-1">
                Interact with PDF text: select, copy, highlight and more
              </p>
            </div>
            <div className="hidden sm:flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">Online service</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="">
          {/* Hero Section */}
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Interactive
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"> PDF</span> Viewer
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A modern React application for interactive PDF text manipulation.
              Select, copy, highlight, and interact with PDF content seamlessly.
            </p>
          </div>

          {/* Dropzone Component */}
          {
            showDropzone ? (
              <div className="max-w-4xl mx-auto">
                <PDFDropzone pdfFile={pdfFile} setPdfFile={setPdfFile} handleContinue={handleContinue} />
              </div>
            ) : (
              <PDFInteractionView pdfFile={pdfFile} onBack={() => setShowDropzone(true)} />
            )
          }

          {/* Features Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <h3 className="font-semibold">Text Selection</h3>
              <p className="text-sm text-muted-foreground">
                Select and copy text from PDF documents with precise cursor control
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h3 className="font-semibold">Text Highlighting</h3>
              <p className="text-sm text-muted-foreground">
                Highlight important sections and create interactive annotations
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="font-semibold">React Integration</h3>
              <p className="text-sm text-muted-foreground">
                Built with React for seamless text interaction and modern UI experience
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background/50 backdrop-blur-sm mt-15">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center space-y-6">

            {/* Main Links */}
            <div className="flex items-center justify-center space-x-8">

              {/* GitHub Profile Link */}
              <a
                href="https://github.com/Gregoire-W"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-muted/50 transition-all duration-200"
              >
                {/* Placeholder for GitHub icon - you can replace with your custom SVG */}
                <svg width="24px" height="24px" viewBox="0 0 24 24" ><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  GitHub Profile
                </span>
              </a>

              {/* Separator */}
              <div className="w-px h-8 bg-border"></div>

              {/* Source Code Link */}
              <a
                href="https://github.com/Gregoire-W/pdf-interactive-viewer"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-muted/50 transition-all duration-200"
              >
                <FileCode className="w-6 h-6" />
                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  Source Code
                </span>
              </a>

            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
