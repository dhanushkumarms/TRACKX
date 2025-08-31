const express = require('express');
const cors = require('cors');
const { db } = require('./db/db');
const { readdirSync } = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
const corsOptions = {
    origin: 'https://expense-tracker-fzdr.vercel.app', // Your Vercel frontend URL
    optionsSuccessStatus: 200,
  };
  
  app.use(cors(corsOptions));

// Dynamically load all routes
readdirSync('./routes').map((routeFile) => {
    const route = require('./routes/' + routeFile);
    app.use('/api/v1', route); // This is where the route is being used
});


const authRoutes = require('./routes/auth');
app.use('/api/v1/auth', authRoutes);  // Separate route for auth

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server only if this module is not being imported
if (require.main === module) {
    db(); // Connect to the database
    app.listen(PORT, () => {
        console.log('Listening on port:', PORT);
    });
}

// Export app for testing
module.exports = app;
