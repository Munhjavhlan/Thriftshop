const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Статик файлуудыг чиглүүлэх
app.use(express.static(path.join(__dirname, '..')));

// Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../login.html'));
});
app.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, '../cart.html'));
});
app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, '../profile.html'));
});

// Routes
app.use('/auth', authRoutes);

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/ThriftshopDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
