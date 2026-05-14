import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { TrendingUp, TrendingDown, AlertCircle, Minus, ChevronRight, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';

export function Insights() {
    const [data, setData] = useState({
        categoryData: [],
        topCategory: null,
        spendingTrend: { change: 0, trend: 'neutral', currentTotal: 0, previousTotal: 0 },
        recentExpenses: []
    });

    useEffect(() => {
        fetchInsights();
    }, []);

    const fetchInsights = async () => {
        try {
            const res = await api.get('/insights');
            setData(res.data);
        } catch (err) {
            console.error('Error fetching insights:', err);
        }
    };

    const trend = data.spendingTrend || { change: 0, trend: 'neutral' };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">Financial Insights</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className={`
            ${trend.trend === 'up' ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900' : ''}
            ${trend.trend === 'down' ? 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900' : ''}
            ${trend.trend === 'neutral' ? 'bg-gray-50 dark:bg-gray-800' : ''}
        `}>
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl 
                ${trend.trend === 'up' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : ''}
                ${trend.trend === 'down' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : ''}
                ${trend.trend === 'neutral' ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400' : ''}
             `}>
                            {trend.trend === 'up' && <TrendingUp size={24} />}
                            {trend.trend === 'down' && <TrendingDown size={24} />}
                            {trend.trend === 'neutral' && <Minus size={24} />}
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Spending Trend</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {trend.trend === 'neutral' ? (
                                    "Spending is stable compared to last week."
                                ) : (
                                    <span className={trend.trend === 'up' ? 'text-red-500' : 'text-green-500'}>
                                        <span className="font-bold">{trend.change}% {trend.trend === 'up' ? 'more' : 'less'}</span> this week compared to last week.
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="bg-purple-50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-900">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
                            <AlertCircle size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Top Category</h3>
                            {data.topCategory ? (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Highest spending in <span className="font-bold">{data.topCategory.name}</span> (₹{data.topCategory.amount}).
                                </p>
                            ) : (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">No expense data available.</p>
                            )}
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Spending by Category</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.categoryData}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="amount" fill="#A78BFA" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="lg:col-span-1">
                    <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <FileText size={20} /> Expenses Analyzed
                    </h2>
                    <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                        {data.recentExpenses && data.recentExpenses.length > 0 ? (
                            data.recentExpenses.map((expense) => (
                                <div key={expense._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate w-32">{expense.title}</p>
                                        <p className="text-xs text-gray-500">{new Date(expense.date).toLocaleDateString()}</p>
                                    </div>
                                    <span className="font-bold text-red-500 text-sm">-₹{expense.amount}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">No expenses recorded yet.</p>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
