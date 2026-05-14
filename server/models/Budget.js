const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    month: {
        type: String, // Format: "YYYY-MM"
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

// Compound index to ensure one budget per month per user
BudgetSchema.index({ userId: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Budget', BudgetSchema);
