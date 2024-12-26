const express = require('express');
const router = express.Router();
const db = require('../db'); 
const { authenticateAdmin } = require('../auth'); 
const multer = require('multer'); 
const path = require('path');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Create Product API
router.post('/add-product', authenticateAdmin, upload.fields([
  { name: 'images', maxCount: 1 },
  { name: 'subImages', maxCount: 10 },
  { name: 'baraaniiUngu', maxCount: 10 },
  { name: 'thumbnail', maxCount: 1 },
]), async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      rating,
      tag,
      brand,
      weight,
      dimensions,
    } = req.body;

    const images = req.files['images'] ? req.files['images'][0].path : null;
    const subImages = req.files['subImages'] ? req.files['subImages'].map(file => file.path) : [];
    const baraaniiUngu = req.files['baraaniiUngu'] ? req.files['baraaniiUngu'].map(file => file.path) : [];
    const thumbnail = req.files['thumbnail'] ? req.files['thumbnail'][0].path : null;

    const query = `
      INSERT INTO products 
      (name, description, price, category, rating, tag, brand, weight, dimensions, images, sub_images, baraanii_ungu, thumbnail) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
      RETURNING *;
    `;

    const values = [
      name,
      description,
      price,
      category,
      rating,
      tag,
      brand,
      weight,
      JSON.stringify(dimensions), 
      images,
      JSON.stringify(subImages),
      JSON.stringify(baraaniiUngu),
      thumbnail,
    ];

    const result = await db.query(query, values);
    res.status(201).json({ message: 'Product created successfully', product: result.rows[0] });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
