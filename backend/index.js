const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: 'yourSecretKey', // Нууц түлхүүр
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // HTTPS хэрэглэж байгаа бол secure: true
  })
);

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
app.get('/profile', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../profile.html'));
  });
  


// Routes
app.use('/auth', authRoutes);
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
      return next();
    }
    res.redirect('/login.html');
  }
  app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Гарах үед алдаа гарлаа.' });
      }
  
      // Clear the session cookie
      res.clearCookie('connect.sid');
      res.redirect('../login.html'); // Redirect to login page
    });
  });

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/ThriftshopDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB холбогдлоо. '))
    .catch(err => console.error('MongoDB холбогдсонгүй:', err));

// Start server
app.listen(PORT, () => {
    console.log(`Сервер http://localhost:${PORT} дээр ажиллаж байна`);
    console.log(`Эхлэл хуудас: http://localhost:${PORT}/`);
  });