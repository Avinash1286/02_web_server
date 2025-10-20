import 'dotenv/config';
import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

let users = [
    { id: 1, name: "the avi" },
    { id: 2, name: "gaurav" },
    { id: 3, name: "akash" },
    { id: 4, name: "anurag" },
    { id: 5, name: "chintu" },
    { id: 6, name: "bikash" },
];

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'User Management API',
        version: '1.0.0',
        endpoints: {
            getUsers: 'GET /users',
            createUser: 'POST /users',
            updateUser: 'PUT /users/:id',
            deleteUser: 'DELETE /users/:id'
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

// Create new user
app.post('/users', (req, res) => {
    const { name } = req.body;

    // Validate input
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Please provide a valid name'
        });
    }

    // Generate new ID (find max ID and add 1)
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    
    const newUser = {
        id: newId,
        name: name.trim()
    };

    users.push(newUser);

    res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: newUser
    });
});

// Update user
app.put('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const { name } = req.body;

    // Validate ID
    if (isNaN(userId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid user ID'
        });
    }

    // Validate name
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Please provide a valid name'
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

    // Validate ID
    if (isNaN(userId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid user ID'
        });
    }

    const initialLength = users.length;
    users = users.filter(u => u.id !== userId);

    if (users.length < initialLength) {
        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } else {
        res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
    console.log(`📍 Access the API at http://localhost:${port}`);
});