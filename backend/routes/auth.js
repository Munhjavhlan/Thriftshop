const express = require('express');
const { registerUser, loginUser } = require('../models/User');

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await registerUser(username, email, password);
    res.redirect('/login');
  } catch (err) {
    res.status(400).json({ message: 'Бүртгэл амжилтгүй', error: err.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await loginUser(email, password);
    if (!user) {
      return res.status(401).json({ message: 'Буруу email or password' });
    }

    req.session.userId = user.id;
    res.status(200).json({ message: 'Амжилттай нэвтэрлээ.', user });
  } catch (err) {
    res.status(500).json({ message: 'Нэвтрэлт амжилтгүй', error: err.message });
  }
});

module.exports = router;
