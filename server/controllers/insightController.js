const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// @desc    Get Insight Data
// @route   GET /api/insights
// @access  Private
exports.getInsights = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);

        // Category Breakdown
        const categoryData = await Transaction.aggregate([
            { $match: { userId, type: 'expense' } },
            {
                $group: {
                    _id: "$category",
                    amount: { $sum: "$amount" }
                }
            },
            { $project: { name: "$_id", amount: 1, _id: 0 } }
        ]);

        // Top Spending Category
        const topCategory = await Transaction.aggregate([
            { $match: { userId, type: 'expense' } },
            {
                $group: {
                    _id: "$category",
                    total: { $sum: "$amount" }
                }
            },
            { $sort: { total: -1 } },
            { $limit: 1 }
        ]);

        // Spending Trend (This Week vs Last Week)
        const now = new Date();
        const startOfThisWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        startOfThisWeek.setHours(0, 0, 0, 0); // Normalize to midnight

        const startOfLastWeek = new Date(new Date(startOfThisWeek).setDate(startOfThisWeek.getDate() - 7));
        const endOfLastWeek = new Date(startOfThisWeek);

        // This Week's Total
        const thisWeekTotal = await Transaction.aggregate([
            { $match: { userId, type: 'expense', date: { $gte: startOfThisWeek } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        // Last Week's Total
        const lastWeekTotal = await Transaction.aggregate([
            { $match: { userId, type: 'expense', date: { $gte: startOfLastWeek, $lt: endOfLastWeek } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const currentTotal = thisWeekTotal[0]?.total || 0;
        const previousTotal = lastWeekTotal[0]?.total || 0;

        // Calculate Percentage Change
        let percentageChange = 0;
        let trend = 'neutral'; // 'up', 'down', 'neutral'

        if (previousTotal === 0) {
            percentageChange = currentTotal > 0 ? 100 : 0;
            trend = currentTotal > 0 ? 'up' : 'neutral';
        } else {
            percentageChange = ((currentTotal - previousTotal) / previousTotal) * 100;
            trend = percentageChange > 0 ? 'up' : (percentageChange < 0 ? 'down' : 'neutral');
        }

        // Recent Expenses for "Stored" confirmation
        const recentExpenses = await Transaction.find({ userId, type: 'expense' })
            .sort({ date: -1 })
            .limit(10);

        res.json({
            categoryData,
            topCategory: topCategory[0] ? { name: topCategory[0]._id, amount: topCategory[0].total } : null,
            spendingTrend: {
                change: Math.abs(percentageChange).toFixed(1),
                trend, // 'up' means spent MORE, 'down' means spent LESS
                currentTotal,
                previousTotal
            },
            recentExpenses
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
