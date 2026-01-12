import React, { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import type { Testimonial } from '../types';
import toast, { Toaster } from 'react-hot-toast';
import { FaStar } from 'react-icons/fa';

const ManageTestimonials: React.FC = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

    const fetchTestimonials = useCallback(async () => {
        try {
            const { data } = await api.get('/testimonials/admin');
            setTestimonials(data);
        } catch {
            toast.error('Failed to load testimonials');
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchTestimonials();
    }, [fetchTestimonials]);

    const toggleFeature = async (id: string, currentStatus: boolean) => {
        try {
            await api.put(`/testimonials/${id}`, { is_featured: !currentStatus });
            toast.success('Status updated');
            fetchTestimonials();
        } catch {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;
        try {
            await api.delete(`/testimonials/${id}`);
            toast.success('Review deleted');
            fetchTestimonials();
        } catch {
            toast.error('Failed to delete');
        }
    };

    return (
        <div className="space-y-8">
            <Toaster />
            <h2 className="text-3xl font-bold">Manage Testimonials</h2>
            <p className="text-gray-500">Approve reviews to display them on the homepage.</p>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {testimonials.map(t => (
                        <li key={t._id} className="p-6 hover:bg-gray-50">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <h4 className="text-lg font-medium text-gray-900">{t.customer_name}</h4>
                                        <div className="flex text-yellow-500 text-sm">
                                            {[...Array(t.rating)].map((_, i) => <FaStar key={i} />)}
                                        </div>
                                    </div>
                                    <p className="mt-1 text-gray-600">"{t.comment}"</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => toggleFeature(t._id, t.is_featured)}
                                        className={`px-3 py-1 rounded text-sm font-medium ${t.is_featured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                                    >
                                        {t.is_featured ? 'Featured' : 'Feature'}
                                    </button>
                                    <button onClick={() => handleDelete(t._id)} className="text-red-600 hover:text-red-900 text-sm font-medium px-2 py-1">Delete</button>
                                </div>
                            </div>
                        </li>
                    ))}
                    {testimonials.length === 0 && <li className="p-6 text-center text-gray-500">No reviews yet.</li>}
                </ul>
            </div>
        </div>
    );
};

export default ManageTestimonials;
