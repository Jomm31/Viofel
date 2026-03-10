import React, { useState, useCallback } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';

function LoginForm() {
    const { executeRecaptcha } = useGoogleReCaptcha();
    const { errors = {} } = usePage().props;
    const [captchaError, setCaptchaError] = useState('');
    const [processing, setProcessing] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        remember: false,
    });

    const setData = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setCaptchaError('');
        setProcessing(true);

        let token = '';
        if (executeRecaptcha) {
            try {
                token = await executeRecaptcha('admin_login');
            } catch (err) {
                console.warn('reCAPTCHA failed to execute:', err);
                // Allow login to proceed without token (backend skips on local env)
            }
        }

        router.post('/admin/login', {
            username: formData.username,
            password: formData.password,
            remember: formData.remember,
            recaptcha_token: token,
        }, {
            onFinish: () => setProcessing(false),
        });
    }, [executeRecaptcha, formData]);

    return (
        <>
            <Head title="Admin Login" />
            
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Admin Login
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Sign in to access the admin dashboard
                        </p>
                    </div>
                    
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="username" className="sr-only">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={(e) => setData('username', e.target.value)}
                                />
                                {errors.username && (
                                    <p className="mt-2 text-sm text-red-600">{errors.username}</p>
                                )}
                            </div>
                            
                            <div>
                                <label htmlFor="password" className="sr-only">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                                )}
                            </div>
                        </div>

                        {/* reCAPTCHA error display */}
                        {(captchaError || errors.recaptcha_token) && (
                            <p className="text-sm text-red-600 text-center">
                                {captchaError || errors.recaptcha_token}
                            </p>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Signing in...' : 'Sign in'}
                            </button>
                        </div>
                    </form>

                    <p className="text-xs text-gray-400 text-center">
                        This site is protected by reCAPTCHA and the Google{' '}
                        <a href="https://policies.google.com/privacy" className="underline" target="_blank" rel="noreferrer">Privacy Policy</a> and{' '}
                        <a href="https://policies.google.com/terms" className="underline" target="_blank" rel="noreferrer">Terms of Service</a> apply.
                    </p>
                </div>
            </div>
        </>
    );
}

export default function Login({ recaptchaSiteKey }) {
    return (
        <GoogleReCaptchaProvider reCaptchaKey={recaptchaSiteKey}>
            <LoginForm />
        </GoogleReCaptchaProvider>
    );
}
