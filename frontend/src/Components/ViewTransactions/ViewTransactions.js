import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { InnerLayout } from '../../styles/Layouts';
import IncomeItem from '../IncomeItem/IncomeItem'; // For incomes
import ExpenseItem from '../ExpenseItem/ExpenseItem'; // For expenses

const ViewTransactions = () => {
    const { incomes,deleteExpense, deleteIncome, expenses } = useGlobalContext();
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const combinedTransactions = [
            ...incomes.map(income => ({ ...income, type: 'Income' })),
            ...expenses.map(expense => ({ ...expense, type: 'Expense' }))
        ];

        // Sort transactions by date (newest first)
        combinedTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        setTransactions(combinedTransactions);
    }, [incomes, expenses]);

    return (
        <ViewTransactionsStyled>
            <InnerLayout>
                <h1>All Transactions</h1>
                <div className="transaction-content">
                    <div className="transactions">
                        {transactions.map((transaction) => (
                            transaction.type === 'Income' ? (
                                <IncomeItem
                                    key={transaction._id}
                                    id={transaction._id} 
                                    title={transaction.title} 
                                    description={transaction.description} 
                                    amount={transaction.amount} 
                                    date={transaction.date} 
                                    category={transaction.category} 
                                    indicatorColor="var(--color-green)"
                                    deleteItem={deleteIncome}
                                />
                            ) : (
                                <ExpenseItem
                                    key={transaction._id}
                                    id={transaction._id} 
                                    title={transaction.title} 
                                    description={transaction.description} 
                                    amount={transaction.amount} 
                                    date={transaction.date} 
                                    category={transaction.category} 
                                    indicatorColor="red"
                                    deleteItem={deleteExpense}
                                />
                            )
                        ))}
                    </div>
                </div>
            </InnerLayout>
        </ViewTransactionsStyled>
    );
};

const ViewTransactionsStyled = styled.div`
    display: flex;
    overflow: auto;

    .transaction-content {
        display: flex;
        gap: 2rem;

        .transactions {
            flex: 1;
        }
    }
`;

export default ViewTransactions;
