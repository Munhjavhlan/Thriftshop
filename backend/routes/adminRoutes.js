const express = require('express');
const router = express.Router();
const db = require('../db'); // Database connection
const { authenticateAdmin } = require('../auth'); // Middleware for admin authentication

// Create Product API
router.post('/add-product', authenticateAdmin, async (req, res) => {
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
      images,
      sub_images,
      baraanii_ungu,
      thumbnail,
    } = req.body;

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
      JSON.stringify(dimensions), // Ensure JSON structure
      images,
      sub_images,
      baraanii_ungu,
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
