import { dashboard, expenses, transactions, trend } from '../utils/Icons';

export const menuItems = [
    {
        id: 1,
        title: 'Dashboard',
        icon: dashboard,
        link: '/dashboard',
    },
    {
        id: 2,
        title: "View Transactions",
        icon: transactions,
        link: "/transactions",  // Update link to the appropriate route for transactions
    },
    {
        id: 3,
        title: "Incomes",
        icon: trend,
        link: "/incomes",  // Update link to the appropriate route for incomes
    },
    {
        id: 4,
        title: "Expenses",
        icon: expenses,
        link: "/expenses",  // Update link to the appropriate route for expenses
    }
];
