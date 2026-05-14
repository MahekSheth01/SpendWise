import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch transactions on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchTransactions();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchTransactions = async () => {
        try {
            const res = await api.get('/transactions');
            setTransactions(res.data);
        } catch (err) {
            console.error('Error fetching transactions:', err);
        } finally {
            setLoading(false);
        }
    };

    const addTransaction = async (transaction) => {
        try {
            const res = await api.post('/transactions', transaction);
            setTransactions((prev) => [res.data, ...prev]);
        } catch (err) {
            console.error('Error adding transaction:', err);
        }
    };

    const deleteTransaction = async (id) => {
        try {
            await api.delete(`/transactions/${id}`);
            setTransactions((prev) => prev.filter((t) => t._id !== id));
        } catch (err) {
            console.error('Error deleting transaction:', err);
        }
    };

    // Edit is not yet implemented in backend, but we kept the function signature
    const editTransaction = (updatedTransaction) => {
        // Placeholder for future update API
        setTransactions((prev) =>
            prev.map((t) => (t._id === updatedTransaction._id ? updatedTransaction : t))
        );
    };

    const expenses = transactions.filter(t => t.type === 'expense');
    const income = transactions.filter(t => t.type === 'income');

    const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const totalIncome = income.reduce((acc, curr) => acc + curr.amount, 0);
    const balance = totalIncome - totalExpense;

    return (
        <ExpenseContext.Provider value={{
            transactions,
            expenses,
            income,
            totalExpense,
            totalIncome,
            balance,
            addTransaction,
            deleteTransaction,
            editTransaction,
            loading
        }}>
            {children}
        </ExpenseContext.Provider>
    );
};

export const useExpenses = () => useContext(ExpenseContext);
