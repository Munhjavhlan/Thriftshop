const express = require('express');
const session = require('express-session');
const path = require('path');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const pool = require('./db'); // PostgreSQL холболт
const { getUserById } = require('./models/User');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');

// Middleware
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

// Swagger тохиргоо
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Цахим худалдааны API',
      version: '1.0.0',
      description: 'Цахим худалдааны платформын API баримт бичиг',
      contact: {
        name: 'Хөгжүүлэгч',
        email: 'Batkabata42@gmail.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ['./routes/*.js'], 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/server/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Нүүр хуудсыг үзүүлэх.
 *     tags:
 *       - Хуудаснууд
 *     responses:
 *       200:
 *         description: Нүүр хуудсыг амжилттай үзүүлсэн.
 */
app.get('/', (req, res) => res.render('index'));

/**
 * @swagger
 * /login:
 *   get:
 *     summary: Нэвтрэх хуудсыг үзүүлэх.
 *     tags:
 *       - Хуудаснууд
 *     responses:
 *       200:
 *         description: Нэвтрэх хуудсыг амжилттай үзүүлсэн.
 */
app.get('/login', (req, res) => {
  if (req.session.userId) {
    return res.redirect('/profile'); // Redirect to profile if already authenticated
  }
  res.sendFile(path.join(__dirname, '../login.html'));
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Хэрэглэгчийг нэвтрүүлэх.
 *     tags:
 *       - Нэвтрэлт
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Амжилттай нэвтэрсэн.
 *       401:
 *         description: Нэвтрэх нэр эсвэл нууц үг буруу байна.
 */
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'user' && password === 'password') {
    req.session.userId = username; 
    res.status(200).json({ message: 'Амжилттай нэвтэрсэн.' });
  } else {
    res.status(401).json({ message: 'Нэвтрэх нэр эсвэл нууц үг буруу байна.' });
  }
});

/**
 * @swagger
 * /register:
 *   get:
 *     summary: Бүртгэлийн хуудсыг үзүүлэх.
 *     tags:
 *       - Хуудаснууд
 *     responses:
 *       200:
 *         description: Бүртгэлийн хуудсыг амжилттай үзүүлсэн.
 */
app.get('/register', async (req, res) => {
  let user = null;
  if (req.session.userId) {
    user = await getUserById(req.session.userId);
    console.log('Fetched user data:', user); // Log user data
  }
  res.render('register', { user });
});

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Сагсны хуудсыг үзүүлэх.
 *     tags:
 *       - Хуудаснууд
 *     responses:
 *       200:
 *         description: Сагсны хуудсыг амжилттай үзүүлсэн.
 */
app.get('/cart', (req, res) => res.sendFile(path.join(__dirname, '../cart.html')));

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Хувийн мэдээллийн хуудсыг үзүүлэх. Нэвтрэлт шаардлагатай.
 *     tags:
 *       - Хуудаснууд
 *     responses:
 *       200:
 *         description: Хувийн мэдээллийн хуудсыг амжилттай үзүүлсэн.
 *       401:
 *         description: Зөвшөөрөлгүй. Хэрэглэгч нэвтрээгүй байна.
 */
app.get('/profile', async (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login'); 
  }
  const user = await getUserById(req.session.userId);
  console.log('Fetched user data for profile:', user); // Log user data
  res.render('profile', { user });
});

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Хэрэглэгчийг гаргаж, сессийг устгах.
 *     tags:
 *       - Нэвтрэлт
 *     responses:
 *       200:
 *         description: Амжилттай гарсан ба нэвтрэх хуудас руу шилжүүлсэн.
 *       500:
 *         description: Гарах үед серверийн алдаа гарсан.
 */
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Гарах үед алдаа гарлаа.' });
    }
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});

// Routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);

// PostgreSQL холболт
pool.connect((err) => {
  if (err) {
    console.error('PostgreSQL холбогдож чадсангүй', err);
  } else {
    console.log('PostgreSQL -той холбогдлоо.');
  }
});

// Сервер эхлүүлэх
app.listen(PORT, () => {
  console.log(`Сервер http://localhost:${PORT} дээр ажиллаж байна.`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Порт ${PORT} аль хэдийн ашиглагдаж байна.`);
  } else {
    console.error('Серверийн алдаа:', err.message);
  }
});
