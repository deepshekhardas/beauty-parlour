import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSpa, FaStar, FaLeaf, FaQuoteLeft } from 'react-icons/fa';
import api from '../api/axios';
import type { Testimonial } from '../types';

const Home: React.FC = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

    useEffect(() => {
        api.get('/testimonials').then(res => setTestimonials(res.data));
    }, []);

    return (
        <div className="-mt-8"> {/* Negative margin to offset container padding */}
            {/* Hero Section */}
            <div className="relative h-[85vh] flex items-center justify-center bg-gray-900 overflow-hidden">
                <div
                    className="absolute inset-0 bg-hero-pattern bg-cover bg-center opacity-40 transform hover:scale-105 transition duration-[30s]"
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-8 animate-fade-in-up">
                    <span className="inline-block py-2 px-6 border border-white/30 rounded-full text-white/90 text-sm tracking-[0.2em] uppercase backdrop-blur-md bg-white/5">
                        Luxury Beauty & Wellness
                    </span>
                    <h1 className="text-5xl md:text-8xl font-serif text-white leading-tight">
                        Reveal Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-100 to-gold-400 italic">True Radiance</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-200 font-light max-w-2xl mx-auto font-sans">
                        Where elegance meets expertise. Experience world-class beauty treatments in a sanctuary of serenity.
                    </p>
                    <div className="pt-8 flex flex-col sm:flex-row gap-6 justify-center">
                        <Link to="/book" className="px-10 py-4 bg-white text-gray-900 rounded-full font-bold tracking-wide hover:bg-gold-400 hover:text-white transition-all transform hover:-translate-y-1 shadow-2xl hover:shadow-gold-500/50">
                            BOOK APPOINTMENT
                        </Link>
                        <Link to="/services" className="px-10 py-4 border border-white/30 text-white rounded-full font-medium hover:bg-white/10 backdrop-blur-sm transition-all">
                            EXPLORE SERVICES
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-gold-500 font-bold tracking-wider uppercase text-sm">Our Philosophy</span>
                        <h2 className="text-3xl md:text-5xl font-serif text-gray-900 mt-2 mb-6">Why Choose Glow & Grace?</h2>
                        <div className="w-24 h-1 bg-gold-400 mx-auto"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="text-center space-y-6 p-8 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-2xl transition-all duration-500 group border border-transparent hover:border-gold-200/50">
                            <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <FaSpa className="text-4xl text-primary-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold font-serif text-gray-900 mb-2">Premium Treatments</h3>
                                <p className="text-gray-600 leading-relaxed font-light">
                                    Exquisite therapies designed to rejuvenate your body and soul using the finest global products.
                                </p>
                            </div>
                        </div>
                        <div className="text-center space-y-6 p-8 rounded-3xl bg-gold-50/50 hover:bg-white hover:shadow-2xl transition-all duration-500 group border border-transparent hover:border-gold-200/50">
                            <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <FaStar className="text-4xl text-gold-500" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold font-serif text-gray-900 mb-2">Expert Artists</h3>
                                <p className="text-gray-600 leading-relaxed font-light">
                                    Our seasoned professionals render tailored services with precision and artistry.
                                </p>
                            </div>
                        </div>
                        <div className="text-center space-y-6 p-8 rounded-3xl bg-green-50/50 hover:bg-white hover:shadow-2xl transition-all duration-500 group border border-transparent hover:border-gold-200/50">
                            <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <FaLeaf className="text-4xl text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold font-serif text-gray-900 mb-2">Organic & Safe</h3>
                                <p className="text-gray-600 leading-relaxed font-light">
                                    We prioritize your well-being with dermatologically tested, organic, and cruelty-free products.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonials Section */}
            <div className="py-24 bg-dark-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary-600 opacity-20 rounded-full blur-[100px]"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <FaQuoteLeft className="text-4xl text-gold-500 mx-auto mb-4 opacity-50" />
                        <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">Client Love</h2>
                        <div className="w-24 h-1 bg-gold-400 mx-auto"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map(t => (
                            <div key={t._id} className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:border-gold-400/50 transition-colors">
                                <div className="flex space-x-1 text-gold-400 mb-4">
                                    {[...Array(t.rating)].map((_, i) => <FaStar key={i} />)}
                                </div>
                                <p className="text-gray-300 italic mb-6 leading-relaxed">"{t.comment}"</p>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center font-bold text-white text-sm">
                                        {t.customer_name.charAt(0)}
                                    </div>
                                    <span className="ml-3 font-medium text-white">{t.customer_name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
