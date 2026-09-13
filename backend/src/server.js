require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { pool, waitForDatabase } = require('./db');
const fabricantesRouter = require('./routes/fabricantes');
const motoresRouter = require('./routes/motores');

const app = express();
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'ok' });
  } catch {
    res.status(500).json({ status: 'ok', database: 'error' });
  }
});

app.use('/api/fabricantes', fabricantesRouter);
app.use('/api/motores', motoresRouter);

app.use((req, res) => res.status(404).json({ error: 'Rota não encontrada' }));

// middleware de erro — precisa ser o último app.use, com 4 parâmetros
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno' });
});

const PORT = process.env.PORT || 3000;
waitForDatabase()
  .then(() => app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`)))
  .catch((err) => { console.error(err); process.exit(1); });