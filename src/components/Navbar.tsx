import Link from 'next/link';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { FileText, Image, Video, Monitor, BookOpen, Phone, Mail, Linkedin, Youtube, ExternalLink, LayoutGrid } from 'lucide-react';

const icons = {
    manuscript: BookOpen,
    presentation: Monitor,
    images: Image,
    videos: Video,
    articles: FileText,
};

export default function Navbar({ sections }: { sections: string[] }) {
    const router = useRouter();

    const ContactBar = () => (
        <div className="w-full bg-[#0a0a0a] text-white py-1.5 px-4 sm:px-6 lg:px-8 border-b border-white/5">
            <div className="max-w-screen-2xl mx-auto flex justify-between items-center text-[10px] sm:text-xs font-bold tracking-widest uppercase">
                <div className="flex items-center gap-6">
                    <span className="hidden sm:inline text-white font-black tracking-tighter">Mohamed Aziz Ben Haha</span>
                    <a href="https://wa.me/21625713413" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-gray-400 transition-colors">
                        <Phone size={12} className="text-white" />
                        <span>00216 25 713 413</span>
                    </a>
                    <a href="mailto:mohamedaziz.benhaha@gmail.com" target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-2 hover:text-gray-400 text-white transition-colors">
                        <Mail size={12} />
                        <span className="normal-case">mohamedaziz.benhaha@gmail.com</span>
                    </a>
                </div>
                <div className="flex items-center gap-4">
                    <a href="https://mohamedazizbenhaha.netlify.app" target="_blank" rel="noopener noreferrer" className="group flex items-center hover:opacity-80 transition-opacity">
                        <img src="/content/assets/7a7aLogo.PNG" alt="7a7a" className="h-[18px] w-auto invert brightness-0 " />
                    </a>
                    <div className="w-px h-3 bg-white/10 mx-1"></div>
                    <a href="https://www.linkedin.com/in/mohamed-aziz-ben-haha/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-400 transition-colors">
                        <Linkedin size={14} fill="currentColor" strokeWidth={0} />
                    </a>
                    <a href="https://www.youtube.com/@The_Thesis_Club" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-400 transition-colors">
                        <Youtube size={16} strokeWidth={2} />
                    </a>
                    <a href="https://bento.me/mohamed-aziz-ben-haha" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-400 transition-colors">
                        <LayoutGrid size={14} />
                    </a>
                </div>
            </div>
        </div>
    );

    return (
        <nav className="fixed top-0 w-full z-50 transition-all duration-300">
            <ContactBar />
            <div className="w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center group">
                            <img
                                src={`/content/assets/logo.png?v=${Date.now()}`}
                                alt="Logo"
                                className="h-10 w-auto object-contain transition-transform duration-300"
                                onError={(e) => {
                                    (e.target as any).style.display = 'none';
                                    (e.target as any).parentElement.innerHTML = '<span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">The Thesis Club</span>';
                                }}
                            />
                        </div>

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
            </div>
        </nav>
    );
}
