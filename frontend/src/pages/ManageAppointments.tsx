import React, { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import type { Appointment } from '../types';
import toast, { Toaster } from 'react-hot-toast';

const ManageAppointments: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [filterStatus, setFilterStatus] = useState<string>('');

    const fetchAppointments = useCallback(async () => {
        try {
            const { data } = await api.get(`/appointments${filterStatus ? `?status=${filterStatus}` : ''}`);
            setAppointments(data);
        } catch {
            toast.error('Failed to load appointments');
        }
    }, [filterStatus]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchAppointments();
    }, [fetchAppointments]);

    const updateStatus = async (id: string, status: string) => {
        try {
            await api.put(`/appointments/${id}`, { status });
            toast.success(`Marked as ${status}`);
            fetchAppointments();
        } catch {
            toast.error('Update failed');
        }
    };

    return (
        <div className="space-y-6">
            <Toaster />
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Manage Appointments</h2>
                <select
                    className="border p-2 rounded"
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                >
                    <option value="">All Statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                </select>
            </div>

            <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {appointments.map(apt => (
                            <tr key={apt._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{apt.date}</div>
                                    <div className="text-sm text-gray-500">{apt.time_slot}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{apt.customer_name}</div>
                                    <div className="text-sm text-gray-500">{apt.customer_phone}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {apt.service_snapshot?.name || (typeof apt.service_id === 'object' ? apt.service_id.name : 'Unknown')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${apt.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                                            apt.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                apt.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {apt.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                                    {apt.status === 'PENDING' && (
                                        <>
                                            <button onClick={() => updateStatus(apt._id, 'CONFIRMED')} className="text-green-600 hover:text-green-900">Confirm</button>
                                            <button onClick={() => updateStatus(apt._id, 'CANCELLED')} className="text-red-600 hover:text-red-900">Cancel</button>
                                        </>
                                    )}
                                    {apt.status === 'CONFIRMED' && (
                                        <button onClick={() => updateStatus(apt._id, 'COMPLETED')} className="text-blue-600 hover:text-blue-900">Complete</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageAppointments;
