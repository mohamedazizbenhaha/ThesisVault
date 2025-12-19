import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { getThesisMetadata, getAvailableSections, getPresentationFile, ThesisMetadata } from '@/lib/content';
import Link from 'next/link';
import { ArrowLeft, Download, Monitor, ExternalLink, X, Maximize2, AlertTriangle } from 'lucide-react';
import dynamic from 'next/dynamic';

const PdfViewerNoSSR = dynamic(() => import('@/components/PdfViewer'), {
    ssr: false,
    loading: () => <div className="h-96 w-full flex items-center justify-center bg-gray-100 rounded-lg animate-pulse">Loading Viewer...</div>
});

interface PresentationProps {
    metadata: ThesisMetadata;
    sections: string[];
    fileInfo: { name: string; type: 'pdf' | 'pptx' | 'ppt' } | null;
}

export default function Presentation({ metadata, sections, fileInfo }: PresentationProps) {
    const [showPptxModal, setShowPptxModal] = useState(false);
    const [baseUrl, setBaseUrl] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setBaseUrl(window.location.origin);
        }
    }, []);

    const fileUrl = fileInfo ? `/content/presentation/${fileInfo.name}` : '';
    const fullFileUrl = baseUrl + fileUrl;
    const officeViewerUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(fullFileUrl)}`;

    return (
        <Layout title="Presentation" sections={sections} metadata={metadata}>
            <div className="w-[80vw] mx-auto space-y-8">
                <div className="pt-4 mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 px-4 sm:px-0">
                    <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">
                        <ArrowLeft size={16} className="mr-1" /> Back to Home
                    </Link>
                    <h1 className="text-3xl font-black text-gray-900 text-center flex-1 tracking-tight">Defense Presentation</h1>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-8 min-h-[70vh] flex flex-col items-center justify-center">
                    {!fileInfo ? (
                        <div className="text-center py-20 text-gray-400">
                            <Monitor size={48} className="mx-auto mb-4 opacity-20" />
                            No presentation file found in /content/presentation
                        </div>
                    ) : fileInfo.type === 'pdf' ? (
                        <PdfViewerNoSSR file={fileUrl} />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center relative">
                            <style jsx global>
                                {`
                                    @keyframes decay-bounce {
                                        0%, 100% { transform: translateY(0); }
                                        15% { transform: translateY(-40px); }
                                        30% { transform: translateY(0); }
                                        45% { transform: translateY(-20px); }
                                        60% { transform: translateY(0); }
                                        75% { transform: translateY(-8px); }
                                        85% { transform: translateY(0); }
                                        92% { transform: translateY(-3px); }
                                        98% { transform: translateY(0); }
                                    }
                                    .animate-decay-bounce {
                                        animation: decay-bounce 3.5s cubic-bezier(0.28, 0.84, 0.42, 1) forwards;
                                    }
                                `}
                            </style>
                            <div className="mb-8 p-12 bg-orange-50 rounded-full text-orange-600 animate-decay-bounce">
                                <Monitor size={64} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">PowerPoint Presentation</h2>
                            <p className="text-gray-500 text-center max-w-md mb-8">
                                PowerPoint files can be viewed directly in the app using the online viewer or downloaded for the best experience.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
                                <button
                                    onClick={() => setShowPptxModal(true)}
                                    className="flex flex-col items-center p-6 border-2 border-orange-100 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all group text-left"
                                >
                                    <Maximize2 size={32} className="text-orange-600 mb-3 group-hover:scale-110 transition-transform" />
                                    <span className="font-bold text-gray-900">View in Application</span>
                                    <span className="text-xs text-gray-400 mt-1 text-center">(Recommended)</span>
                                </button>

                                <a
                                    href={fileUrl}
                                    download
                                    className="flex flex-col items-center p-6 border-2 border-blue-100 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
                                >
                                    <Download size={32} className="text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
                                    <span className="font-bold text-gray-900">Download File</span>
                                    <span className="text-xs text-gray-400 mt-1 text-center">Open in PowerPoint</span>
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* PPTX Modal */}
            {showPptxModal && (
                <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col">
                    <div className="flex items-center justify-between p-4 bg-white/5 border-b border-white/10 text-white">
                        <div className="flex items-center space-x-3">
                            <Monitor className="text-orange-500" />
                            <span className="font-bold">{fileInfo?.name}</span>
                        </div>
                        <button
                            onClick={() => setShowPptxModal(false)}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <div className="flex-1 w-full bg-white relative">
                        <iframe
                            src={officeViewerUrl}
                            className="w-full h-full border-none"
                            title="PowerPoint Viewer"
                        />
                        {baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1') ? (
                            <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-md flex items-center justify-center p-8 text-center">
                                <div className="max-w-md bg-white rounded-3xl p-8 shadow-2xl space-y-6">
                                    <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 mx-auto">
                                        <AlertTriangle size={36} />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold text-gray-900">Internet Connection Required</h3>
                                        <p className="text-gray-500 text-sm leading-relaxed">
                                            The PowerPoint viewer is provided by Microsoft and requires your website to be accessible on a public URL.
                                            <br /><br />
                                            Since you are currently on <span className="font-mono text-blue-600 bg-blue-50 px-1 rounded">localhost</span>, Microsoft's servers cannot reach your file.
                                        </p>
                                    </div>
                                    <div className="pt-4 flex flex-col gap-3">
                                        <a href={fileUrl} download className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                                            <Download size={18} /> Download to View
                                        </a>
                                        <button onClick={() => setShowPptxModal(false)} className="w-full py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all">
                                            Go Back
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-white text-[10px] font-medium pointer-events-none opacity-50">
                                Loading from Microsoft Office Online...
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Layout>
    );
}

export async function getStaticProps() {
    return {
        props: {
            metadata: getThesisMetadata(),
            sections: getAvailableSections(),
            fileInfo: getPresentationFile()
        }
    };
}
