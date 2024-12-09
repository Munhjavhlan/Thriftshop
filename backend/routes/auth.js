const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Хэрэглэгчийн загвар
const router = express.Router();

// Бүртгэл (Register)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Хоосон талбар шалгах
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Бүх талбарыг бөглөнө үү.' });
    }

    // Хэрэглэгч аль хэдийн бүртгэлтэй эсэхийг шалгах
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Имэйл аль хэдийн бүртгэгдсэн байна.' });
    }

    // Нууц үг шифрлэх
    const hashedPassword = await bcrypt.hash(password, 10);

    // Хэрэглэгч үүсгэх
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Бүртгэл амжилттай боллоо.' });
  } catch (error) {
    res.status(500).json({ message: 'Серверийн алдаа.', error });
  }
});

// Нэвтрэх (Login)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Хоосон талбар шалгах
    if (!email || !password) {
      return res.status(400).json({ message: 'Имэйл болон нууц үг шаардлагатай.' });
    }

    // Хэрэглэгч шалгах
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Имэйл буруу байна.' });
    }

    // Нууц үг таарч байгаа эсэхийг шалгах
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Нууц үг буруу байна.' });
    }

    // Session-д хэрэглэгчийн ID хадгалах
    req.session.userId = user._id;

    res.json({ message: 'Нэвтрэх амжилттай.', userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Серверийн алдаа.', error });
  }
});

// Гарах (Logout)
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Гарах үед алдаа гарлаа.' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Амжилттай гарлаа.' });
  });
});

module.exports = router;
