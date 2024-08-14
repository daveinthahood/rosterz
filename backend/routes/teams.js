const express = require('express');
const router = express.Router();
const pool = require('../db');

// Crea una nuova squadra
router.post('/', async (req, res) => {
  const { name, owner_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO public.teams (name, owner_id) VALUES ($1, $2) RETURNING *',
      [name, owner_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ottieni tutte le squadre
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM public.teams');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ottieni una squadra per ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM public.teams WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Aggiorna una squadra per ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, owner_id } = req.body;
  try {
    const result = await pool.query(
      'UPDATE public.teams SET name = $1, owner_id = $2 WHERE id = $3 RETURNING *',
      [name, owner_id, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Elimina una squadra per ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM public.teams WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;