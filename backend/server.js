const express = require('express');
const session = require('express-session');
const path = require('path');
const authRoutes = require('./routes/auth');
const pool = require('./db'); 
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

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

// Swagger Configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce API',
      version: '1.0.0',
      description: 'API documentation for the E-Commerce platform',
      contact: {
        name: 'Developer',
        email: 'developer@example.com',
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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Render the homepage.
 *     tags:
 *       - Pages
 *     responses:
 *       200:
 *         description: Successfully rendered homepage.
 */

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

/**
 * @swagger
 * /login:
 *   get:
 *     summary: Render the login page.
 *     tags:
 *       - Pages
 *     responses:
 *       200:
 *         description: Successfully rendered login page.
 */

app.get('/login', (req, res) => res.sendFile(path.join(__dirname, '../login.html')));

/**
 * @swagger
 * /register:
 *   get:
 *     summary: Render the registration page.
 *     tags:
 *       - Pages
 *     responses:
 *       200:
 *         description: Successfully rendered registration page.
 */

app.get('/register', (req, res) => res.sendFile(path.join(__dirname, '../register.html')));
/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Render the cart page.
 *     tags:
 *       - Pages
 *     responses:
 *       200:
 *         description: Successfully rendered cart page.
 */


app.get('/cart', (req, res) => res.sendFile(path.join(__dirname, '../cart.html')));

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Render the profile page. Requires authentication.
 *     tags:
 *       - Pages
 *     responses:
 *       200:
 *         description: Successfully rendered profile page.
 *       401:
 *         description: Unauthorized. User not logged in.
 */

app.get('/profile', isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, '../profile.html')));


/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Log out the user and destroy the session.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Successfully logged out and redirected to login.
 *       500:
 *         description: Server error during logout.
 */

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Гарах үед алдаа гарлаа..' });
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
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Порт ${PORT} аль хэдийн ашиглагдаж байна.`);
  } else {
    console.error('Серверийн алдаа:', err.message);
  }
});
const productRoutes = require('./routes/products');

app.use('/products', productRoutes);