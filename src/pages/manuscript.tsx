import Layout from '@/components/Layout';
import { getThesisMetadata, getAvailableSections, getManuscriptFile, ThesisMetadata } from '@/lib/content';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamic import for PDF viewer to avoid SSR issues with canvas
const PdfViewerNoSSR = dynamic(() => import('@/components/PdfViewer'), {
    ssr: false,
    loading: () => <div className="h-96 w-full flex items-center justify-center bg-gray-100 rounded-lg animate-pulse">Loading Viewer...</div>
});

interface ManuscriptProps {
    metadata: ThesisMetadata;
    sections: string[];
    fileName: string | null;
}

export default function Manuscript({ metadata, sections, fileName }: ManuscriptProps) {
    return (
        <Layout title="Manuscript" sections={sections} metadata={metadata}>
            <div className="w-[80vw] mx-auto space-y-8">
                <div className="mb-8 flex items-center justify-between">
                    <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">
                        <ArrowLeft size={16} className="mr-1" /> Back to Home
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 absolute left-1/2 transform -translate-x-1/2 hidden md:block">Thesis Manuscript</h1>
                    <div className="w-[100px]"></div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-8 min-h-[80vh] flex flex-col items-center justify-center">
                    {fileName ? (
                        <PdfViewerNoSSR file={`/content/manuscript/${fileName}`} />
                    ) : (
                        <div className="text-center py-20 text-gray-400">
                            <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
                            No manuscript PDF found in /content/manuscript
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

export async function getStaticProps() {
    return {
        props: {
            metadata: getThesisMetadata(),
            sections: getAvailableSections(),
            fileName: getManuscriptFile()
        }
    };
}

