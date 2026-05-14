import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { TransactionModal } from '../components/ui/TransactionModal';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import api from '../services/api';
import { Plus, Minus, Trash2, TrendingUp, TrendingDown, Minus as MinusIcon, Zap, Edit2 } from 'lucide-react';

export function Dashboard() {
    const [stats, setStats] = useState({
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        expenseTrend: [],
        categoryDist: [],
        recentTransactions: [],
        insights: { spendingTrend: { trend: 'neutral', change: 0 }, topCategory: null }
    });
    const [budget, setBudget] = useState(2000);
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);

    const [editingTransaction, setEditingTransaction] = useState(null);

    useEffect(() => {
        fetchDashboardData();
        fetchBudget();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const res = await api.get('/dashboard');
            setStats(res.data);
        } catch (err) {
            console.error('Error fetching dashboard stats:', err);
        }
    };

    const fetchBudget = async () => {
        try {
            const res = await api.get('/budget');
            if (res.data.amount) setBudget(res.data.amount);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateTransaction = async (data) => {
        try {
            if (editingTransaction) {
                await api.put(`/transactions/${editingTransaction._id}`, data);
            } else {
                await api.post('/transactions', data);
            }
            fetchDashboardData();
            setIsExpenseModalOpen(false);
            setIsIncomeModalOpen(false);
            setEditingTransaction(null);
        } catch (err) {
            console.error('Error saving transaction:', err);
        }
    };

    const openEditModal = (transaction) => {
        setEditingTransaction(transaction);
        if (transaction.type === 'expense') {
            setIsExpenseModalOpen(true);
        } else {
            setIsIncomeModalOpen(true);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this transaction?')) return;
        try {
            await api.delete(`/transactions/${id}`);
            fetchDashboardData();
        } catch (err) {
            console.error('Error deleting transaction:', err);
        }
    };

    const COLORS = ['#A78BFA', '#F472B6', '#60A5FA', '#34D399', '#FBBF24'];
    const budgetUsage = Math.min((stats.totalExpense / budget) * 100, 100);

    // Insight Helpers
    const trend = stats.insights?.spendingTrend || { trend: 'neutral', change: 0 };
    const topCat = stats.insights?.topCategory;

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <div className="flex gap-3">
                    <Button onClick={() => setIsIncomeModalOpen(true)} className="bg-green-500 hover:bg-green-600 border-green-500 text-white">
                        <Plus size={20} className="mr-2" /> Add Income
                    </Button>
                    <Button onClick={() => setIsExpenseModalOpen(true)} className="bg-red-500 hover:bg-red-600 border-red-500 text-white">
                        <Minus size={20} className="mr-2" /> Add Expense
                    </Button>
                </div>
            </div>

            {/* Dynamic Summary Insights Block */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border-indigo-100 dark:border-indigo-900">
                    <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg ${trend.trend === 'up' ? 'bg-red-100 text-red-500' : trend.trend === 'down' ? 'bg-green-100 text-green-500' : 'bg-gray-100 text-gray-500'}`}>
                            {trend.trend === 'up' ? <TrendingUp size={20} /> : trend.trend === 'down' ? <TrendingDown size={20} /> : <MinusIcon size={20} />}
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Weekly Insight</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {trend.trend === 'neutral' ? 'Spending is consistent.' : (
                                    <>You spent <span className={`font-bold ${trend.trend === 'up' ? 'text-red-500' : 'text-green-500'}`}>{trend.change}% {trend.trend === 'up' ? 'more' : 'less'}</span> this week.</>
                                )}
                            </p>
                        </div>
                    </div>
                </Card>
                <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-100 dark:border-purple-900">
                    <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-purple-100 text-purple-500 dark:bg-purple-900/30">
                            <Zap size={20} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Top Expense</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {topCat ? (
                                    <>Most money went to <span className="font-bold text-gray-800 dark:text-gray-200">{topCat.name}</span> (₹{topCat.amount}).</>
                                ) : 'No sufficient data yet.'}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Income</h3>
                    <p className="text-2xl font-bold text-green-500 mt-1">₹{stats.totalIncome.toFixed(2)}</p>
                </Card>
                <Card>
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Expense</h3>
                    <p className="text-2xl font-bold text-red-500 mt-1">₹{stats.totalExpense.toFixed(2)}</p>
                </Card>
                <Card>
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Balance</h3>
                    <p className={`text-2xl font-bold mt-1 ${stats.balance >= 0 ? 'text-primary-500' : 'text-red-500'}`}>
                        ₹{stats.balance.toFixed(2)}
                    </p>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Expense Trend */}
                <Card className="lg:col-span-2">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Expense Trend</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats.expenseTrend}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line type="monotone" dataKey="amount" stroke="#A78BFA" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Recent Transactions List */}
                <Card className="lg:col-span-1">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Recent Transactions</h3>
                    <div className="space-y-3">
                        {stats.recentTransactions?.length === 0 ? (
                            <p className="text-gray-500 text-sm">No recent transactions.</p>
                        ) : (
                            stats.recentTransactions?.map((t) => (
                                <div key={t._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${t.type === 'expense' ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-500'}`}>
                                            {t.type === 'expense' ? '💰' : '💵'}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{t.title}</p>
                                            <p className="text-xs text-gray-500">{new Date(t.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-sm font-bold ${t.type === 'expense' ? 'text-red-500' : 'text-green-500'}`}>
                                            {t.type === 'expense' ? '-' : '+'}₹{t.amount}
                                        </span>
                                        <button onClick={() => openEditModal(t)} className="text-gray-400 hover:text-blue-500 transition-colors">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(t._id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category Distribution */}
                <Card>
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Spending by Category</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.categoryDist}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={0}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {stats.categoryDist.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Budget Usage Circular Progress */}
                <Card className="flex flex-col items-center justify-center">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100 w-full text-left">Budget Usage</h3>
                    <div className="relative w-48 h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[{ value: budgetUsage }, { value: 100 - budgetUsage }]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    startAngle={90}
                                    endAngle={-270}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    <Cell fill={budgetUsage > 90 ? '#EF4444' : '#A78BFA'} />
                                    <Cell fill="#E5E7EB" />
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-bold text-gray-900 dark:text-white">{Math.round(budgetUsage)}%</span>
                            <span className="text-xs text-gray-500">of ₹{budget}</span>
                        </div>
                    </div>
                </Card>
            </div>

            <TransactionModal
                isOpen={isExpenseModalOpen}
                onClose={() => { setIsExpenseModalOpen(false); setEditingTransaction(null); }}
                onSubmit={handleCreateTransaction}
                title={editingTransaction ? "Edit Expense" : "Add Expense"}
                initialData={editingTransaction || { type: 'expense' }}
            />
            <TransactionModal
                isOpen={isIncomeModalOpen}
                onClose={() => { setIsIncomeModalOpen(false); setEditingTransaction(null); }}
                onSubmit={handleCreateTransaction}
                title={editingTransaction ? "Edit Income" : "Add Income"}
                initialData={editingTransaction || { type: 'income', category: 'Salary' }}
            />
        </div>
    );
}
