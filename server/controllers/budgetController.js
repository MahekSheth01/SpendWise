const Budget = require('../models/Budget');

// @desc    Get budget for current month (or specific month query)
// @route   GET /api/budget
// @access  Private
exports.getBudget = async (req, res) => {
    try {
        // Default to current month YYYY-MM
        const date = new Date();
        const currentMonth = req.query.month || `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        let budget = await Budget.findOne({ userId: req.user.id, month: currentMonth });

        if (!budget) {
            // If no budget exists, return default or empty object, maybe fall back to User default
            return res.json({ amount: 2000, month: currentMonth, isDefault: true });
        }

        res.json(budget);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Set/Update Budget
// @route   POST /api/budget
// @access  Private
exports.setBudget = async (req, res) => {
    try {
        const { amount, month } = req.body;

        // Default to current month if not provided
        const date = new Date();
        const targetMonth = month || `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        let budget = await Budget.findOne({ userId: req.user.id, month: targetMonth });

        if (budget) {
            budget.amount = amount;
            await budget.save();
            return res.json(budget);
        }

        budget = new Budget({
            userId: req.user.id,
            amount,
            month: targetMonth
        });

        await budget.save();
        res.json(budget);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
