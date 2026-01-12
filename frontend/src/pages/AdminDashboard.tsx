import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import type { AnalyticsData } from '../types';
import { FaCalendarCheck, FaUsers, FaMoneyBillWave, FaClock, FaCut, FaImages, FaCommentAlt } from 'react-icons/fa';

const AdminDashboard: React.FC = () => {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const { data } = await api.get('/appointments/analytics');
                setAnalytics(data);
            } catch {
                console.error('Failed to load analytics');
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return <div>Loading dashboard...</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
                <div className="p-2">
                    <span className="text-sm text-gray-500">Welcome Back, Admin</span>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Link to="/admin/services" className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow hover:shadow-md transition border border-gray-100 group">
                    <FaCut className="text-2xl text-pink-500 mb-2 group-hover:scale-110 transition" />
                    <span className="font-medium text-gray-700">Services</span>
                </Link>
                <Link to="/admin/appointments" className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow hover:shadow-md transition border border-gray-100 group">
                    <FaCalendarCheck className="text-2xl text-blue-500 mb-2 group-hover:scale-110 transition" />
                    <span className="font-medium text-gray-700">Appointments</span>
                </Link>
                <Link to="/admin/staff" className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow hover:shadow-md transition border border-gray-100 group">
                    <FaUsers className="text-2xl text-purple-500 mb-2 group-hover:scale-110 transition" />
                    <span className="font-medium text-gray-700">Staff</span>
                </Link>
                <Link to="/admin/gallery" className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow hover:shadow-md transition border border-gray-100 group">
                    <FaImages className="text-2xl text-orange-500 mb-2 group-hover:scale-110 transition" />
                    <span className="font-medium text-gray-700">Gallery</span>
                </Link>
                <Link to="/admin/testimonials" className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow hover:shadow-md transition border border-gray-100 group">
                    <FaCommentAlt className="text-2xl text-green-500 mb-2 group-hover:scale-110 transition" />
                    <span className="font-medium text-gray-700">Reviews</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow border border-gray-100 flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                        <FaCalendarCheck size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Total Bookings</p>
                        <p className="text-2xl font-bold">{analytics?.summary.total}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border border-gray-100 flex items-center space-x-4">
                    <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full">
                        <FaClock size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Pending</p>
                        <p className="text-2xl font-bold">{analytics?.summary.pending}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border border-gray-100 flex items-center space-x-4">
                    <div className="p-3 bg-green-100 text-green-600 rounded-full">
                        <FaUsers size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Confirmed</p>
                        <p className="text-2xl font-bold">{analytics?.summary.confirmed}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border border-gray-100 flex items-center space-x-4">
                    <div className="p-3 bg-red-100 text-red-600 rounded-full">
                        <FaMoneyBillWave size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Completed</p>
                        <p className="text-2xl font-bold">{analytics?.summary.completed}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                <h3 className="text-lg font-bold mb-4">Popular Services</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {analytics?.popularServices.map((service, idx) => (
                                <tr key={idx}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{service._id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.count}</td>
                                </tr>
                            ))}
                            {analytics?.popularServices.length === 0 && (
                                <tr><td colSpan={2} className="px-6 py-4 text-center text-gray-500">No data available</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
