# 📄 PDF Interactive Viewer

A modern, interactive PDF viewer built with **Next.js 15** and **React 19** that enables advanced text manipulation and analysis directly in the browser.

## 🚀 Live Demo

**[Try it live](https://pdf-interactive-viewer.vercel.app)**

![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Features

### 🎯 **Smart Text Analysis**
- **Font Detection**: Automatically extracts real font names from PDFs (not generic identifiers like `g_d0_f1`)
- **Style Recognition**: Detects bold and italic text based on font names and transformation matrices
- **Metadata Extraction**: Adds rich data attributes (`data-is-bold`, `data-is-italic`, `data-font-name`) to every text span

### 🖱️ **Interactive Tools**
- **🟨 Highlight Bold Text**: Automatically highlights all bold text in yellow
- **🔵 Highlight Italic Text**: Automatically highlights all italic text in light blue  
- **📏 Underline Large Text**: Underlines text larger than 16px
- **🎨 Select Text by Font**: Identifies and highlights text by specific font properties

### 🔧 **Technical Features**
- **Responsive PDF Rendering**: Auto-scales PDFs to fit container with ResizeObserver
- **Text Layer Overlay**: Maintains perfect text selection while preserving PDF visual quality
- **Drag & Drop Upload**: Intuitive file upload with visual feedback
- **Real-time Processing**: Instant analysis and interaction without server round-trips

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router and Turbopack
- **Frontend**: React 19, TypeScript 5
- **Styling**: Tailwind CSS 4, shadcn/ui components
- **PDF Processing**: PDF.js 5.4.149 with custom worker configuration
- **Icons**: Lucide React
- **Build Tools**: ESLint, PostCSS

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/pdf-interactive-viewer.git
   cd pdf-interactive-viewer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📖 How It Works

### 1. **PDF Upload & Processing**
- Users drag and drop PDF files into the application
- PDF.js processes the document and extracts text content with positioning data
- Custom worker configuration ensures reliable PDF rendering

### 2. **Font & Style Analysis** 
- The app extracts original font names from PDF metadata using `page.commonObjs`
- Analyzes font names to detect bold (`contains "bold"`) and italic (`contains "italic"`) styles
- Creates a comprehensive font mapping for accurate text classification

### 3. **Interactive Text Layer**
- Renders an invisible text layer perfectly aligned over the PDF canvas
- Each text span includes rich metadata for font name, size, and styling
- Maintains native text selection while enabling custom interactions

### 4. **Tool Execution System**
- Each interaction tool contains its own `execute()` and `cleanup()` functions
- Tools manipulate the DOM directly for instant visual feedback
- Clean separation of concerns: tools are self-contained and easily extensible

## 🎨 Use Cases

- **Document Analysis**: Quickly identify text formatting patterns in contracts, reports, or research papers
- **Accessibility**: Help users focus on specific text types (headers, emphasis, etc.)
- **Content Extraction**: Facilitate copying and processing of formatted text
- **Quality Assurance**: Verify document formatting consistency
- **Research**: Analyze font usage and text structure in academic documents

## 🏗️ Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Main application page
│   └── layout.tsx         # Root layout
├── components/
│   ├── PDFDropzone.tsx    # File upload interface
│   ├── PDFViewer.tsx      # PDF rendering & text layer
│   ├── PDFInteractionView.tsx  # Tools & interaction logic
│   └── ui/                # shadcn/ui components
└── lib/
    ├── pdf-config.ts      # PDF.js worker configuration
    └── utils.ts           # Utility functions
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

## 📝 Open Source

This project is **open source** and available for learning, contribution, and collaboration. Feel free to:
- 🔍 **Explore the code** to understand modern React/Next.js patterns
- 🐛 **Report issues** or suggest improvements
- 🤝 **Contribute** new features or optimizations
- 🎓 **Learn** from the implementation of PDF processing and text analysis

*All contributions and feedback are welcome!*