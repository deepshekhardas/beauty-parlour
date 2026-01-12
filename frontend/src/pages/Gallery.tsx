import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import type { GalleryItem } from '../types';

const Gallery: React.FC = () => {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const { data } = await api.get('/gallery');
                setItems(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchGallery();
    }, []);

    if (loading) return <div className="text-center py-20">Loading...</div>;

    return (
        <div className="py-12 bg-gray-50 from-primary-50 to-white min-h-[80vh]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-seriffont-bold text-gray-900 mb-4">Our Work</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">See the magic our artists create.</p>
                    <div className="w-16 h-1 bg-gold-400 mx-auto mt-4 rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.map((item) => (
                        <div key={item._id} className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500">
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-80 object-cover transform group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                <span className="text-gold-300 text-sm font-medium uppercase tracking-wider mb-2">{item.category}</span>
                                <h3 className="text-white text-xl font-bold font-serif">{item.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                {items.length === 0 && (
                    <p className="text-center text-gray-500">No images available yet.</p>
                )}
            </div>
        </div>
    );
};

export default Gallery;
