import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3, ShieldCheck, Wallet } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function LandingPage() {
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/dashboard');
        }
    }, [navigate]);
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-darkBackground dark:to-gray-900 flex flex-col transition-colors duration-300">
            <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full sticky top-0 z-10 backdrop-blur-sm">
                <div className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                    SpendWise
                </div>
                <div className="flex gap-4">
                    <Link to="/login">
                        <Button variant="ghost">Login</Button>
                    </Link>
                    <Link to="/signup">
                        <Button>Get Started</Button>
                    </Link>
                </div>
            </nav>

            <main className="flex-1 flex flex-col items-center justify-center text-center p-6 max-w-4xl mx-auto mt-10 md:mt-20">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight"
                >
                    Track your money. <br />
                    <span className="text-primary-400">Control your future.</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl"
                >
                    SpendWise helps you track expenses, set budgets, and visualize your spending patterns with beautiful insights.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                >
                    <Link to="/signup" className="w-full sm:w-auto">
                        <Button size="lg" className="w-full">Start Tracking Free</Button>
                    </Link>
                    <Link to="/dashboard" className="w-full sm:w-auto">
                        <Button variant="outline" size="lg" className="w-full">View Demo</Button>
                    </Link>
                </motion.div>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-8 mt-20 text-left w-full">
                    {[
                        { icon: BarChart3, title: 'Smart Insights', desc: 'Visual charts to understand where your money goes.' },
                        { icon: Wallet, title: 'Budget Tracking', desc: 'Set monthly limits and get alerts before you go over.' },
                        { icon: ShieldCheck, title: 'Secure & Private', desc: 'Your financial data is encrypted and safe with us.' },
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow"
                        >
                            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 text-primary-500 rounded-xl flex items-center justify-center mb-4">
                                <feature.icon size={24} />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
}
