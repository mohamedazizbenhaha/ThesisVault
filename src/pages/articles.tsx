import { useState } from 'react';
import Layout from '@/components/Layout';
import { getThesisMetadata, getAvailableSections, getArticles, ThesisMetadata, ArticleMetadata } from '@/lib/content';
import Link from 'next/link';
import { ArrowLeft, FileText, ArrowRight, X, User } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const PdfViewerNoSSR = dynamic(() => import('@/components/PdfViewer'), {
    ssr: false,
    loading: () => <div className="h-96 w-full flex items-center justify-center bg-gray-100 rounded-lg animate-pulse">Loading Viewer...</div>
});

interface ArticlesProps {
    metadata: ThesisMetadata;
    sections: string[];
    articles: ArticleMetadata[];
}

export default function Articles({ metadata, sections, articles = [] }: ArticlesProps) {
    const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

    return (
        <Layout title="Articles" sections={sections} metadata={metadata}>
            <div className="w-[80vw] mx-auto space-y-8">
                <div className="pt-4 mb-12 flex items-center justify-between">
                    <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">
                        <ArrowLeft size={16} className="mr-1" /> Back to Home
                    </Link>
                    <h1 className="text-3xl font-black text-gray-900 absolute left-1/2 transform -translate-x-1/2 hidden md:block tracking-tight">Published Articles</h1>
                    <div className="w-[100px]"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-20">
                    {!articles || articles.length === 0 ? (
                        <div className="col-span-full text-center py-20 text-gray-500 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40">
                            <FileText size={48} className="mx-auto mb-4 opacity-20" />
                            No articles found in /content/articles
                        </div>
                    ) : (
                        articles.map((article, index) => {
                            // Defensive check to avoid index errors
                            if (!article) return null;

                            return (
                                <div
                                    key={`article-v3-${index}-${article.pdf}`}
                                    className="group relative overflow-hidden rounded-3xl bg-white shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 border border-gray-100 p-8 flex flex-col h-full"
                                >
                                    {/* Background Icon */}
                                    <div className="absolute -top-10 -right-10 p-4 opacity-5 transition-all transform duration-700 group-hover:scale-110">
                                        <FileText size={180} />
                                    </div>

                                    <div className="relative z-10 flex-1 flex flex-col h-full">
                                        {/* Header: Icon (Left) + Type/Venue (Right) */}
                                        <div className="flex items-center gap-6 mb-2">
                                            <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-100 p-3 flex items-center justify-center shadow-sm overflow-hidden bg-white shrink-0">
                                                {article.publisherIcon ? (
                                                    <img
                                                        src={article.publisherIcon}
                                                        alt={article.publisher || 'Publisher'}
                                                        className="w-full h-full object-contain"
                                                    />
                                                ) : (
                                                    <div className="bg-teal-50 text-teal-600 w-full h-full flex items-center justify-center rounded-lg">
                                                        <FileText size={32} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col justify-center min-w-0">
                                                <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] mb-0.5">
                                                    {article.type || 'Journal'}
                                                </span>
                                                <a
                                                    href={article.url || '#'}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-gray-400 font-extrabold text-base hover:text-gray-700 transition-colors leading-tight line-clamp-2"
                                                    title={article.venue}
                                                >
                                                    {article.venue}
                                                </a>
                                            </div>
                                        </div>

                                        {/* Body: Title */}
                                        <h3
                                            className="text-2xl font-black text-gray-900 mb-1 leading-[1.2] tracking-tight"
                                            title={article.title}
                                        >
                                            {article.title}
                                        </h3>

                                        <div className="flex-1"></div>

                                        {/* Footer: Explore (Left) + Rank (Right) */}
                                        <div className="flex items-center justify-between mt-2 pt-6 border-t border-gray-50">
                                            <button
                                                onClick={() => setSelectedPdf(`/content/articles/${article.pdf}`)}
                                                className="inline-flex items-center text-blue-600 font-black text-sm tracking-widest uppercase group/link"
                                            >
                                                Explore <ArrowRight size={18} className="ml-2 group-hover/link:translate-x-2 transition-transform" />
                                            </button>

                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Level</span>
                                                <span className="px-3 py-1 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                                    {article.rank}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* PDF Modal */}
            {selectedPdf && (
                <div
                    className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
                    onClick={() => setSelectedPdf(null)}
                >
                    <button
                        onClick={() => setSelectedPdf(null)}
                        className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors z-[210]"
                    >
                        <X size={32} />
                    </button>

                    <div
                        className="bg-white rounded-[2.5rem] w-full max-w-6xl max-h-[85vh] overflow-hidden flex flex-col relative animate-in fade-in zoom-in duration-300 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-black text-gray-900 truncate pr-8 text-xl tracking-tight">
                                {selectedPdf.split('/').pop()?.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ')}
                            </h3>
                        </div>
                        <div className="flex-1 overflow-auto bg-gray-100 custom-scrollbar">
                            <PdfViewerNoSSR file={selectedPdf} />
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}

export async function getStaticProps() {
    try {
        const metadata = getThesisMetadata();
        const sections = getAvailableSections();
        const articles = getArticles() || [];

        console.log(`[StaticProps] Loaded ${articles.length} articles.`);

        return {
            props: {
                metadata: metadata || null,
                sections: sections || [],
                articles: JSON.parse(JSON.stringify(articles)) // Ensure clean serialization
            }
        };
    } catch (error) {
        console.error("[getStaticProps:articles] CRITICAL FAILURE:", error);
        return {
            props: {
                metadata: null,
                sections: [],
                articles: []
            }
        };
    }
}

