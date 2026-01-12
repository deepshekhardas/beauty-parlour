import React, { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import type { GalleryItem } from '../types';
import toast, { Toaster } from 'react-hot-toast';

const ManageGallery: React.FC = () => {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        image: ''
    });

    const fetchGallery = useCallback(async () => {
        try {
            const { data } = await api.get('/gallery');
            setItems(data);
        } catch {
            toast.error('Failed to load gallery');
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchGallery();
    }, [fetchGallery]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/gallery', formData);
            toast.success('Image added to gallery');
            setFormData({ title: '', category: '', image: '' });
            fetchGallery();
        } catch {
            toast.error('Operation failed');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to remove this image?')) return;
        try {
            await api.delete(`/gallery/${id}`);
            toast.success('Image removed');
            fetchGallery();
        } catch {
            toast.error('Failed to remove');
        }
    };

    return (
        <div className="space-y-8">
            <Toaster />
            <h2 className="text-3xl font-bold">Manage Gallery</h2>

            <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                <h3 className="text-lg font-bold mb-4">Add New Image</h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" placeholder="Title" required className="border p-2 rounded" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                    <select required className="border p-2 rounded" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                        <option value="">Select Category</option>
                        <option value="Hair">Hair</option>
                        <option value="Makeup">Makeup</option>
                        <option value="Face">Face</option>
                        <option value="Nails">Nails</option>
                        <option value="Body">Body</option>
                    </select>
                    <input type="url" placeholder="Image URL" required className="border p-2 rounded" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />

                    <div className="md:col-span-3">
                        <button type="submit" className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-black">Upload Item</button>
                    </div>
                </form>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {items.map(item => (
                    <div key={item._id} className="relative group rounded-lg overflow-hidden shadow-md">
                        <img src={item.image} alt={item.title} className="w-full h-40 object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                            <p className="font-bold">{item.title}</p>
                            <p className="text-xs mb-2">{item.category}</p>
                            <button onClick={() => handleDelete(item._id)} className="bg-red-600 px-3 py-1 rounded text-xs hover:bg-red-700">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageGallery;
