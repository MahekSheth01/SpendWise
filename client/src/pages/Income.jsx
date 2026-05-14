import { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Plus, Trash2, Edit2, Search, Filter } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';

export function Income() {
    const { income, deleteTransaction, addTransaction } = useExpenses();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({ title: '', amount: '', category: 'Salary', date: '', type: 'income' });

    const handleAdd = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.amount || !formData.date) return;
        addTransaction({ ...formData, amount: parseFloat(formData.amount) });
        setIsModalOpen(false);
        setFormData({ title: '', amount: '', category: 'Salary', date: '', type: 'income' });
    };

    const filteredIncome = income.filter(i =>
        i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">Income</h1>
                    <p className="text-gray-500 dark:text-gray-400">Track your earnings sources.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus size={20} /> Add Income
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search income..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-400/20 focus:border-primary-400 outline-none transition-all placeholder:text-gray-400 text-gray-900 dark:text-gray-100"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid gap-4">
                {filteredIncome.length === 0 ? (
                    <Card className="text-center py-12">
                        <p className="text-gray-500">No income records found.</p>
                    </Card>
                ) : (
                    filteredIncome.map((item) => (
                        <Card key={item._id} className="flex items-center justify-between p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-500 text-xl">
                                    💵
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.category} • {new Date(item.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="font-bold text-green-500">+₹{item.amount.toFixed(2)}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => deleteTransaction(item._id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Income">
                <form onSubmit={handleAdd} className="space-y-4">
                    <Input
                        label="Title"
                        placeholder="e.g. Salary"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                    <Input
                        label="Amount"
                        type="number"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={e => setFormData({ ...formData, amount: e.target.value })}
                        required
                        step="0.01"
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
                        <select
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-400/20 focus:border-primary-400 outline-none"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="Salary">Salary</option>
                            <option value="Freelance">Freelance</option>
                            <option value="Investments">Investments</option>
                            <option value="Gift">Gift</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <Input
                        label="Date"
                        type="date"
                        value={formData.date}
                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                        required
                    />
                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Add Income</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
