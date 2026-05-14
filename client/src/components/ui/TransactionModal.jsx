import { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Input } from './Input';
import { Button } from './Button';

export function TransactionModal({ isOpen, onClose, onSubmit, title, initialData = {} }) {
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        category: 'Food',
        date: new Date().toLocaleDateString('en-CA'),
        type: 'expense'
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                title: initialData.title || '',
                amount: initialData.amount || '',
                category: initialData.category || 'Food',
                date: initialData.date ? initialData.date.split('T')[0] : new Date().toLocaleDateString('en-CA'),
                type: initialData.type || 'expense'
            });
        }
    }, [isOpen, initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...formData, amount: parseFloat(formData.amount) });
        setFormData({ title: '', amount: '', category: 'Food', date: '', type: 'expense' });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Title"
                    placeholder="e.g. Grocery Shopping"
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
                        {formData.type === 'expense' ? (
                            <>
                                <option value="Food">Food</option>
                                <option value="Travel">Travel</option>
                                <option value="Shopping">Shopping</option>
                                <option value="Bills">Bills</option>
                                <option value="Entertainment">Entertainment</option>
                            </>
                        ) : (
                            <>
                                <option value="Salary">Salary</option>
                                <option value="Freelance">Freelance</option>
                                <option value="Investments">Investments</option>
                                <option value="Gift">Gift</option>
                                <option value="Other">Other</option>
                            </>
                        )}
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
                    <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Save Transaction</Button>
                </div>
            </form>
        </Modal>
    );
}
