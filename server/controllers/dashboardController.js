const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// @desc    Get Dashboard Stats
// @route   GET /api/dashboard
// @access  Private
exports.getDashboardStats = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);

        // Aggregation for Total Income and Expense
        const totals = await Transaction.aggregate([
            { $match: { userId } },
            {
                $group: {
                    _id: '$type',
                    total: { $sum: '$amount' }
                }
            }
        ]);

        const income = totals.find(t => t._id === 'income')?.total || 0;
        const expense = totals.find(t => t._id === 'expense')?.total || 0;
        const balance = income - expense;

        // Aggregation for Expense Trend (Daily)
        const expenseTrend = await Transaction.aggregate([
            { $match: { userId, type: 'expense' } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    amount: { $sum: "$amount" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Aggregation for Category Distribution (Expense)
        const categoryDist = await Transaction.aggregate([
            { $match: { userId, type: 'expense' } },
            {
                $group: {
                    _id: "$category",
                    value: { $sum: "$amount" }
                }
            },
            { $project: { name: "$_id", value: 1, _id: 0 } }
        ]);

        // Recent Transactions (Limit 5)
        const recentTransactions = await Transaction.find({ userId })
            .sort({ date: -1 })
            .limit(5);

        // --- Insights Logic for Dashboard ---

        // 1. Top Spending Category
        const topCategory = await Transaction.aggregate([
            { $match: { userId, type: 'expense' } },
            { $group: { _id: "$category", total: { $sum: "$amount" } } },
            { $sort: { total: -1 } },
            { $limit: 1 }
        ]);

        // 2. Spending Trend (This Week vs Last Week)
        const now = new Date();
        const startOfThisWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        startOfThisWeek.setHours(0, 0, 0, 0); // Normalize to midnight

        const startOfLastWeek = new Date(new Date(startOfThisWeek).setDate(startOfThisWeek.getDate() - 7));
        const endOfLastWeek = new Date(startOfThisWeek);

        const thisWeekTotal = await Transaction.aggregate([
            { $match: { userId, type: 'expense', date: { $gte: startOfThisWeek } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const lastWeekTotal = await Transaction.aggregate([
            { $match: { userId, type: 'expense', date: { $gte: startOfLastWeek, $lt: endOfLastWeek } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const currentTotal = thisWeekTotal[0]?.total || 0;
        const previousTotal = lastWeekTotal[0]?.total || 0;

        let percentageChange = 0;
        let trend = 'neutral';

        if (previousTotal === 0) {
            percentageChange = currentTotal > 0 ? 100 : 0;
            trend = currentTotal > 0 ? 'up' : 'neutral';
        } else {
            percentageChange = ((currentTotal - previousTotal) / previousTotal) * 100;
            trend = percentageChange > 0 ? 'up' : (percentageChange < 0 ? 'down' : 'neutral');
        }

        res.json({
            totalIncome: income,
            totalExpense: expense,
            balance,
            expenseTrend: expenseTrend.map(t => ({ date: t._id, amount: t.amount })),
            categoryDist,
            recentTransactions,
            insights: {
                topCategory: topCategory[0] ? { name: topCategory[0]._id, amount: topCategory[0].total } : null,
                spendingTrend: {
                    change: Math.abs(percentageChange).toFixed(1),
                    trend,
                    currentTotal,
                    previousTotal
                }
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
