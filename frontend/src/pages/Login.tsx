import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

// Strict email regex (RFC 5322 simplified)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

interface FieldErrors {
    email?: string;
    password?: string;
}

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<FieldErrors>({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateField = (name: string, value: string): string | undefined => {
        switch (name) {
            case 'email':
                if (!value.trim()) return 'Email is required';
                if (!EMAIL_REGEX.test(value)) return 'Please enter a valid email address';
                break;
            case 'password':
                if (!value) return 'Password is required';
                break;
        }
        return undefined;
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        // Auto-clear error when user edits
        if (errors.email) {
            setErrors(prev => ({ ...prev, email: undefined }));
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        // Auto-clear error when user edits
        if (errors.password) {
            setErrors(prev => ({ ...prev, password: undefined }));
        }
    };

    const handleBlur = (field: 'email' | 'password') => {
        const value = field === 'email' ? email : password;
        const error = validateField(field, value);
        if (error) {
            setErrors(prev => ({ ...prev, [field]: error }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate all fields
        const newErrors: FieldErrors = {};
        const emailError = validateField('email', email);
        const passwordError = validateField('password', password);

        if (emailError) newErrors.email = emailError;
        if (passwordError) newErrors.password = passwordError;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        try {
            const { data } = await api.post('/users/login', { email, password });
            localStorage.setItem('userInfo', JSON.stringify(data));

            if (data.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err: unknown) {
            // Show server error as a general form error
            interface ApiError {
                response?: {
                    data?: {
                        message?: string;
                    };
                };
            }
            let message = 'Login failed';
            if (err && (err as ApiError).response?.data?.message) {
                message = (err as ApiError).response!.data!.message || 'Login failed';
            } else if (err instanceof Error) {
                message = err.message;
            }
            setErrors({ email: message });
        } finally {
            setLoading(false);
        }
    };

    const inputBaseClass = "w-full p-3 rounded-lg border focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition";
    const getInputClass = (fieldName: keyof FieldErrors) =>
        `${inputBaseClass} ${errors[fieldName] ? 'border-red-500 bg-red-50' : 'border-gray-300'}`;

    return (
        <div className="flex justify-center items-center min-h-[60vh] bg-gray-50 py-12">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
                <h2 className="text-3xl font-serif font-bold mb-2 text-center text-gray-900">Welcome Back</h2>
                <p className="text-center text-gray-500 mb-8">Sign in to manage your bookings</p>

                <form onSubmit={handleSubmit} className="space-y-4" noValidate aria-label="Login form">
                    {/* Email Field */}
                    <div>
                        <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="login-email"
                            value={email}
                            onChange={handleEmailChange}
                            onBlur={() => handleBlur('email')}
                            className={getInputClass('email')}
                            placeholder="Enter email"
                            required
                            aria-required="true"
                            aria-invalid={!!errors.email}
                            aria-describedby={errors.email ? 'login-email-error' : undefined}
                        />
                        {errors.email && (
                            <p id="login-email-error" className="mt-1 text-sm text-red-600" role="alert">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password Field with Toggle */}
                    <div>
                        <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="login-password"
                                value={password}
                                onChange={handlePasswordChange}
                                onBlur={() => handleBlur('password')}
                                className={`${getInputClass('password')} pr-12`}
                                placeholder="Enter password"
                                required
                                aria-required="true"
                                aria-invalid={!!errors.password}
                                aria-describedby={errors.password ? 'login-password-error' : undefined}
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
                        {errors.password && (
                            <p id="login-password-error" className="mt-1 text-sm text-red-600" role="alert">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gold-500 transition-all transform active:scale-[0.98] mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-busy={loading}
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary-600 font-medium hover:underline">
                        Create one
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
