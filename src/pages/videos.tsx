import Layout from '@/components/Layout';
import Gallery from '@/components/Gallery';
import { getThesisMetadata, getAvailableSections, getMediaCategories, ThesisMetadata, MediaCategory } from '@/lib/content';
import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';
import { useState } from 'react';

interface VideosProps {
    metadata: ThesisMetadata;
    sections: string[];
    categories: MediaCategory[];
}

export default function Videos({ metadata, sections, categories }: VideosProps) {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <Layout title="Video Gallery" sections={sections} metadata={metadata}>
            <div className="w-[80vw] mx-auto space-y-8">
                <div className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors shrink-0">
                        <ArrowLeft size={16} className="mr-1" /> Back to Home
                    </Link>

                    <h1 className="text-3xl font-bold text-gray-900 md:absolute md:left-1/2 md:transform md:-translate-x-1/2">Video Gallery</h1>

                    <div className="relative w-full md:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search categories..."
                            className="block w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <Gallery categories={categories} type="videos" searchQuery={searchQuery} />
            </div>
        </Layout>
    );
}

export async function getStaticProps() {
    return {
        props: {
            metadata: getThesisMetadata(),
            sections: getAvailableSections(),
            categories: getMediaCategories('videos')
        }
    };
}
