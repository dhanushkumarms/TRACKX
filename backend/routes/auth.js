const express = require('express');
const { registerUser, loginUser } = require('../controllers/auth');

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
    res.send('Auth route is working!');
});

// Registration route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

module.exports = router;
