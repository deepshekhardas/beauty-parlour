import React, { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import type { Service } from '../types';
import toast, { Toaster } from 'react-hot-toast';

const ManageServices: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        description: '',
        duration_minutes: 60,
        base_price: 0,
        is_active: true
    });
    const [editingId, setEditingId] = useState<string | null>(null);

    const fetchServices = useCallback(async () => {
        try {
            const { data } = await api.get('/services/admin');
            setServices(data);
        } catch {
            toast.error('Failed to load services');
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchServices();
    }, [fetchServices]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/services/${editingId}`, formData);
                toast.success('Service updated');
            } else {
                await api.post('/services', formData);
                toast.success('Service created');
            }
            setEditingId(null);
            setFormData({ name: '', category: '', description: '', duration_minutes: 60, base_price: 0, is_active: true });
            fetchServices();
        } catch {
            toast.error('Operation failed');
        }
    };

    const handleEdit = (service: Service) => {
        setEditingId(service._id);
        setFormData({
            name: service.name,
            category: service.category,
            description: service.description,
            duration_minutes: service.duration_minutes,
            base_price: service.base_price,
            is_active: service.is_active
        });
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to deactivate this service?')) return;
        try {
            await api.delete(`/services/${id}`);
            toast.success('Service deactivated');
            fetchServices();
        } catch {
            toast.error('Failed to deactivate');
        }
    };

    return (
        <div className="space-y-8">
            <Toaster />
            <h2 className="text-3xl font-bold">Manage Services</h2>

            <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                <h3 className="text-lg font-bold mb-4">{editingId ? 'Edit Service' : 'Add New Service'}</h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Service Name" required className="border p-2 rounded" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    <input type="text" placeholder="Category" required className="border p-2 rounded" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                    <input type="number" placeholder="Duration (min)" required className="border p-2 rounded" value={formData.duration_minutes} onChange={e => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })} />
                    <input type="number" placeholder="Price ($)" required className="border p-2 rounded" value={formData.base_price} onChange={e => setFormData({ ...formData, base_price: parseInt(e.target.value) })} />
                    <textarea placeholder="Description" className="border p-2 rounded md:col-span-2" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                    <div className="flex items-center space-x-2">
                        <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({ ...formData, is_active: e.target.checked })} />
                        <label>Active</label>
                    </div>
                    <div className="md:col-span-2">
                        <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded">Save Service</button>
                        {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData({ name: '', category: '', description: '', duration_minutes: 60, base_price: 0, is_active: true }); }} className="ml-2 text-gray-600">Cancel</button>}
                    </div>
                </form>
            </div>

            <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {services.map(service => (
                            <tr key={service._id}>
                                <td className="px-6 py-4 whitespace-nowrap">{service.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{service.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap">${service.base_price}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${service.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {service.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button onClick={() => handleEdit(service)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                    <button onClick={() => handleDelete(service._id)} className="text-red-600 hover:text-red-900">Deactivate</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageServices;
