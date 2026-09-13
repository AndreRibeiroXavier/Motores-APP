const express = require('express');
const { pool } = require('../db');
const router = express.Router();

function validarMotor(body) {
  const details = [];
  if (!body.codigo || !String(body.codigo).trim()) details.push('codigo é obrigatório');
  if (!body.modelo || !String(body.modelo).trim()) details.push('modelo é obrigatório');
  if (!body.fabricante_id) details.push('fabricante_id é obrigatório');
  if (body.potencia_cv === undefined || Number(body.potencia_cv) <= 0)
    details.push('potencia_cv deve ser maior que zero');
  if (![50, 60].includes(Number(body.frequencia_hz)))
    details.push('frequencia_hz deve ser 50 ou 60');
  if (![2, 4, 6, 8].includes(Number(body.polos)))
    details.push('polos deve ser 2, 4, 6 ou 8');
  if (body.rotacao_rpm === undefined || Number(body.rotacao_rpm) <= 0)
    details.push('rotacao_rpm deve ser maior que zero');
  return details;
}

// GET /api/motores  e  GET /api/motores?search=texto
router.get('/', async (req, res, next) => {
  try {
    const { search } = req.query;
    let sql = 'SELECT * FROM motores';
    const params = [];
    if (search) {
      sql += ' WHERE codigo LIKE ? OR modelo LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }
    sql += ' ORDER BY id DESC';
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) { next(err); }
});

// GET /api/motores/:id
router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM motores WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Motor não encontrado' });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

// POST /api/motores
router.post('/', async (req, res, next) => {
  try {
    const details = validarMotor(req.body);
    if (details.length) return res.status(400).json({ error: 'Dados inválidos', details });

    const { codigo, modelo, fabricante_id, potencia_cv, tensao, frequencia_hz,
            polos, rotacao_rpm, carcaca, grau_protecao, preco } = req.body;

    const [fab] = await pool.query('SELECT id FROM fabricantes WHERE id = ?', [fabricante_id]);
    if (fab.length === 0)
      return res.status(400).json({ error: 'Dados inválidos', details: ['fabricante_id não existe'] });

    const [result] = await pool.query(
      `INSERT INTO motores
        (codigo, modelo, fabricante_id, potencia_cv, tensao, frequencia_hz, polos, rotacao_rpm, carcaca, grau_protecao, preco)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [codigo, modelo, fabricante_id, potencia_cv, tensao, frequencia_hz, polos, rotacao_rpm,
       carcaca || null, grau_protecao || null, preco || null]
    );
    const [novo] = await pool.query('SELECT * FROM motores WHERE id = ?', [result.insertId]);
    res.status(201).json(novo[0]);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Código já cadastrado' });
    next(err);
  }
});

// PUT /api/motores/:id
router.put('/:id', async (req, res, next) => {
  try {
    const details = validarMotor(req.body);
    if (details.length) return res.status(400).json({ error: 'Dados inválidos', details });

    const [existing] = await pool.query('SELECT id FROM motores WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ error: 'Motor não encontrado' });

    const { codigo, modelo, fabricante_id, potencia_cv, tensao, frequencia_hz,
            polos, rotacao_rpm, carcaca, grau_protecao, preco } = req.body;

    await pool.query(
      `UPDATE motores SET codigo=?, modelo=?, fabricante_id=?, potencia_cv=?, tensao=?,
        frequencia_hz=?, polos=?, rotacao_rpm=?, carcaca=?, grau_protecao=?, preco=? WHERE id=?`,
      [codigo, modelo, fabricante_id, potencia_cv, tensao, frequencia_hz, polos, rotacao_rpm,
       carcaca || null, grau_protecao || null, preco || null, req.params.id]
    );
    const [rows] = await pool.query('SELECT * FROM motores WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Código já cadastrado' });
    next(err);
  }
});

// DELETE /api/motores/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM motores WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Motor não encontrado' });
    res.status(204).send();
  } catch (err) { next(err); }
});

module.exports = router;