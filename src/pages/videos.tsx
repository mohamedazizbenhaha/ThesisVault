import Layout from '@/components/Layout';
import Gallery from '@/components/Gallery';
import { getThesisMetadata, getAvailableSections, getMediaCategories, ThesisMetadata, MediaCategory } from '@/lib/content';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface VideosProps {
    metadata: ThesisMetadata;
    sections: string[];
    categories: MediaCategory[];
}

export default function Videos({ metadata, sections, categories }: VideosProps) {
    return (
        <Layout title="Video Gallery" sections={sections} metadata={metadata}>
            <div className="w-[80vw] mx-auto space-y-8">
                <div className="mb-8 flex items-center justify-between">
                    <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">
                        <ArrowLeft size={16} className="mr-1" /> Back to Home
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 absolute left-1/2 transform -translate-x-1/2 hidden md:block">Video Gallery</h1>
                    <div className="w-[100px]"></div>
                </div>
                <Gallery categories={categories} type="videos" />
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
