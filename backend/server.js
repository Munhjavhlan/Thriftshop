const express = require('express');
const session = require('express-session');
const path = require('path');
const authRoutes = require('./routes/auth');
const pool = require('./db'); 

const app = express();
const PORT = 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use(express.static(path.join(__dirname, '..')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, '../login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, '../register.html')));
app.get('/cart', (req, res) => res.sendFile(path.join(__dirname, '../cart.html')));
app.get('/profile', isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, '../profile.html')));

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out.' });
    }
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});

// Authentication middleware
function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next();
  }
  res.redirect('/login');
}

app.use('/auth', authRoutes);

pool.connect((err) => {
  if (err) {
    console.error('PostgreSQL холбогдож чадсангүй', err);
  } else {
    console.log('PostgreSQL -той холбогдлоо.');
  }
});

app.listen(PORT, () => {
  console.log(`Сервер http://localhost:${PORT} дээр ажиллаж байна.`);
});
