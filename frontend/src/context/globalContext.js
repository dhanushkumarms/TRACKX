import React, { useContext, useState, useEffect } from "react";
import axios from 'axios';

const BASE_URL = "https://trackx-3mni4ufp.b4a.run/api/v1/";

const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState(null);
    const [totalExpense, setTotalExpense] = useState(0);

    const saveToken = (token) => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
        setToken(token);
    };

    useEffect(() => {
        if (token) {
            getIncomes();
            getExpenses();
        }
    }, [token]);

    useEffect(() => {
        // Calculate total whenever expenses change
        const total = expenses.reduce((acc, expense) => acc + expense.amount, 0);
        getExpenses();
    }, [expenses]); // Depend on expenses to recalculate when they change

    useEffect(() => {
        // Calculate total whenever incomes change
        const total = incomes.reduce((acc, income) => acc + income.amount, 0);
        getIncomes();
    }, [incomes]); // Depend on incomes to recalculate when they change

    const addIncome = async (income) => {
        try {
            const response = await axios.post(`${BASE_URL}incomes`, income, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIncomes((prev) => [...prev, response.data]); // Update state with the new income
        } catch (err) {
            setError(err.response.data.message);
        }
    };

    const getIncomes = async () => {
        try {
            const response = await axios.get(`${BASE_URL}incomes`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIncomes(response.data);
        } catch (err) {
            setError(err.response.data.message);
        }
    };

    const deleteIncome = async (id) => {
        try {
            await axios.delete(`${BASE_URL}incomes/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIncomes((prev) => prev.filter(income => income._id !== id)); // Remove deleted income from state
        } catch (err) {
            setError(err.response.data.message);
        }
    };

    const totalIncome = () => {
        return incomes.reduce((total, income) => total + income.amount, 0);
    };

    const addExpense = async (expense) => {
        try {
            const response = await axios.post(`${BASE_URL}expenses`, expense, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setExpenses((prev) => [...prev, response.data]); // Update state with the new expense
        } catch (err) {
            setError(err.response.data.message);
        }
    };

    const getExpenses = async () => {
        try {
            const response = await axios.get(`${BASE_URL}expenses`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setExpenses(response.data);
        } catch (err) {
            setError(err.response.data.message);
        }
    };

    const deleteExpense = async (id) => {
        try {
            await axios.delete(`${BASE_URL}expenses/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setExpenses((prev) => prev.filter(expense => expense._id !== id)); // Remove deleted expense from state
        } catch (err) {
            setError(err.response.data.message);
        }
    };

    const totalExpenses = () => {
        return expenses.reduce((total, expense) => total + expense.amount, 0);
    };

    const totalBalance = () => {
        return totalIncome() - totalExpenses();
    };

    const transactionHistory = () => {
        const history = [...incomes, ...expenses];
        history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return history.slice(0, 3);
    };

    const getTransactions = () => {
        const combinedTransactions = [
            ...incomes.map(income => ({ ...income, type: 'Income' })),
            ...expenses.map(expense => ({ ...expense, type: 'Expense' }))
        ];
        combinedTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        return combinedTransactions;
    };

    return (
        <GlobalContext.Provider value={{
            token,
            setToken: saveToken,
            addIncome,
            getIncomes,
            incomes,
            deleteIncome,
            expenses,
            totalIncome,
            addExpense,
            getExpenses,
            deleteExpense,
            totalExpenses,
            totalBalance,
            transactionHistory,
            getTransactions,
            error,
            setError
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    return useContext(GlobalContext);
};
