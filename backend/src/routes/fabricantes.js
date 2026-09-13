const express = require('express');
const { pool } = require('../db');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT id, nome FROM fabricantes ORDER BY nome');
    res.json(rows);
  } catch (err) { next(err); }
});

module.exports = router;