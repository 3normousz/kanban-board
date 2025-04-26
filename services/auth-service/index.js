const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const cors = require('cors');
require('dotenv').config({ path : '../../.env' });

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


const PORT = process.env.PORT || 3000;

// signup
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );
    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      console.error('Error during signup:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

// login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', { email, password });
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    console.log('Database query result:', result.rows.length ? 'User found' : 'User not found');
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email 
      }, 
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('User logged in:', user.email);
    return res.json({ token });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Auth service running on http://localhost:${PORT}`);
});
