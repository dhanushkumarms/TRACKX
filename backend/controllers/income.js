const IncomeSchema = require("../models/IncomeModel");

// Add new income for the logged-in user
exports.addIncome = async (req, res) => {
    const { title, amount, category, description, date } = req.body;

    const income = new IncomeSchema({
        title,
        amount,
        category,
        description,
        date,
        user: req.user, // Attach the logged-in user's ID
    });

    try {
        // Validations
        if (!title || !category || !description || !date) {
            return res.status(400).json({ message: 'All fields are required!' });
        }

        if (amount <= 0 || typeof amount !== 'number') {
            return res.status(400).json({ message: 'Amount must be a positive number!' });
        }

        // Save the income record
        await income.save();
        res.status(200).json({ message: 'Income added' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get all incomes for the logged-in user
exports.getIncomes = async (req, res) => {
    try {
        const incomes = await IncomeSchema.find({ user: req.user }).sort({ createdAt: -1 });
        res.status(200).json(incomes);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete an income by ID
exports.deleteIncome = async (req, res) => {
    const { id } = req.params;

    try {
        const income = await IncomeSchema.findByIdAndDelete(id);
        if (!income) {
            return res.status(404).json({ message: 'Income not found' });
        }

        res.status(200).json({ message: 'Income Deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
