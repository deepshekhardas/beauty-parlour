import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

// Strict email regex (RFC 5322 simplified)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

interface FieldErrors {
    name?: string;
    email?: string;
    password?: string;
    phone?: string;
}

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: ''
    });
    const [errors, setErrors] = useState<FieldErrors>({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateField = (name: string, value: string): string | undefined => {
        switch (name) {
            case 'name':
                if (!value.trim()) return 'Full name is required';
                if (value.trim().length < 2) return 'Name must be at least 2 characters';
                break;
            case 'email':
                if (!value.trim()) return 'Email is required';
                if (!EMAIL_REGEX.test(value)) return 'Please enter a valid email address';
                break;
            case 'password':
                if (!value) return 'Password is required';
                if (value.length < 6) return 'Password must be at least 6 characters';
                break;
            case 'phone':
                if (value && !/^[+]?[\d\s-]{7,15}$/.test(value)) return 'Please enter a valid phone number';
                break;
        }
        return undefined;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Auto-clear error when user edits
        if (errors[name as keyof FieldErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        if (error) {
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate all fields
        const newErrors: FieldErrors = {};
        Object.entries(formData).forEach(([key, value]) => {
            const error = validateField(key, value);
            if (error) newErrors[key as keyof FieldErrors] = error;
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        try {
            const { data } = await api.post('/users', {
                ...formData,
                role: 'customer'
            });

            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success('Registration successful! Welcome.');
            navigate('/');
        } catch (err: unknown) {
            let message = 'Registration failed';
            interface ApiError {
                response?: {
                    data?: {
                        message?: string;
                    };
                };
            }
            if (err && (err as ApiError).response?.data?.message) {
                message = (err as ApiError).response!.data!.message || 'Registration failed';
            } else if (err instanceof Error) {
                message = err.message;
            }
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const inputBaseClass = "w-full p-3 rounded-lg border focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition";
    const getInputClass = (fieldName: keyof FieldErrors) =>
        `${inputBaseClass} ${errors[fieldName] ? 'border-red-500 bg-red-50' : 'border-gray-300'}`;

    return (
        <div className="flex justify-center items-center min-h-[70vh] py-12 bg-gray-50">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
                <h2 className="text-3xl font-serif font-bold mb-2 text-center text-gray-900">Join Us</h2>
                <p className="text-center text-gray-500 mb-8">Create an account to book faster</p>

                <form onSubmit={handleSubmit} className="space-y-4" noValidate aria-label="Registration form">
                    {/* Name Field */}
                    <div>
                        <label htmlFor="register-name" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="register-name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={getInputClass('name')}
                            placeholder="Jane Doe"
                            required
                            aria-required="true"
                            aria-invalid={!!errors.name}
                            aria-describedby={errors.name ? 'name-error' : undefined}
                        />
                        {errors.name && (
                            <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div>
                        <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="register-email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={getInputClass('email')}
                            placeholder="jane@example.com"
                            required
                            aria-required="true"
                            aria-invalid={!!errors.email}
                            aria-describedby={errors.email ? 'email-error' : undefined}
                        />
                        {errors.email && (
                            <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password Field with Toggle */}
                    <div>
                        <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="register-password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`${getInputClass('password')} pr-12`}
                                placeholder="••••••••"
                                required
                                aria-required="true"
                                aria-invalid={!!errors.password}
                                aria-describedby={errors.password ? 'password-error' : 'password-hint'}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded p-1"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                            </button>
                        </div>
                        {errors.password ? (
                            <p id="password-error" className="mt-1 text-sm text-red-600" role="alert">
                                {errors.password}
                            </p>
                        ) : (
                            <p id="password-hint" className="mt-1 text-xs text-gray-500">
                                Minimum 6 characters
                            </p>
                        )}
                    </div>

                    {/* Phone Field */}
                    <div>
                        <label htmlFor="register-phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone (Optional)
                        </label>
                        <input
                            type="tel"
                            id="register-phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={getInputClass('phone')}
                            placeholder="+1 234 567 8900"
                            aria-invalid={!!errors.phone}
                            aria-describedby={errors.phone ? 'phone-error' : undefined}
                        />
                        {errors.phone && (
                            <p id="phone-error" className="mt-1 text-sm text-red-600" role="alert">
                                {errors.phone}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gold-500 transition-all transform active:scale-[0.98] mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-busy={loading}
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary-600 font-medium hover:underline">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
