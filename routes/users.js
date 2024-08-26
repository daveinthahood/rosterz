const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require("bcrypt");
const multer = require("multer")
const fs = require("fs")
const path = require("path")
const jwt = require("jsonwebtoken")


const JWT_SECRET = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' //spostarla nell'env

//storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage })






// Crea un nuovo utente
// backend/routes/users.js
router.post('/register', upload.single('profileImage'), async (req, res) => {
    const { username, email, password } = req.body;
    const file = req.file

    try {
        // Verifica se l'username o l'email esistono già
        const userCheck = await pool.query('SELECT * FROM public.users WHERE username = $1 OR email = $2', [username, email]);

        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: 'Username o email già esistenti' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const filename = file.filename
        const result = await pool.query(
            'INSERT INTO public.users (username, email, password, profile_img) VALUES ($1, $2, $3, $4) RETURNING *',
            [username, email, hashedPassword, filename]
        );

        const user = result.rows[0];
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

        res.status(200).json({ user: { id: user.id, email: user.email, username: user.username }, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Errore nella registrazione dell\'utente' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM public.users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ error: 'Email o password errati' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Email o password errati' });
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

        res.status(200).json({ user: { id: user.id, email: user.email, username: user.username }, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Errore nel login dell\'utente' });
    }
});

// Ottieni un utente per ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM public.users WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Aggiorna un utente per ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;
  try {
    const result = await pool.query(
      'UPDATE public.users SET username = $1, email = $2, password = $3 WHERE id = $4 RETURNING *',
      [username, email, password, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Elimina un utente per ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM public.users WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.get('/profile', async (req, res) => {
    const { userId } = req.query;

    try {
        const result = await db.query('SELECT username, email, profile_img FROM public.users WHERE id = $1', [userId]);
        const user = result.rows[0];

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'Utente non trovato' });
        }
    } catch (error) {
        console.error('Errore durante il recupero del profilo:', error);
        res.status(500).json({ error: 'Errore durante il recupero del profilo' });
    }
});

module.exports = router;
