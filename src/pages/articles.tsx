import { useState } from 'react';
import Layout from '@/components/Layout';
import { getThesisMetadata, getAvailableSections, getArticles, ThesisMetadata } from '@/lib/content';
import Link from 'next/link';
import { ArrowLeft, FileText, Download, X } from 'lucide-react';
import dynamic from 'next/dynamic';

const PdfViewerNoSSR = dynamic(() => import('@/components/PdfViewer'), {
    ssr: false,
    loading: () => <div className="h-96 w-full flex items-center justify-center bg-gray-100 rounded-lg animate-pulse">Loading Viewer...</div>
});

interface ArticlesProps {
    metadata: ThesisMetadata;
    sections: string[];
    articles: string[];
}

export default function Articles({ metadata, sections, articles }: ArticlesProps) {
    const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

    return (
        <Layout title="Articles" sections={sections} metadata={metadata}>
            <div className="w-[80vw] mx-auto space-y-8">
                <div className="mb-8 flex items-center justify-between">
                    <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">
                        <ArrowLeft size={16} className="mr-1" /> Back to Home
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 absolute left-1/2 transform -translate-x-1/2 hidden md:block">Published Articles</h1>
                    <div className="w-[100px]"></div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {articles.length === 0 ? (
                        <div className="col-span-full text-center py-20 text-gray-500 bg-white rounded-xl border border-gray-200">
                            <FileText size={48} className="mx-auto mb-4 opacity-20" />
                            No articles found in /content/articles
                        </div>
                    ) : (
                        articles.map(article => (
                            <div key={article} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-teal-50 text-teal-600 rounded-lg group-hover:bg-teal-100 transition-colors">
                                        <FileText size={24} />
                                    </div>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2 truncate" title={article}>
                                    {article.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ')}
                                </h3>
                                <div className="flex items-center space-x-2 mt-4">
                                    <button
                                        onClick={() => setSelectedPdf(`/content/articles/${article}`)}
                                        className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                                    >
                                        View PDF
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* PDF Modal */}
            {selectedPdf && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setSelectedPdf(null)}
                >
                    <button
                        onClick={() => setSelectedPdf(null)}
                        className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors z-[110]"
                    >
                        <X size={32} />
                    </button>

                    <div
                        className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-bold text-gray-900 truncate pr-8">
                                {selectedPdf.split('/').pop()?.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ')}
                            </h3>
                        </div>
                        <div className="flex-1 overflow-auto bg-gray-100">
                            <PdfViewerNoSSR file={selectedPdf} />
                        </div>
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
            articles: getArticles()
        }
    };
}

