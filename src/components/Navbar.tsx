import Link from 'next/link';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { FileText, Image, Video, Monitor, BookOpen } from 'lucide-react';

const icons = {
    manuscript: BookOpen,
    presentation: Monitor,
    images: Image,
    videos: Video,
    articles: FileText,
};

export default function Navbar({ sections }: { sections: string[] }) {
    const router = useRouter();

    return (
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <a
                        href="https://www.youtube.com/@The_Thesis_Club"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center group"
                    >
                        <img
                            src="/content/assets/logo.png"
                            alt="Logo"
                            className="h-10 w-auto object-contain transition-transform duration-300"
                            onError={(e) => {
                                (e.target as any).style.display = 'none';
                                (e.target as any).parentElement.innerHTML = '<span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">The Thesis Club</span>';
                            }}
                        />
                    </a>

                    <div className="hidden md:flex space-x-1 lg:space-x-4">
                        {sections.filter(s => s !== 'manuscript').map(section => {
                            const Icon = icons[section as keyof typeof icons] || FileText;
                            const isActive = router.pathname.includes(section);
                            return (
                                <Link key={section} href={`/${section}`} className={clsx(
                                    "flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "text-blue-600 bg-blue-50 shadow-sm"
                                        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                                )}>
                                    <Icon size={18} />
                                    <span className="capitalize">{section}</span>
                                </Link>
                            )
                        })}
                    </div>
                    {/* Mobile menu button could go here */}
                </div>
            </div>
        </nav>
    );
}
