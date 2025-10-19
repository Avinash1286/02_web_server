import 'dotenv/config';
import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// In-memory data store
let users = [
    { id: 1, name: "the avi" },
    { id: 2, name: "gaurav" },
    { id: 3, name: "akash" },
    { id: 4, name: "anurag" },
    { id: 5, name: "chintu" },
    { id: 6, name: "bikash" }
];

// Helper function to get next user ID
const getNextUserId = () => {
    return users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
};

// Root endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: 'Welcome to the User API',
        endpoints: {
            'GET /users': 'Get all users',
            'POST /users': 'Create a new user',
            'PUT /users/:id': 'Update a user',
            'DELETE /users/:id': 'Delete a user'
        }
    });
});

// Get all users
app.get('/users', (req, res) => {
    res.json({
        success: true,
        count: users.length,
        data: users
    });
});

// Create a new user
app.post('/users', (req, res) => {
    const { name } = req.body;
    
    // Validation
    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({
            success: false,
            message: 'Name is required and must be a non-empty string'
        });
    }
    
    const newUser = {
        id: getNextUserId(),
        name: name.trim()
    };
    
    users.push(newUser);
    
    res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: newUser
    });
});

// Update user info
app.put('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const { name } = req.body;
    
    // Validation
    if (isNaN(userId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid user ID'
        });
    }
    
    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({
            success: false,
            message: 'Name is required and must be a non-empty string'
        });
    }
    
    const user = users.find(u => u.id === userId);
    
    if (user) {
        user.name = name.trim();
        res.json({
            success: true,
            message: 'User updated successfully',
            data: user
        });
    } else {
        res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }
});

// Delete user
app.delete('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    
    // Validation
    if (isNaN(userId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid user ID'
        });
    }
    
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }
    
    users = users.filter(u => u.id !== userId);
    
    res.status(200).json({
        success: true,
        message: 'User deleted successfully'
    });
});

// 404 handler for undefined routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
    console.log(`Visit http://localhost:${port} to get started`);
});