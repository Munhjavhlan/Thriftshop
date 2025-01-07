const express = require('express');
const multer = require('multer');
const path = require('path');
const pool = require('../db');
const router = express.Router();
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Бүтээгдэхүүний Удирдлагын API',
      version: '1.0.0',
      description: 'Бараа нэмэх, нэмсэн бараа харах хэсэг.',
    },
    servers: [
      {
        url: 'http://localhost:3000/products',
      },
    ],
  },
  apis: [__filename], 
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Бүтээгдэхүүний нэр
 *         description:
 *           type: string
 *           description: Бүтээгдэхүүний тайлбар
 *         price:
 *           type: number
 *           description: Бүтээгдэхүүний үнэ (₮)
 *         category:
 *           type: string
 *           description: Бүтээгдэхүүний ангилал
 *         rating:
 *           type: number
 *           format: float
 *           description: Бүтээгдэхүүний үнэлгээ (1-5)
 *         tag:
 *           type: array
 *           items:
 *             type: string
 *           description: Шошго буюу тагууд
 *         brand:
 *           type: string
 *           description: Брэндийн нэр
 *         weight:
 *           type: number
 *           format: float
 *           description: Бүтээгдэхүүний жин (кг)
 *         dimensions:
 *           type: object
 *           properties:
 *             width:
 *               type: number
 *               description: Өргөн
 *             height:
 *               type: number
 *               description: Өндөр
 *             depth:
 *               type: number
 *               description: Гүн
 *           description: Бүтээгдэхүүний хэмжээс
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: Үндсэн зургийн зам
 *         subImages:
 *           type: array
 *           items:
 *             type: string
 *           description: Дэд зургийн замууд
 *         baraaniiUngu:
 *           type: array
 *           items:
 *             type: string
 *           description: Барааны өнгөний зураг
 *         thumbnail:
 *           type: string
 *           description: Thumbnail зураг
 *       required:
 *         - name
 *         - description
 *         - price
 *         - category
 *         - brand
 *         - weight
 *         - dimensions
 *       example:
 *         name: Барааны нэр
 *         description: Энгийн бүтээгдэхүүн
 *         price: 15000
 *         category: Гэр ахуй
 *         rating: 4.5
 *         tag: [хямдралтай, шинэ]
 *         brand: ABC брэнд
 *         weight: 1.2
 *         dimensions: {"width": 10, "height": 20, "depth": 5}
 *         images: ["/images/image1.jpg"]
 *         subImages: ["/images/subImage1.jpg", "/images/subImage2.jpg"]
 *         baraaniiUngu: ["/images/color1.jpg"]
 *         thumbnail: "/images/thumbnail.jpg"
 */

/**
 * @swagger
 * /add:
 *   post:
 *     summary: Бүтээгдэхүүн нэмэх
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               rating:
 *                 type: number
 *               tag:
 *                 type: string
 *               brand:
 *                 type: string
 *               weight:
 *                 type: number
 *               dimensions:
 *                 type: string
 *                 example: '{"width":10,"height":20,"depth":5}'
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               subImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               baraaniiUngu:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Бүтээгдэхүүн амжилттай нэмэгдсэн
 *       500:
 *         description: Серверт алдаа гарлаа
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Бүх бүтээгдэхүүний жагсаалтыг авах
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Бүх бүтээгдэхүүн амжилттай татагдсан
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Серверт алдаа гарлаа
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Бүх бүтээгдэхүүнийг авах.
 *     tags:
 *       - Бүтээгдэхүүн
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Бүтээгдэхүүний ангилал
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Хамгийн бага үнэ
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Хамгийн их үнэ
 *       - in: query
 *         name: rating
 *         schema:
 *           type: number
 *         description: Үнэлгээ
 *     responses:
 *       200:
 *         description: Бүх бүтээгдэхүүнийг амжилттай авсан.
 *       500:
 *         description: Серверийн алдаа.
 */
router.get('/', async (req, res) => {
  const { category, minPrice, maxPrice, rating } = req.query;
  let query = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (category) {
    query += ' AND category = $1';
    params.push(category);
  }
  if (minPrice) {
    query += ' AND price >= $2';
    params.push(minPrice);
  }
  if (maxPrice) {
    query += ' AND price <= $3';
    params.push(maxPrice);
  }
  if (rating) {
    query += ' AND rating >= $4';
    params.push(rating);
  }

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Серверийн алдаа' });
  }
});

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.resolve(__dirname, '../../images');
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.post('/add', upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'subImages', maxCount: 10 },
    { name: 'baraaniiUngu', maxCount: 5 },
    { name: 'thumbnail', maxCount: 1 }
]), async (req, res) => {
    try {
        const { name, description, price, category, rating, tag = '', brand, weight, dimensions } = req.body;

        // Parse tags
        const tags = typeof tag === 'string' ? tag.split(',') : [];

        // Handle uploaded files
        const images = req.files?.images?.map(file => `/images/${file.filename}`) || [];
        const subImages = req.files?.subImages?.map(file => `/images/${file.filename}`) || [];
        const baraaniiUngu = req.files?.baraaniiUngu?.map(file => `/images/${file.filename}`) || [];
        const thumbnail = req.files?.thumbnail?.[0]?.filename ? `/images/${req.files.thumbnail[0].filename}` : '';

        // Validate and serialize dimensions
        const pgDimensions = typeof dimensions === 'string' 
            ? JSON.stringify(JSON.parse(dimensions)) 
            : JSON.stringify(dimensions);

        // Insert product into the database
        const result = await pool.query(
            `INSERT INTO products (name, description, price, category, rating, tag, brand, weight, dimensions, images, subImages, baraaniiUngu, thumbnail) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id`,
            [name, description, price, category, rating, tags, brand, weight, pgDimensions, images, subImages, baraaniiUngu, thumbnail]
        );

        res.status(200).json({ message: 'Бүтээгдэхүүн амжилттай нэмэгдлээ', productId: result.rows[0].id });
    } catch (error) {
        console.error('Error inserting product:', error);
        res.status(500).json({ message: 'Бүтээгдэхүүн нэмэхэд алдаа гарлаа', error: error.message });
    }
});

// GET route to fetch all products
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Алдаа:', err.message);
        res.status(500).json({ message: 'Бүтээгдэхүүн татаж чадсангүй', error: err.message });
    }
});

module.exports = router;
