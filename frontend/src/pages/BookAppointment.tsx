import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import type { Service, Staff } from '../types';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Razorpay: any;
    }
}

const BookAppointment: React.FC = () => {
    const navigate = useNavigate();

    const location = useLocation();
    const [services, setServices] = useState<Service[]>([]);
    const [staffList, setStaffList] = useState<Staff[]>([]);
    const [formData, setFormData] = useState({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        service_id: '',
        staff_id: '',
        date: '',
        time_slot: '',
        notes: '',
        payment_method: 'CASH' // CASH or ONLINE
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (location.state?.serviceId) {
            setFormData(prev => ({ ...prev, service_id: location.state.serviceId }));
        }
    }, [location.state]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [servicesRes, staffRes] = await Promise.all([
                    api.get('/services'),
                    api.get('/staff')
                ]);
                setServices(servicesRes.data);
                setStaffList(staffRes.data);
            } catch {
                toast.error('Failed to load data');
            }
        };
        fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePayment = async () => {
        try {
            const selectedService = services.find(s => s._id === formData.service_id);
            const amount = selectedService ? selectedService.base_price : 0;

            interface RazorpayOrder {
                id: string;
                amount: number;
                currency: string;
            }

            const { data: order } = await api.post<RazorpayOrder>('/payments/create-order', {
                amount: amount
            });

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_change_me',
                amount: order.amount,
                currency: order.currency,
                name: "Glow & Grace",
                description: "Appointment Booking",
                order_id: order.id,
                handler: async function (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
                    try {
                        await api.post('/payments/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        await api.post('/appointments', {
                            ...formData,
                            payment_info: {
                                transaction_id: response.razorpay_payment_id,
                                amount: order.amount / 100,
                                method: 'ONLINE',
                                status: 'PAID'
                            }
                        });

                        toast.success('Payment Successful & Appointment Booked!');
                        setTimeout(() => navigate('/'), 2000);
                    } catch {
                        toast.error('Payment Verification Failed');
                    }
                },
                prefill: {
                    name: formData.customer_name,
                    contact: formData.customer_phone,
                    email: formData.customer_email
                },
                theme: {
                    color: "#D4AF37"
                }
            };

            if (!window.Razorpay) {
                toast.error('Razorpay SDK failed to load');
                setLoading(false);
                return;
            }

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response: { error: { description: string } }) {
                toast.error(response.error.description || 'Payment Failed');
            });
            rzp.open();

        } catch (unknownErr: unknown) {
            console.error(unknownErr);
            toast.error('Could not initiate payment');
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (formData.payment_method === 'ONLINE') {
            await handlePayment();
            return;
        }

        try {
            await api.post('/appointments', formData);
            toast.success('Appointment booked successfully! We will contact you shortly.', { duration: 5000 });
            setFormData({
                customer_name: '',
                customer_email: '',
                customer_phone: '',
                service_id: '',
                staff_id: '',
                date: '',
                time_slot: '',
                notes: '',
                payment_method: 'CASH'
            });
            setTimeout(() => navigate('/'), 2000);
        } catch (err: unknown) {
            let message = 'Booking failed';
            interface ApiError {
                response?: {
                    data?: {
                        message?: string;
                    };
                };
            }
            if (err && (err as ApiError).response?.data?.message) {
                message = (err as ApiError).response!.data!.message || 'Booking failed';
            } else if (err instanceof Error) {
                message = err.message;
            }
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const timeSlots = [
        '09:00-10:00', '10:00-11:00', '11:00-12:00',
        '12:00-13:00', '13:00-14:00', '14:00-15:00',
        '15:00-16:00', '16:00-17:00', '17:00-18:00'
    ];

    return (
        <div className="max-w-4xl mx-auto my-12 px-4">
            <Toaster position="top-center" />
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
                {/* Decorative Side */}
                <div className="bg-primary-900 md:w-1/3 p-12 text-white flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-hero-pattern opacity-20 mix-blend-overlay"></div>
                    <div className="relative z-10 space-y-6">
                        <h3 className="text-3xl font-serif font-bold text-gold-400">Reserve Your Spot</h3>
                        <p className="text-gray-300 leading-relaxed font-light">
                            Take a moment for yourself. Book your appointment today and let our experts take care of the rest.
                        </p>
                        <div className="pt-8 border-t border-white/10">
                            <p className="text-sm uppercase tracking-widest text-gold-500 mb-2">Opening Hours</p>
                            <p className="text-xl font-medium">Daily: 9AM - 7PM</p>
                        </div>
                    </div>
                </div>

                {/* Form Side */}
                <div className="p-8 md:p-12 md:w-2/3 bg-white">
                    <h2 className="text-2xl font-bold font-serif text-gray-900 mb-8 border-b pb-4">Appointment Details</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Full Name</label>
                                <input
                                    type="text"
                                    name="customer_name"
                                    required
                                    value={formData.customer_name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all outline-none"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="customer_email"
                                    required
                                    value={formData.customer_email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all outline-none"
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Phone</label>
                                <input
                                    type="tel"
                                    name="customer_phone"
                                    required
                                    value={formData.customer_phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all outline-none"
                                    placeholder="(555) 000-0000"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Select Service</label>
                                <select
                                    name="service_id"
                                    required
                                    value={formData.service_id}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all outline-none"
                                >
                                    <option value="">Choose a treatment...</option>
                                    {services.map(s => (
                                        <option key={s._id} value={s._id}>{s.name} (${s.base_price})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Stylist (Optional)</label>
                                <select
                                    name="staff_id"
                                    value={formData.staff_id}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all outline-none"
                                >
                                    <option value="">No preference</option>
                                    {staffList.map(s => (
                                        <option key={s._id} value={s._id}>{s.name} ({s.role})</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    required
                                    min={new Date().toLocaleDateString('en-CA')}
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Time</label>
                                <select
                                    name="time_slot"
                                    required
                                    value={formData.time_slot}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all outline-none"
                                >
                                    <option value="">Select slot...</option>
                                    {timeSlots.map(slot => (
                                        <option key={slot} value={slot}>{slot}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Special Requests</label>
                            <textarea
                                name="notes"
                                rows={3}
                                value={formData.notes}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all outline-none"
                                placeholder="Any allergies or preferences?"
                            ></textarea>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Payment Method</label>
                            <div className="flex gap-4">
                                <label className={`flex-1 p-4 border rounded-lg cursor-pointer transition-all ${formData.payment_method === 'CASH' ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-gray-200 hover:border-gray-300'}`}>
                                    <input type="radio" name="payment_method" value="CASH" checked={formData.payment_method === 'CASH'} onChange={handleChange} className="hidden" />
                                    <div className="text-center">
                                        <span className="block font-semibold">Pay at Venue</span>
                                        <span className="text-xs text-gray-500">Cash/Card at parlor</span>
                                    </div>
                                </label>
                                <label className={`flex-1 p-4 border rounded-lg cursor-pointer transition-all ${formData.payment_method === 'ONLINE' ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-gray-200 hover:border-gray-300'}`}>
                                    <input type="radio" name="payment_method" value="ONLINE" checked={formData.payment_method === 'ONLINE'} onChange={handleChange} className="hidden" />
                                    <div className="text-center">
                                        <span className="block font-semibold">Pay Now</span>
                                        <span className="text-xs text-gray-500">Secure Online Payment</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gray-900 text-white font-bold tracking-wide rounded-lg hover:bg-gold-500 hover:text-white transition-all transform active:scale-[0.98] shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Processing...' : 'CONFIRM BOOKING'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookAppointment;
