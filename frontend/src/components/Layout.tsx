import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

const Layout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userStr = localStorage.getItem('userInfo');
    const user = userStr ? JSON.parse(userStr) : null;
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    const isPublicHome = location.pathname === '/';

    return (
        <div className="flex flex-col min-h-screen bg-white text-gray-900 font-sans">
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || !isPublicHome ? 'bg-white/80 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'
                    }`}
            >
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <div className="flex items-center">
                        <Link to="/" className={`text-2xl font-serif font-bold tracking-tight ${scrolled || !isPublicHome ? 'text-gray-900' : 'text-white'}`}>
                            Glow <span className="text-primary-600">&</span> Grace
                        </Link>
                    </div>
                    <div className="hidden md:flex space-x-8 items-center">
                        <Link to="/" className={`font-medium transition-colors ${scrolled || !isPublicHome ? 'text-gray-600 hover:text-primary-600' : 'text-white/90 hover:text-white'}`}>Home</Link>
                        <Link to="/services" className={`font-medium transition-colors ${scrolled || !isPublicHome ? 'text-gray-600 hover:text-primary-600' : 'text-white/90 hover:text-white'}`}>Services</Link>
                        <Link to="/gallery" className={`font-medium transition-colors ${scrolled || !isPublicHome ? 'text-gray-600 hover:text-primary-600' : 'text-white/90 hover:text-white'}`}>Gallery</Link>

                        {/* Show Logout for ANY logged in user */}
                        {user ? (
                            <>
                                {user.role === 'admin' && (
                                    <Link to="/admin" className={`font-medium transition-colors ${scrolled || !isPublicHome ? 'text-gray-600 hover:text-primary-600' : 'text-white/90 hover:text-white'}`}>Dashboard</Link>
                                )}
                                <span className={`font-medium ${scrolled || !isPublicHome ? 'text-gray-900' : 'text-white'}`}>Hi, {user.name.split(' ')[0]}</span>
                                <button onClick={handleLogout} className="text-red-500 hover:text-red-600 font-medium">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className={`font-medium transition-colors ${scrolled || !isPublicHome ? 'text-gray-600 hover:text-primary-600' : 'text-white/90 hover:text-white'}`}>Sign In</Link>
                            </>
                        )}

                        <Link to="/book" className={`px-6 py-2 rounded-full font-medium transition-all ${scrolled || !isPublicHome
                            ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/30'
                            : 'bg-white text-gray-900 hover:bg-gold-100'
                            }`}>
                            Book Now
                        </Link>
                    </div>
                </nav>
            </header>

            {/* Add padding top only if not home to avoid content hiding behind fixed header */}
            <main className={`flex-grow w-full ${isPublicHome ? '' : 'pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}`}>
                <Outlet />
            </main>

            <footer className="bg-dark-900 text-gray-400 py-12">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-2xl font-serif text-white mb-4">Glow & Grace</h3>
                        <p className="max-w-xs text-gray-500">Elevating beauty standards with premium care and artistry. Visit us for an unforgettable experience.</p>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><Link to="/services" className="hover:text-primary-400 transition">Services</Link></li>
                            <li><Link to="/gallery" className="hover:text-primary-400 transition">Gallery</Link></li>
                            <li><Link to="/book" className="hover:text-primary-400 transition">Book Appointment</Link></li>
                            <li><Link to="/login" className="hover:text-primary-400 transition">Login / Join</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">Contact</h4>
                        <ul className="space-y-2 text-sm">
                            <li>123 Beauty Lane, Glamour City</li>
                            <li>+1 (555) 123-4567</li>
                            <li>hello@glowandgrace.com</li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} Glow & Grace Beauty Parlour. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
