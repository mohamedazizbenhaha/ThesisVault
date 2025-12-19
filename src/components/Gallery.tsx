import { useState } from 'react';
import { X, ZoomIn, Play } from 'lucide-react';
import { MediaCategory } from '@/lib/content';

interface GalleryProps {
    categories: MediaCategory[];
    type: 'images' | 'videos';
}

export default function Gallery({ categories, type }: GalleryProps) {
    const [selectedItem, setSelectedItem] = useState<{ url: string; category: string } | null>(null);

    if (categories.length === 0) {
        return (
            <div className="text-center py-20 text-gray-500 bg-white rounded-xl border border-gray-200">
                No {type} found in /content/{type}
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {categories.map((category) => (
                <div key={category.name} className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                        {category.name}
                        <span className="ml-3 text-sm font-normal text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                            {category.items.length}
                        </span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {category.items.map((item) => {
                            const url = `/content/${type}/${category.name === 'General' ? '' : category.name + '/'}${item}`;
                            return (
                                <div
                                    key={item}
                                    className="group relative aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all border border-gray-200"
                                    onClick={() => setSelectedItem({ url, category: category.name })}
                                >
                                    {type === 'images' ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={url}
                                            alt={item}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-900 group-hover:bg-gray-800 transition-colors relative">
                                            <video src={url} className="w-full h-full object-cover opacity-60" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Play fill="white" className="text-white ml-1" size={24} />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-end p-4">
                                        <p className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity truncate w-full shadow-black drop-shadow-md">
                                            {item}
                                        </p>
                                    </div>
                                    {type === 'images' && (
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="bg-black/50 text-white p-1.5 rounded-full backdrop-blur-sm">
                                                <ZoomIn size={16} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}

            {/* Modal */}
            {selectedItem && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
                    onClick={() => setSelectedItem(null)}
                >
                    <button
                        onClick={() => setSelectedItem(null)}
                        className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                    >
                        <X size={32} />
                    </button>

                    <div
                        className="max-w-7xl max-h-[90vh] w-full flex flex-col items-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {type === 'images' ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={selectedItem.url}
                                alt="Full size"
                                className="max-w-full max-h-[85vh] object-contain rounded-md shadow-2xl"
                            />
                        ) : (
                            <video
                                src={selectedItem.url}
                                controls
                                autoPlay
                                className="max-w-full max-h-[85vh] rounded-md shadow-2xl bg-black"
                            />
                        )}
                        <p className="text-white/80 mt-4 font-medium text-lg">{selectedItem.url.split('/').pop()}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
