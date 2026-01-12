import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import type { Service } from '../types';

const Services: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const { data } = await api.get('/services');
                setServices(data);
            } catch {
                setError('Failed to load services');
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    if (loading) return <div className="flex justify-center items-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <div className="space-y-12 pb-12">
            <div className="text-center space-y-4">
                <h2 className="text-4xl font-serif text-gray-900">Our Signature Services</h2>
                <p className="text-gray-500 max-w-2xl mx-auto text-lg">Curated treatments designed to enhance your natural beauty. Choose from our wide range of premium services.</p>
                <div className="w-20 h-1 bg-primary-300 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service) => (
                    <div key={service._id} className="group bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-2xl hover:border-primary-100 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary-50 rounded-bl-full -mr-12 -mt-12 transition-all group-hover:bg-primary-100"></div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <span className="inline-block px-3 py-1 bg-primary-50 text-primary-700 text-xs font-bold uppercase tracking-wide rounded-full">
                                    {service.category}
                                </span>
                                <span className="text-2xl font-serif font-bold text-gray-900">${service.base_price}</span>
                            </div>

                            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">{service.name}</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">{service.description}</p>

                            <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                                <div className="flex items-center text-gray-500 text-sm">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    {service.duration_minutes} mins
                                </div>
                                <button className="text-primary-600 font-medium hover:text-primary-800 transition text-sm uppercase tracking-wide">
                                    Book Now →
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Services;
