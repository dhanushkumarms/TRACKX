const mongoose = require('mongoose');
const ExpenseSchema = require("../models/ExpenseModel");

exports.addExpense = async (req, res) => {
    const { title, amount, category, description, date } = req.body;

    const expense = new ExpenseSchema({
        title,
        amount: Number(amount),
        category,
        description,
        date,
        user: req.user, // Ensure req.user contains the logged-in user's ID
    });

    try {
        // Validations
        if (!title || !category || !description || !date) {
            return res.status(400).json({ message: 'All fields are required!' });
        }

        if (!Number.isFinite(amount) || amount <= 0) {
            return res.status(400).json({ message: 'Amount must be a positive number!' });
        }

        await expense.save();
        res.status(200).json({ message: 'Expense Added' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getExpenses = async (req, res) => {
    try {
        const expenses = await ExpenseSchema.find({ user: req.user }).sort({ createdAt: -1 });
        res.status(200).json(expenses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteExpense = async (req, res) => {
    const { id } = req.params;

    // Validate ObjectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Expense not found' });
    }

    try {
        const expense = await ExpenseSchema.findByIdAndDelete(id);

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        res.status(200).json({ message: 'Expense Deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
