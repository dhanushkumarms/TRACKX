const request = require('supertest');
const app = require('../app'); // Path to your Express app
const User = require('../models/UserModel'); // Path to your User model
const Income = require('../models/IncomeModel'); // Path to your Income model
const Expense = require('../models/ExpenseModel'); // Path to your Expense model
const mongoose = require('mongoose');
require('dotenv').config();

// Increase the timeout to account for network delays
jest.setTimeout(15000); // 15 seconds

describe('API Tests', () => {
    let token;
    let incomeId; // Declare incomeId here to access it in all tests
    let expenseId; // Declare expenseId for expense tests
    const testUser = {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
    };
    
    const testIncome = {
        title: 'Test Income',
        amount: 100,
        type: 'income', // Ensure the type is set correctly
        category: 'Salary',
        description: 'Monthly salary',
        date: new Date(),
    };

    const testExpense = {
        title: 'Test Expense',
        amount: 50,
        type: 'expense',
        category: 'Food',
        description: 'Lunch at a restaurant',
        date: new Date(),
    };

    // Connect to MongoDB Atlas before running the tests
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URL);
    });

    // Clean up the database before running each test
    beforeEach(async () => {
        await User.deleteMany({ email: testUser.email }); // Ensure user does not already exist
        await Income.deleteMany({}); // Clean up any existing incomes
        await Expense.deleteMany({}); // Clean up any existing expenses
    });

    // Disconnect from MongoDB after all tests are done
    afterAll(async () => {
        await mongoose.disconnect();
    });

    // Check non-existing routes
    it('should return 404 for non-existing routes', async () => {
        const response = await request(app).get('/api/v1/some-non-existing-route');
        expect(response.status).toBe(404);
    });

    // Authentication Tests
    it('should register a new user', async () => {
        const response = await request(app)
            .post('/api/v1/auth/register')
            .send(testUser);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'User created successfully!');
    });

    it('should not register a user with an existing email', async () => {
        await request(app)
            .post('/api/v1/auth/register')
            .send(testUser);

        const response = await request(app)
            .post('/api/v1/auth/register')
            .send(testUser);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Username or email already exists!');
    });

    it('should log in an existing user', async () => {
        await request(app)
            .post('/api/v1/auth/register')
            .send(testUser);

        const response = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password,
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        token = response.body.token; // Save the token for future tests
    });

    it('should not log in with invalid credentials', async () => {
        const response = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'wronguser@example.com',
                password: 'wrongpassword',
            });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error', 'Invalid credentials');
    });

     // Income Tests
    it('should add a new income', async () => {
        const response = await request(app)
            .post('/api/v1/incomes') // Path to your add income route
            .set('Authorization', `Bearer ${token}`)
            .send(testIncome);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Income added');
        incomeId = response.body._id; // Save the ID for future tests
    });

    it('should not add an income with missing fields', async () => {
        const response = await request(app)
            .post('/api/v1/incomes') // Path to your add income route
            .set('Authorization', `Bearer ${token}`)
            .send({}); // No fields

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'All fields are required!');
    });

    it('should get all incomes for the logged-in user', async () => {
        await request(app)
            .post('/api/v1/incomes') // First add the income
            .set('Authorization', `Bearer ${token}`)
            .send(testIncome);

        const response = await request(app)
            .get('/api/v1/incomes') // Path to your get incomes route
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0]).toHaveProperty('title', testIncome.title);
    });

    /*('should delete an income', async () => {
        const addResponse = await request(app)
            .post('/api/v1/incomes') // Add the income first
            .set('Authorization', `Bearer ${token}`)
            .send(testIncome);

        incomeId = addResponse.body._id; // Save the ID for deletion

        const deleteResponse = await request(app)
            .delete(`/api/v1/incomes/${incomeId}`) // Use the saved incomeId
            .set('Authorization', `Bearer ${token}`);

        expect(deleteResponse.status).toBe(200);
        expect(deleteResponse.body).toHaveProperty('message', 'Income Deleted');
    });

    it('should not delete a non-existing income', async () => {
        const deleteResponse = await request(app)
            .delete(`/api/v1/incomes/${"fe234e"}`) // Non-existing ID
            .set('Authorization', `Bearer ${token}`);

        expect(deleteResponse.status).toBe(404);
        expect(deleteResponse.body).toHaveProperty('message', 'Income not found');
    });*/
    // Expense Tests
    it('should add a new expense', async () => {
        const response = await request(app)
            .post('/api/v1/expenses') // Path to your add expense route
            .set('Authorization', `Bearer ${token}`)
            .send(testExpense);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Expense Added');
        expenseId = response.body._id; // Save the ID for future tests
    });

    it('should not add an expense with missing fields', async () => {
        const response = await request(app)
            .post('/api/v1/expenses') // Path to your add expense route
            .set('Authorization', `Bearer ${token}`)
            .send({}); // No fields

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'All fields are required!');
    });

    it('should get all expenses for the logged-in user', async () => {
        await request(app)
            .post('/api/v1/expenses') // First add the expense
            .set('Authorization', `Bearer ${token}`)
            .send(testExpense);

        const response = await request(app)
            .get('/api/v1/expenses') // Path to your get expenses route
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0]).toHaveProperty('title', testExpense.title);
    });

    /*it('should delete an expense', async () => {
        const addResponse = await request(app)
            .post('/api/v1/expenses') // Add the expense first
            .set('Authorization', `Bearer ${token}`)
            .send(testExpense);

        expenseId = addResponse.body._id; // Save the ID for deletion

        const deleteResponse = await request(app)
            .delete(`/api/v1/expenses/${expenseId}`) // Path to your delete expense route
            .set('Authorization', `Bearer ${token}`);

        expect(deleteResponse.status).toBe(200);
        expect(deleteResponse.body).toHaveProperty('message', 'Expense Deleted');
    });*/

    it('should not delete a non-existing expense', async () => {
        const deleteResponse = await request(app)
            .delete(`/api/v1/expenses/invalid-id`) // Non-existing ID
            .set('Authorization', `Bearer ${token}`);

        expect(deleteResponse.status).toBe(404);
        expect(deleteResponse.body).toHaveProperty('message', 'Expense not found');
    });
});
