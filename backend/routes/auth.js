const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// Бүртгэл (Register)

router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

  // Хэрэглэгч аль хэдийн бүртгэлтэй байгаа эсэхийг шалгах
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).send(`
        <script>
          alert('Хэрэглэгчийн имэйл бүртгэгдсэн байна');
          window.location.href = '/register.html';
        </script>
      `);
    }

    try {
      const user = new User({ username, email, password });
      await user.save();

      // Амжилттай бүртгүүлсэн тохиолдолд alert харуулах
      res.status(201).send(`
        <script>
          alert('Хэрэглэгч амжилттай бүртгэгдлээ');
          window.location.href = '/login.html';
        </script>
      `);
    } catch (error) {
      res.status(500).send(`
        <script>
          alert('Алдаа гарлаа: ${error.message}');
          window.location.href = '/register.html';
        </script>
      `);
    }
  });

  // Нэвтрэх (Login)
  router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Check if the email is provided
    if (!email || !password) {
      return res.status(400).json({ message: 'Имэйл болон нууц үг заавал шаардлагатай' });
    }

    try {
      const user = await User.findOne({ email: email.toLowerCase() });

      if (!user) {
        return res.status(400).json({ message: 'Имэйл буруу байна' });
      }

      // Check the password
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'нууц үг буруу байна' });
      }

      // Generate JWT
      const token = jwt.sign({ id: user._id }, 'yourSecretKey', { expiresIn: '1h' });

      res.json({ message: 'Нэвтрэх амжилттай', token });
    } catch (error) {
      res.status(500).json({ message: 'Алдаа гарлаа', error });
    }
});


module.exports = router;
