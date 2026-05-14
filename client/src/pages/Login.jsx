import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useState, useEffect } from 'react';
import api from '../services/api';
import { GoogleLogin } from '@react-oauth/google';

export function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await api.post('/auth/login', {
                email: formData.email,
                password: formData.password
            });

            // Save token
            localStorage.setItem('token', res.data.token);

            // Navigate to dashboard
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/google', {
                credential: credentialResponse.credential
            });
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Google authentication failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleError = () => {
        setError('Google Sign In was unsuccessful. Try again later');
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-darkBackground dark:to-gray-900 transition-colors duration-300">
            <Card className="w-full max-w-md" glass>
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                        Welcome Back
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Sign in to continue to SpendWise</p>
                </div>

                {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="rounded border-gray-300 text-primary-500 focus:ring-primary-400" />
                            <span className="text-gray-600 dark:text-gray-300">Remember me</span>
                        </label>
                        <Link to="#" className="text-primary-500 hover:text-primary-600 font-medium">
                            Forgot password?
                        </Link>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </Button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            theme="filled_blue"
                            shape="pill"
                            width="350"
                        />
                    </div>

                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-primary-500 hover:text-primary-600 font-medium font-semibold hover:underline">
                            Sign up
                        </Link>
                    </p>
                </form>
            </Card>
        </div>
    );
}
