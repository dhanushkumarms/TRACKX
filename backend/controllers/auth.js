const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');

// Register User
exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const user = new User({ username, email, password });
        await user.save();
        res.status(201).json({ message: 'User created successfully!' });
    } catch (error) {
        if (error.code === 11000) {
            // Handle duplicate username/email error
            return res.status(400).json({ error: 'Username or email already exists!' });
        }
        res.status(400).json({ error: 'Error creating user', details: error.message });
    }
};


// Login user
exports.loginUser = async (req, res) => {
    console.log("In login uth")
    const { email, password } = req.body;
    console.log(email)
    console.log(password)
    try {
        console.log(email)
        console.log(password)
        const user = await User.findOne({ email });
        console.log({user})
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(400).json({ error: 'Error logging in user' });
    }
    console.log(email)
};

// Protect middleware (for protected routes)
exports.protect = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Not authorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};
