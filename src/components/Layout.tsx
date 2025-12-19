import Head from 'next/head';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { ThesisMetadata } from '@/lib/content';
import { X, ShieldCheck, FileText } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
    sections: string[];
    metadata?: ThesisMetadata;
    title?: string;
}

export default function Layout({ children, sections, metadata, title }: LayoutProps) {
    const pageTitle = `The Thesis Vault - ${metadata?.authorInfo?.name || metadata?.author || 'Mohamed Aziz Ben Haha'}`;
    const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
    const [legalData, setLegalData] = useState<any>(null);

    useEffect(() => {
        fetch('/content/legal.json')
            .then(res => res.json())
            .then(data => setLegalData(data))
            .catch(err => console.error("Error loading legal notice:", err));
    }, []);

    useEffect(() => {
        if (isLegalModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isLegalModalOpen]);

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={metadata?.description} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/content/assets/tablogo.png" />
            </Head>
            <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
                <Navbar sections={sections} />
                <main className="flex-grow pt-32 pb-12 animate-fade-in w-full">
                    {children}
                </main>

                <footer className="bg-white border-t border-gray-100 py-4">
                    <div className="max-w-[80%] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                        {/* Left: Branding */}
                        <div className="text-left py-1">
                            <p className="text-gray-900 leading-none">
                                <span className="text-base font-black tracking-tight">The Thesis Vault</span>
                                <span className="text-[10px] italic text-gray-400 ml-2 font-medium">by the thesis club</span>
                            </p>
                            <p className="text-[11px] text-gray-400 font-medium mt-1">
                                Your open academic repository for publicly shared research
                            </p>
                        </div>

                        {/* Middle: Copyright */}
                        <div className="text-center py-1">
                            <p className="text-sm font-bold text-gray-900 leading-tight">
                                © {new Date().getFullYear()} Mohamed Aziz Ben Haha
                            </p>
                            <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                                All rights reserved unless otherwise stated.
                            </p>
                        </div>

                        {/* Right: Policy Link */}
                        <div className="flex justify-end py-1">
                            <button
                                onClick={() => setIsLegalModalOpen(true)}
                                className="group flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-all font-bold text-xs tracking-wide bg-gray-50 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-gray-100"
                            >
                                <ShieldCheck size={14} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                                <span className="border-b border-transparent group-hover:border-blue-200">Legal & Usage Policy</span>
                            </button>
                        </div>
                    </div>
                </footer>

                {/* Legal Modal */}
                {isLegalModalOpen && legalData && (
                    <div
                        className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
                        onClick={() => setIsLegalModalOpen(false)}
                    >
                        <div
                            className="bg-white rounded-[2.5rem] w-full max-w-[800px] max-h-[85vh] overflow-y-auto relative animate-in fade-in zoom-in duration-300 custom-scrollbar shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-8 sm:p-12">
                                <div className="flex justify-between items-center mb-10 border-b border-gray-100 pb-8">
                                    <h2 className="text-3xl font-black text-gray-900 leading-tight">
                                        {legalData.title}
                                    </h2>
                                    <button
                                        onClick={() => setIsLegalModalOpen(false)}
                                        className="text-gray-400 hover:text-gray-900 bg-gray-50 p-2 rounded-full transition-all"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="space-y-10">
                                    {legalData.sections.map((section: any) => (
                                        <div key={section.id} className="space-y-4">
                                            <h3 className="text-lg font-black text-blue-600 uppercase tracking-widest">
                                                {section.title}
                                            </h3>
                                            <div className="space-y-4">
                                                <p className="text-gray-600 leading-relaxed font-medium">
                                                    {section.content}
                                                </p>
                                                {section.list && (
                                                    <ul className="space-y-3 pl-2">
                                                        {section.list.map((item: string, i: number) => (
                                                            <li key={i} className="flex gap-3 text-gray-500 text-sm font-medium">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />
                                                                {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-12 pt-10 border-t border-gray-100 flex justify-center">
                                    <button
                                        onClick={() => setIsLegalModalOpen(false)}
                                        className="px-12 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/20 active:scale-95"
                                    >
                                        I Understand
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
