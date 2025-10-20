const express = require('express');
const contactRoutes = require('./routes/contact');
const aboutRoutes = require('./routes/about');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.use('/contact', contactRoutes);
app.use('/about', aboutRoutes);

// Home route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ 
        error: err.message || 'Internal Server Error' 
    });
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, closing server...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

module.exports = app; // Export for testing