const express = require('express');
const { protect } = require('../controllers/auth'); // Ensure 'protect' is defined
const { addExpense, getExpenses, deleteExpense } = require('../controllers/expense'); // Ensure these functions are defined
const { addIncome, getIncomes, deleteIncome } = require('../controllers/income'); // Ensure these functions are defined
const router = express.Router();

// Define routes for expenses
router.post('/expenses', protect, addExpense); // Ensure addExpense is defined
router.get('/expenses', protect, getExpenses); // Ensure getExpenses is defined
router.delete('/expenses/:id', protect, deleteExpense); // Add route to delete an expense by ID

// Define routes for incomes
router.post('/incomes', protect, addIncome); // Ensure addIncome is defined
router.get('/incomes', protect, getIncomes); // Ensure getIncomes is defined
router.delete('/incomes/:id', protect, deleteIncome); // Add route to delete an income by ID

module.exports = router;
