import Head from 'next/head';
import Navbar from './Navbar';
import { ThesisMetadata } from '@/lib/content';

interface LayoutProps {
    children: React.ReactNode;
    sections: string[];
    metadata?: ThesisMetadata;
    title?: string;
}

export default function Layout({ children, sections, metadata, title }: LayoutProps) {
    const pageTitle = title ? `${title} | ${metadata?.title || 'Thesis'}` : (metadata?.title || 'Thesis Display');

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={metadata?.description} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
                <Navbar sections={sections} />
                <main className="flex-grow pt-24 pb-12 animate-fade-in w-full">
                    {children}
                </main>
                <footer className="bg-white border-t border-gray-100 py-8 text-center text-gray-500 text-sm">
                    <p className="mb-2">© {new Date().getFullYear()} {metadata?.authorInfo.name || metadata?.author}</p>
                    {metadata?.supervisorsInfo && metadata.supervisorsInfo.length > 0 && (
                        <p className="text-gray-400 text-xs">
                            Supervised by {metadata.supervisorsInfo.map(s => s.name).join(' & ')}
                        </p>
                    )}
                </footer>
            </div>
        </>
    );
}
