const express = require('express');
const router = express.Router();
const pool = require('../db');

// Crea un nuovo artista
router.post('/', async (req, res) => {
  const { name, genre } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO public.artists (name, genre) VALUES ($1, $2) RETURNING *',
      [name, genre]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ottieni tutti gli artisti
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM public.artists');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ottieni un artista per ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM public.artists WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Artist not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Aggiorna un artista per ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, genre } = req.body;
  try {
    const result = await pool.query(
      'UPDATE public.artists SET name = $1, genre = $2 WHERE id = $3 RETURNING *',
      [name, genre, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Artist not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Elimina un artista per ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM public.artists WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Artist not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;