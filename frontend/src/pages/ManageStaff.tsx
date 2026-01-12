import React, { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import type { Staff } from '../types';
import toast, { Toaster } from 'react-hot-toast';

const ManageStaff: React.FC = () => {
    const [staffList, setStaffList] = useState<Staff[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        specialization: '',
        image: '',
        is_active: true
    });
    const [editingId, setEditingId] = useState<string | null>(null);

    const fetchStaff = useCallback(async () => {
        try {
            const { data } = await api.get('/staff/admin');
            setStaffList(data);
        } catch {
            toast.error('Failed to load staff');
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchStaff();
    }, [fetchStaff]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                specialization: formData.specialization.split(',').map(s => s.trim())
            };

            if (editingId) {
                await api.put(`/staff/${editingId}`, payload);
                toast.success('Staff updated');
            } else {
                await api.post('/staff', payload);
                toast.success('Staff added');
            }
            setEditingId(null);
            setFormData({ name: '', role: '', specialization: '', image: '', is_active: true });
            fetchStaff();
        } catch {
            toast.error('Operation failed');
        }
    };

    const handleEdit = (staff: Staff) => {
        setEditingId(staff._id);
        setFormData({
            name: staff.name,
            role: staff.role,
            specialization: staff.specialization.join(', '),
            image: staff.image,
            is_active: staff.is_active
        });
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to remove this staff member?')) return;
        try {
            await api.delete(`/staff/${id}`);
            toast.success('Staff removed');
            fetchStaff();
        } catch {
            toast.error('Failed to remove');
        }
    };

    return (
        <div className="space-y-8">
            <Toaster />
            <h2 className="text-3xl font-bold">Manage Staff</h2>

            <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                <h3 className="text-lg font-bold mb-4">{editingId ? 'Edit Staff' : 'Add New Staff'}</h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Name" required className="border p-2 rounded" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    <input type="text" placeholder="Role (e.g. Stylist)" required className="border p-2 rounded" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} />
                    <input type="text" placeholder="Specializations (comma separated)" className="border p-2 rounded" value={formData.specialization} onChange={e => setFormData({ ...formData, specialization: e.target.value })} />
                    <input type="url" placeholder="Image URL" className="border p-2 rounded" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />

                    <div className="flex items-center space-x-2">
                        <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({ ...formData, is_active: e.target.checked })} />
                        <label>Active</label>
                    </div>

                    <div className="md:col-span-2">
                        <button type="submit" className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-black">Save Staff</button>
                        {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData({ name: '', role: '', specialization: '', image: '', is_active: true }); }} className="ml-2 text-gray-600">Cancel</button>}
                    </div>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {staffList.map(staff => (
                    <div key={staff._id} className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
                        <img src={staff.image || 'https://via.placeholder.com/150'} alt={staff.name} className="h-48 w-full object-cover" />
                        <div className="p-4 flex-grow">
                            <h3 className="font-bold text-xl">{staff.name}</h3>
                            <p className="text-gray-500">{staff.role}</p>
                            <div className="mt-2 flex flex-wrap gap-1">
                                {staff.specialization.map((s, i) => (
                                    <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">{s}</span>
                                ))}
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
                            <span className={`text-xs font-bold ${staff.is_active ? 'text-green-600' : 'text-red-500'}`}>
                                {staff.is_active ? 'Active' : 'Inactive'}
                            </span>
                            <div className="space-x-2">
                                <button onClick={() => handleEdit(staff)} className="text-blue-600 font-medium text-sm">Edit</button>
                                <button onClick={() => handleDelete(staff._id)} className="text-red-600 font-medium text-sm">Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageStaff;
