import { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ZoomIn, ZoomOut, Maximize, X, AlertTriangle, Download, Keyboard } from 'lucide-react';

// Configure PDF.js worker - using match version from the installed package
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
    file: string;
    title?: string;
}

export default function PdfViewer({ file, title }: PdfViewerProps) {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState<number>(0.9);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [windowWidth, setWindowWidth] = useState(1000);
    const [error, setError] = useState<string | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        setWindowWidth(window.innerWidth);
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown') {
                e.preventDefault();
                const nextPage = Math.min(pageNumber + 1, numPages);
                if (nextPage !== pageNumber) {
                    scrollToPage(nextPage);
                }
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
                e.preventDefault();
                const prevPage = Math.max(pageNumber - 1, 1);
                if (prevPage !== pageNumber) {
                    scrollToPage(prevPage);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [numPages, pageNumber]);

    // Intersection Observer to update pageNumber on scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const pageIndex = pageRefs.current.indexOf(entry.target as HTMLDivElement);
                        if (pageIndex !== -1) {
                            setPageNumber(pageIndex + 1);
                        }
                    }
                });
            },
            {
                threshold: 0,
                root: null,
                rootMargin: '-50% 0px -50% 0px'
            }
        );

        pageRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => {
            observer.disconnect();
        };
    }, [numPages, scale]); // Re-run if scale changes as it affects intersection

    const scrollToPage = (page: number) => {
        const element = pageRefs.current[page - 1];
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setError(null);
    }

    function onDocumentLoadError(error: Error) {
        console.error("PDF Load Error:", error);
        setError(error.message);
    }

    const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

    // Ensure the file path is absolute to the origin if it's a relative path
    const fileUrl = typeof window !== 'undefined' && file.startsWith('/')
        ? `${window.location.origin}${file}`
        : file;

    const ViewerControls = () => (
        <div className="w-full bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50 px-4 md:px-8 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Page</span>
                    <div className="flex items-center bg-gray-50 rounded-lg px-3 py-1">
                        <span className="font-bold text-blue-600">{pageNumber}</span>
                        <span className="text-gray-400 mx-1">/</span>
                        <span className="text-gray-500 font-medium">{numPages || '--'}</span>
                    </div>
                </div>

            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
                <div className="flex items-center bg-gray-50 rounded-xl p-1">
                    <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-600">
                        <ZoomOut size={18} />
                    </button>
                    <span className="text-xs font-black w-14 text-center text-gray-900">{Math.round(scale * 100)}%</span>
                    <button onClick={() => setScale(s => Math.min(3.0, s + 0.1))} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-600">
                        <ZoomIn size={18} />
                    </button>
                </div>

                <div className="w-px h-8 bg-gray-100 mx-1 hidden md:block" />

                <a
                    href={fileUrl}
                    download
                    className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm"
                    title="Download PDF"
                >
                    <Download size={18} />
                </a>

                <button
                    onClick={toggleFullscreen}
                    className={`p-2.5 rounded-xl transition-all shadow-sm ${isFullscreen ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
                >
                    {isFullscreen ? <X size={18} /> : <Maximize size={18} />}
                </button>
            </div>
        </div>
    );

    // For the 80vw container, we want the PDF to take up most of it but leave room for indicators
    const pageWidth = isFullscreen ? windowWidth * 0.95 : Math.min(windowWidth * 0.75, 1400);

    return (
        <div className={`flex flex-col items-center bg-gray-50/50 ${isFullscreen ? 'fixed inset-0 z-[100] bg-gray-900 overflow-hidden' : 'w-full rounded-2xl overflow-hidden border border-gray-100 shadow-sm'}`}>
            {!error && <ViewerControls />}

            <div
                ref={scrollContainerRef}
                className={`w-full overflow-y-auto custom-scrollbar flex flex-col items-center py-8 px-4 gap-8 ${isFullscreen ? 'flex-1' : 'max-h-[85vh]'}`}
            >
                <div className="w-full flex flex-col items-center">
                    {error ? (
                        <div className="bg-white p-12 rounded-[2rem] shadow-xl border border-gray-100 text-center flex flex-col items-center my-20">
                            <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-red-500 mb-6">
                                <AlertTriangle size={40} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">Failed to load PDF</h3>
                            <p className="text-gray-500 text-sm max-w-md leading-relaxed">{error}</p>
                            <a
                                href={fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-8 px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                            >
                                Open in Browser
                            </a>
                        </div>
                    ) : (
                        <Document
                            file={fileUrl}
                            onLoadSuccess={onDocumentLoadSuccess}
                            onLoadError={onDocumentLoadError}
                            loading={
                                <div className="space-y-4 w-full max-w-2xl flex flex-col items-center py-20">
                                    <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Preparing Manuscript...</p>
                                </div>
                            }
                        >
                            <div className="flex flex-col gap-12 items-center w-full">
                                {Array.from(new Array(numPages), (el, index) => (
                                    <div
                                        key={`page_${index + 1}`}
                                        ref={el => { pageRefs.current[index] = el; }}
                                        className="relative shadow-2xl transition-all duration-500 bg-white"
                                    >
                                        <Page
                                            pageNumber={index + 1}
                                            scale={scale}
                                            width={pageWidth}
                                            renderTextLayer={true}
                                            renderAnnotationLayer={true}
                                            className="bg-white"
                                            loading={<div style={{ width: pageWidth, height: pageWidth * 1.41 }} className="bg-white animate-pulse rounded-sm" />}
                                        />
                                        <div className="absolute -left-20 sm:-left-24 top-4 h-fit pointer-events-none z-10">
                                            <span className="bg-gray-200 text-gray-600 text-[10px] font-black px-2 py-1 rounded-md shadow-sm inline-block transform -rotate-90 origin-right border border-gray-300/50">PAGE {index + 1}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Document>
                    )}
                </div>
            </div>
        </div>
    );
}
