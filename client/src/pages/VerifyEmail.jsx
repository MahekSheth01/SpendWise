import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export function VerifyEmail() {
    const { token } = useParams();
    const [status, setStatus] = useState('loading'); // loading, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verify = async () => {
            try {
                const res = await api.get(`/auth/verify/${token}`);
                setStatus('success');
                setMessage(res.data.message);
            } catch (err) {
                setStatus('error');
                setMessage(err.response?.data?.message || 'Verification failed. The link may be invalid or expired.');
            }
        };
        verify();
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-darkBackground dark:to-gray-900 transition-colors duration-300">
            <Card className="w-full max-w-md text-center py-10" glass>
                {status === 'loading' && (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-16 h-16 text-primary-500 animate-spin" />
                        <h2 className="text-2xl font-bold">Verifying your email...</h2>
                        <p className="text-gray-500">Please wait a moment.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center gap-4">
                        <CheckCircle2 className="w-16 h-16 text-green-500" />
                        <h2 className="text-2xl font-bold">Email Verified!</h2>
                        <p className="text-gray-500">{message}</p>
                        <Link to="/login" className="w-full mt-4">
                            <Button className="w-full">Go to Login</Button>
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center gap-4">
                        <XCircle className="w-16 h-16 text-red-500" />
                        <h2 className="text-2xl font-bold">Verification Failed</h2>
                        <p className="text-gray-500">{message}</p>
                        <Link to="/signup" className="w-full mt-4">
                            <Button variant="secondary" className="w-full">Back to Signup</Button>
                        </Link>
                    </div>
                )}
            </Card>
        </div>
    );
}
