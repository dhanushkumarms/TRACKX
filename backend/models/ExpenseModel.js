const mongoose = require('mongoose');


const ExpenseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        maxLength: 50,
        trim: true
    },
    type: {
        type: String,
        default:"expense"
    },
    date: {
        type: Date,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        maxLength: 50,
        trim: true
    },
}, {timestamps: true})

module.exports = mongoose.model('Expense', ExpenseSchema)