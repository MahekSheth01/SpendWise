const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Transaction = require('./models/Transaction');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Find the first user
        const user = await User.findOne();
        if (!user) {
            console.log('No user found to seed data for. Please register a user first.');
            process.exit(1);
        }

        console.log(`Seeding data for user: ${user.name} (${user.email})`);

        // Clear existing transactions for this user (optional, commented out for safety)
        // await Transaction.deleteMany({ userId: user._id });

        const transactions = [
            // This Week Expenses
            { title: 'Grocery Shopping', amount: 1500, type: 'expense', category: 'Food', date: new Date() },
            { title: 'Uber to Work', amount: 250, type: 'expense', category: 'Travel', date: new Date() },
            { title: 'Netflix Subscription', amount: 499, type: 'expense', category: 'Entertainment', date: new Date() },

            // Last Week Expenses (to trigger trend)
            { title: 'Weekly Groceries', amount: 1200, type: 'expense', category: 'Food', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
            { title: 'Cinema Tickets', amount: 800, type: 'expense', category: 'Entertainment', date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) },

            // Income
            { title: 'Salary', amount: 50000, type: 'income', category: 'Salary', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
            { title: 'Freelance Project', amount: 5000, type: 'income', category: 'Freelance', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },

            // More History
            { title: 'Electricity Bill', amount: 2500, type: 'expense', category: 'Bills', date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) },
            { title: 'New Sneakers', amount: 3500, type: 'expense', category: 'Shopping', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
        ];

        const transactionsWithUser = transactions.map(t => ({ ...t, userId: user._id }));

        await Transaction.insertMany(transactionsWithUser);

        console.log('Data seeded successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
