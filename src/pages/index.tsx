import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/components/Layout';
import {
    Mail, Github, Linkedin, Twitter, Globe, BookOpen,
    GraduationCap, Building2, MapPin, X, ArrowRight,
    Monitor, Image as ImageIcon, Video, FileText, User
} from 'lucide-react';
import { getThesisMetadata, getAvailableSections, ThesisMetadata, PersonInfo } from '@/lib/content';

// Using PersonInfo imported from @/lib/content

interface HomeProps {
    metadata: ThesisMetadata;
    sections: string[];
}

const backgrounds: Record<string, string> = {
    manuscript: "bg-blue-600",
    presentation: "bg-indigo-600",
    images: "bg-purple-600",
    videos: "bg-pink-600",
    articles: "bg-teal-600"
};

const icons: Record<string, any> = {
    manuscript: BookOpen,
    presentation: Monitor,
    images: ImageIcon,
    videos: Video,
    articles: FileText,
};

const descriptions: Record<string, string> = {
    manuscript: "Read the full thesis manuscript in PDF format.",
    presentation: "View the presentation slides used for defense.",
    images: "Explore galleries of experimental results and architecture diagrams.",
    videos: "Watch demonstrations and video results.",
    articles: "Access related published papers and articles."
};

const SocialIcon = ({ type, url }: { type: string; url: string }) => {
    if (type === 'orcid') {
        return (
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 bg-gray-50 rounded-full transition-all duration-300 hover:bg-[#A6CE39]/10 group/icon"
                onClick={(e) => e.stopPropagation()}
                title="ORCID"
            >
                <div className="w-6 h-6 bg-[#A6CE39] rounded-md flex items-center justify-center">
                    <span className="text-white font-serif font-black text-[12px] leading-none transform translate-y-px">iD</span>
                </div>
            </a>
        );
    }

    const Icon = {
        linkedin: Linkedin,
        github: Github,
        website: Globe,
        email: Mail,
        twitter: Twitter
    }[type] || Globe;

    return (
        <a
            href={url.startsWith('mailto:') ? url : url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-gray-50 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
        >
            <Icon size={18} />
        </a>
    );
};

const PersonCard = ({ person, title, onClick }: { person: PersonInfo; title: string, onClick: () => void }) => (
    <div
        onClick={onClick}
        className="group flex flex-col items-center text-center p-8 bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100 h-full"
    >
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl overflow-hidden mb-6 ring-[1px] ring-gray-100 shadow-lg bg-gray-50 flex items-center justify-center transition-all duration-500 relative">
            {person.image && !person.image.includes('ui-avatars') ? (
                <Image
                    src={person.image}
                    alt={person.name}
                    fill
                    className="object-cover"
                />
            ) : (
                <User size={48} className="text-gray-300" />
            )}
        </div>
        <div className="space-y-1">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">{title}</span>
            <h4 className="text-xl font-black text-gray-900 leading-tight">{person.name}</h4>
            {person.institution && (
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest pt-1">{person.institution}</p>
            )}
        </div>
        <div className="mt-6 pt-6 border-t border-gray-50 w-full flex justify-center gap-3">
            {person.links?.slice(0, 3).map((link, i) => (
                <SocialIcon key={i} type={link.type} url={link.url} />
            ))}
        </div>
    </div>
);

export default function Home({ metadata, sections }: HomeProps) {
    const [selectedPerson, setSelectedPerson] = useState<{ person: PersonInfo; title: string } | null>(null);

    useEffect(() => {
        if (selectedPerson) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedPerson]);

    return (
        <Layout sections={sections} metadata={metadata}>
            <div className="max-w-[80%] mx-auto space-y-24 py-6 scale-95 origin-top">
                {/* Hero Section */}
                <div className="text-center space-y-10">
                    <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                        </span>
                        <span>{metadata.authorInfo.name}</span>
                    </div>

                    <div className="space-y-6">
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-gray-900 leading-[1.1] max-w-5xl mx-auto">
                            {metadata.title}
                        </h1>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
                            {metadata.description}
                        </p>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-4 w-full">
                        <Link href="/manuscript" className="w-full max-w-lg px-12 py-5 bg-gray-900 text-white rounded-2xl font-black shadow-2xl shadow-gray-900/40 hover:bg-gray-800 transition-all text-center text-lg uppercase tracking-widest">
                            Read Manuscript
                        </Link>
                    </div>
                </div>

                {/* Sections Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mx-auto px-4 md:px-0">
                    {sections.filter(s => s !== 'manuscript').map(section => {
                        const Icon = icons[section] || FileText;
                        return (
                            <Link key={section} href={`/${section}`} className="group relative overflow-hidden rounded-3xl bg-white shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 border border-gray-100 p-8 flex flex-col h-full">
                                <div className={`absolute -top-10 -right-10 p-4 opacity-5 transition-all transform duration-700`}>
                                    <Icon size={180} />
                                </div>
                                <div className="relative z-10 flex-1 flex flex-col">
                                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${backgrounds[section] || 'bg-gray-600'} text-white mb-6 shadow-xl shadow-blue-600/20 transition-transform duration-500`}>
                                        <Icon size={28} />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-3 capitalize">{section}</h3>
                                    <p className="text-gray-500 mb-8 flex-1 text-sm leading-relaxed font-medium">{descriptions[section] || `Access the ${section} section.`}</p>
                                    <span className="inline-flex items-center text-blue-600 font-black text-sm tracking-widest uppercase group-hover:translate-x-2 transition-transform">
                                        Explore <ArrowRight size={18} className="ml-2" />
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Team Section */}
                <div className="space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-black text-gray-900">Research Team</h2>
                        <p className="text-gray-500 font-medium">The author and supervisors behind this thesis.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-start-1">
                            <PersonCard
                                person={metadata.authorInfo}
                                title="Author"
                                onClick={() => setSelectedPerson({ person: metadata.authorInfo, title: 'Author' })}
                            />
                        </div>
                        {metadata.supervisorsInfo.map((s, i) => (
                            <PersonCard
                                key={i}
                                person={s}
                                title="Supervisor"
                                onClick={() => setSelectedPerson({ person: s, title: 'Supervisor' })}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Person Detail Modal */}
            {selectedPerson && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
                    onClick={() => setSelectedPerson(null)}
                >
                    <div
                        className="bg-white rounded-[2rem] w-full max-w-[1000px] max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in duration-300 custom-scrollbar scale-90 origin-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Banner & Header */}
                        <div className="relative h-64 bg-gray-900 overflow-hidden">
                            {selectedPerson.person.bannerImage ? (
                                <img
                                    src={selectedPerson.person.bannerImage}
                                    alt="Banner"
                                    className="w-full h-full object-cover opacity-60"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-60" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />

                            <button
                                onClick={() => setSelectedPerson(null)}
                                className="absolute top-6 right-6 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 p-2 rounded-full transition-all z-[110] backdrop-blur-md"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Profile & Info */}
                        <div className="px-8 sm:px-12 pb-12">
                            <div className="flex flex-col md:flex-row md:items-end gap-8 mb-10 -mt-14 relative z-20">
                                <div className="relative shrink-0">
                                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-[2.5rem] overflow-hidden ring-[3px] ring-white shadow-2xl bg-white relative">
                                        {selectedPerson.person.image ? (
                                            <img
                                                src={selectedPerson.person.image}
                                                alt={selectedPerson.person.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full bg-gray-50">
                                                <User size={64} className="text-gray-300" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="pb-2">
                                    <h2 className="text-4xl font-black text-gray-900 mb-2">{selectedPerson.person.name}</h2>
                                    <p className="text-lg text-blue-600 font-bold uppercase tracking-wider">{selectedPerson.title}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                <div className="md:col-span-2 space-y-8">
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                                            <BookOpen className="text-blue-600" />
                                            Biography
                                        </h3>
                                        <p className="text-xl text-gray-600 leading-relaxed font-medium">
                                            {selectedPerson.person.description || "Passionate researcher contributing to the field of computer science and technology."}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                                            <Building2 className="text-blue-600" />
                                            Institution
                                        </h3>
                                        <p className="text-lg text-gray-600 font-bold">{selectedPerson.person.institution}</p>
                                        <div className="flex items-center gap-2 text-gray-400 mt-2">
                                            <MapPin size={18} />
                                            <span className="text-sm font-bold uppercase tracking-tight">Main Campus</span>
                                        </div>
                                    </div>

                                    {selectedPerson.person.researchFocus && (
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                                                <GraduationCap className="text-blue-600" />
                                                Research Focus
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedPerson.person.researchFocus.split(',').map((tag, i) => (
                                                    <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100 uppercase tracking-wider">
                                                        {tag.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Links Section */}
                            <div className="pt-10 mt-10 border-t border-gray-100">
                                <div className="flex flex-wrap gap-4">
                                    {selectedPerson.person.links?.map((link, idx) => {
                                        const type = link.type;
                                        const url = link.url;
                                        return (
                                            <a
                                                key={idx}
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 px-5 py-2 bg-gray-50 rounded-2xl text-gray-700 font-bold hover:bg-blue-50 hover:text-blue-600 transition-all group"
                                            >
                                                {type === 'orcid' ? (
                                                    <div className="w-6 h-6 bg-[#A6CE39] rounded flex items-center justify-center shrink-0">
                                                        <span className="text-white font-serif font-black text-[10px]">iD</span>
                                                    </div>
                                                ) : (
                                                    <div className="shrink-0 text-gray-400 group-hover:text-blue-500">
                                                        {type === 'linkedin' && <Linkedin size={20} />}
                                                        {type === 'github' && <Github size={20} />}
                                                        {type === 'website' && <Globe size={20} />}
                                                        {type === 'email' && <Mail size={20} />}
                                                        {type === 'twitter' && <Twitter size={20} />}
                                                    </div>
                                                )}
                                                <span className="uppercase text-xs tracking-widest">{type}</span>
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}

export async function getStaticProps() {
    const metadata = getThesisMetadata();
    const sections = getAvailableSections();
    return {
        props: {
            metadata,
            sections
        }
    };
}
