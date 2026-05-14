import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useExpenses } from '../context/ExpenseContext';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import api from '../services/api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export function Budget() {
    const { totalExpense } = useExpenses();
    const [budget, setBudget] = useState(2000);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newBudget, setNewBudget] = useState('');

    useEffect(() => {
        fetchBudget();
    }, []);

    const fetchBudget = async () => {
        try {
            const res = await api.get('/budget');
            setBudget(res.data.amount || 2000);
        } catch (err) {
            console.error('Error fetching budget:', err);
        }
    };

    const handleUpdateBudget = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/budget', { amount: parseFloat(newBudget) });
            setBudget(res.data.amount);
            setIsModalOpen(false);
        } catch (err) {
            console.error('Error updating budget:', err);
        }
    };

    const openModal = () => {
        setNewBudget(budget);
        setIsModalOpen(true);
    }

    // Mock Categories for Chart
    const data = [
        { name: 'Food', value: 400 },
        { name: 'Travel', value: 300 },
        { name: 'Bills', value: 300 },
        { name: 'Shopping', value: 200 },
    ];
    const COLORS = ['#A78BFA', '#F472B6', '#60A5FA', '#34D399'];

    const percentage = Math.min((totalExpense / budget) * 100, 100);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">Budget Management</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Monthly Budget</h2>
                        <Button variant="ghost" size="sm" onClick={openModal}>
                            Edit Budget
                        </Button>
                    </div>

                    <div className="text-4xl font-bold text-gray-900 dark:text-gray-100">₹{budget.toFixed(2)}</div>

                    <div className="mt-6">
                        <div className="flex justify-between text-sm mb-2 text-gray-600 dark:text-gray-400">
                            <span>Spent: ₹{totalExpense.toFixed(2)}</span>
                            <span>Remaining: ₹{(budget - totalExpense).toFixed(2)}</span>
                        </div>
                        <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-500 ${percentage > 90 ? 'bg-red-500' : 'bg-primary-400'}`}
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-right">{percentage.toFixed(1)}% used</p>
                    </div>
                </Card>

                <Card>
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Expense Distribution</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Set Monthly Budget">
                <form onSubmit={handleUpdateBudget} className="space-y-4">
                    <Input
                        label="Budget Amount (₹)"
                        type="number"
                        value={newBudget}
                        onChange={(e) => setNewBudget(e.target.value)}
                        required
                    />
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Save Budget</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
