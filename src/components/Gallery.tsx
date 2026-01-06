import { useState, useMemo } from 'react';
import { X, ZoomIn, Play, Search, ChevronDown, ChevronUp, Image as ImageIcon, Video } from 'lucide-react';
import { MediaCategory } from '@/lib/content';

interface GalleryProps {
    categories: MediaCategory[];
    type: 'images' | 'videos';
    searchQuery?: string;
}

export default function Gallery({ categories, type, searchQuery = '' }: GalleryProps) {
    const [selectedItem, setSelectedItem] = useState<{
        url: string;
        category: string;
        title: string;
        description: string;
        filename: string;
    } | null>(null);
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

    const filteredCategories = useMemo(() => {
        if (!searchQuery.trim()) return categories;

        return categories.filter(category =>
            category.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [categories, searchQuery]);

    const toggleExpand = (categoryName: string) => {
        setExpandedCategories(prev => {
            const next = new Set(prev);
            if (next.has(categoryName)) {
                next.delete(categoryName);
            } else {
                next.add(categoryName);
            }
            return next;
        });
    };

    if (categories.length === 0) {
        return (
            <div className="text-center py-20 text-gray-500 bg-white rounded-xl border border-gray-200 shadow-sm">
                No {type} found in /content/{type}
            </div>
        );
    }

    return (
        <>
            <div className="space-y-12 pb-12">
                {filteredCategories.map((category) => {
                    const isExpanded = expandedCategories.has(category.name);
                    const visibleItems = isExpanded ? category.items : category.items.slice(0, 4);
                    const hasMore = category.items.length > 4;

                    return (
                        <div key={category.name} className="space-y-6">
                            <div className="flex items-center justify-between group">
                                <h2 className="text-2xl font-black text-gray-900 flex items-center tracking-tight">
                                    {category.name}
                                    <span className="ml-3 text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 uppercase tracking-widest">
                                        {category.items.length} Items
                                    </span>
                                </h2>
                                {hasMore && (
                                    <button
                                        onClick={() => toggleExpand(category.name)}
                                        className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl transition-all border border-gray-100 shadow-sm"
                                    >
                                        {isExpanded ? (
                                            <>
                                                <ChevronUp size={16} /> Show Less
                                            </>
                                        ) : (
                                            <>
                                                <ChevronDown size={16} /> Explore {category.items.length - 4} More
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {visibleItems.map((item) => {
                                    const url = `/content/${type}/${category.name === 'General' ? '' : category.name + '/'}${item}`;
                                    const metadata = category.itemMetadata?.find(m => m.file === item);
                                    const displayTitle = metadata?.title || item;

                                    return (
                                        <div
                                            key={item}
                                            className="group relative aspect-video bg-white rounded-3xl overflow-hidden cursor-pointer shadow-lg shadow-gray-200/40 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 border border-gray-100"
                                            onClick={() => setSelectedItem({
                                                url,
                                                category: category.name,
                                                title: displayTitle,
                                                description: metadata?.description || "No description available for this item.",
                                                filename: item
                                            })}
                                        >
                                            {/* Overlay Background */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

                                            {type === 'images' ? (
                                                <img
                                                    src={url}
                                                    alt={displayTitle}
                                                    className="w-full h-full object-contain transition-all duration-700 [image-rendering:-webkit-optimize-contrast] [image-rendering:crisp-edges]"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-900 relative">
                                                    <video src={url} className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
                                                    <div className="absolute inset-0 flex items-center justify-center z-10">
                                                        <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-300 shadow-xl">
                                                            <Play fill="white" className="text-white ml-1" size={24} />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="absolute inset-x-0 bottom-0 p-5 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                                <p className="text-white text-sm font-black truncate leading-tight tracking-tight opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                                    {displayTitle}
                                                </p>
                                            </div>

                                            {type === 'images' && (
                                                <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-y-2 group-hover:translate-y-0">
                                                    <div className="bg-white/90 text-blue-600 p-2 rounded-xl backdrop-blur-md shadow-lg">
                                                        <ZoomIn size={18} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Premium Split Modal */}
            {selectedItem && (
                <div
                    className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center animate-fade-in"
                    onClick={() => setSelectedItem(null)}
                >
                    <button
                        onClick={() => setSelectedItem(null)}
                        className="absolute top-8 right-8 text-white/40 hover:text-white bg-white/5 hover:bg-white/10 p-3 rounded-full transition-all z-[10000] backdrop-blur-md border border-white/10"
                    >
                        <X size={32} />
                    </button>

                    <div
                        className="bg-white rounded-[2.5rem] w-[95%] sm:w-[90%] max-w-7xl h-[90vh] sm:h-[85vh] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in zoom-in fade-in duration-500 m-4 sm:m-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* 2/3 Media Section */}
                        <div className="w-full md:w-2/3 bg-gray-900/5 flex items-center justify-center relative overflow-hidden p-4 sm:p-6">
                            <div className="w-full h-full flex items-center justify-center relative">
                                {type === 'images' ? (
                                    <img
                                        src={selectedItem.url}
                                        alt={selectedItem.title}
                                        className="w-full h-full object-contain rounded-xl shadow-2xl [image-rendering:-webkit-optimize-contrast] [image-rendering:crisp-edges]"
                                    />
                                ) : (
                                    <video
                                        src={selectedItem.url}
                                        controls
                                        autoPlay
                                        className="w-full h-full object-contain bg-black rounded-xl shadow-2xl"
                                    />
                                )}
                            </div>
                        </div>

                        {/* 1/3 Info Section */}
                        <div className="w-full md:w-1/3 flex flex-col h-[60vh] md:h-auto bg-white border-l border-gray-100">
                            <div className="p-8 sm:p-10 flex flex-col h-full">
                                <div className="space-y-3 mb-10">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                                        {type === 'images' ? <ImageIcon size={12} /> : <Video size={12} />}
                                        {selectedItem.category}
                                    </div>
                                    <h2 className="text-3xl font-black text-gray-900 leading-tight tracking-tight">
                                        {selectedItem.title}
                                    </h2>
                                </div>

                                <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 -mr-4 space-y-8">
                                    <div className="space-y-4">
                                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Description</h3>
                                        <div className="bg-gray-50/80 rounded-[2rem] p-6 sm:p-8 shadow-inner border border-gray-100/50">
                                            <p className="text-gray-600 leading-relaxed font-medium text-lg">
                                                {selectedItem.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-8 border-t border-gray-50">
                                    <a
                                        href={selectedItem.url}
                                        download
                                        className="w-full flex items-center justify-center gap-3 bg-gray-900 text-white rounded-[1.5rem] py-5 font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-all shadow-xl shadow-gray-200 active:scale-[0.98] group/btn"
                                    >
                                        {type === 'images' ? (
                                            <ImageIcon size={18} className="group-hover/btn:scale-110 transition-transform" />
                                        ) : (
                                            <Play size={18} fill="white" className="group-hover/btn:scale-110 transition-transform" />
                                        )}
                                        {type === 'images' ? 'Download High-Res' : 'Download Video Asset'}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
