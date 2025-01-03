const express = require('express'); 
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { registerUser, loginUser, getUserById } = require('../models/User');

const router = express.Router();

// Swagger тохиргоо
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Хэрэглэгчийн Удирдлагын API',
      version: '1.0.0',
      description: 'Хэрэглэгч бүртгэх, нэвтрэх болон админ эрхийн шалгалтын API баримтжуулалт',
    },
    servers: [
      {
        url: 'http://localhost:3000/auth',
      },
    ],
  },
  apis: [__filename], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
router.use('/auth/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * components:
 *   schemas:
 *     Хэрэглэгч:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Хэрэглэгчийн автоматаар үүсгэгдсэн ID
 *         username:
 *           type: string
 *           description: Хэрэглэгчийн нэр
 *         email:
 *           type: string
 *           description: Хэрэглэгчийн и-мэйл
 *         role:
 *           type: string
 *           description: >
 *             Хэрэглэгчийн үүрэг. Жишээ нь: админ.
 *       required:
 *         - username
 *         - email
 *         - password
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Шинэ хэрэглэгч бүртгэх
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lastname:
 *                 type: string
 *               firstname:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       302:
 *         description: Хэрэглэгч амжилттай бүртгэгдэж, нэвтрэх хуудас руу чиглүүлэгдлээ.
 *       400:
 *         description: Бүртгэл амжилтгүй боллоо.
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Хэрэглэгч нэвтрэх
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Хэрэглэгч амжилттай нэвтэрлээ.
 *       401:
 *         description: Буруу и-мэйл эсвэл нууц үг.
 */

/**
 * @swagger
 * /admin:
 *   get:
 *     summary: Админы хуудас руу нэвтрэх
 *     responses:
 *       200:
 *         description: Админы хуудас руу нэвтрэж чадлаа.
 *       401:
 *         description: Хэрэглэгч нэвтрээгүй байна.
 *       403:
 *         description: Админ эрх шаардлагатай.
 */

// Админ эрх шалгах middleware
const isAdmin = async (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Та нэвтэрч орох шаардлагатай' });
  }

  try {
    const user = await getUserById(req.session.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Админ эрх шаардлагатай' });
    }

    next(); // Админ бол үргэлжлүүлэх
  } catch (err) {
    res.status(500).json({ message: 'Серверийн алдаа', error: err.message });
  }
};

// Бүртгэл API
router.post('/register', async (req, res) => {
  const { lastname, firstname, username, email, phone, password } = req.body;
  try {
    const user = await registerUser(lastname, firstname, username, email, phone, password);
    res.status(302).redirect('/login');
  } catch (err) {
    res.status(400).json({ message: 'Бүртгэл амжилтгүй', error: err.message });
  }
});

// Нэвтрэх API
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await loginUser(email, password);
    if (!user) {
      return res.status(401).json({ message: 'Буруу и-мэйл эсвэл нууц үг' });
    }

    req.session.userId = user.id;
    res.status(200).json({ message: 'Амжилттай нэвтэрлээ.', user });
  } catch (err) {
    res.status(500).json({ message: 'Нэвтрэлт амжилтгүй', error: err.message });
  }
});

// Админы хуудасны API
router.get('/admin', isAdmin, (req, res) => {
  res.status(200).json({ message: 'Админы хуудас руу амжилттай нэвтэрлээ' });
});

module.exports = router;
