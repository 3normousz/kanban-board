const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const authenticateToken = require('../auth-service/middleware/auth');
app.use(authenticateToken);

// get all boards for a user
app.get('/boards', async (req, res) => {
  try {
    const userId = req.user.id;
    const boards = await pool.query(
      'SELECT * FROM boards WHERE owner_id = $1',
      [userId]
    );
    res.json(boards.rows);
  } catch (error) {
    console.error('Error fetching boards:', error.message);
    res.status(500).json({ error: 'Failed to fetch boards' });
  }
});

// create board
app.post('/boards', async (req, res) => {
    try {
        const { name, description } = req.body;
        const userId = req.user.id;

        if (!name) {
            return res.status(400).json({ error: 'Board name is required' });
        }

        const result = await pool.query(
            'INSERT INTO boards (name, description, owner_id) VALUES ($1, $2, $3) RETURNING *',
            [name, description, userId]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
    console.error('Error creating board:', error.message);
    res.status(500).json({ error: 'Failed to create board' });
    }
});

// delete board
app.delete('/boards/:id', async (req, res) => {
  try {
    const boardId = req.params.id;
    const userId = req.user.id;

    const result = await pool.query(
      'DELETE FROM boards WHERE id = $1 AND owner_id = $2 RETURNING *',
      [boardId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Board not found or not owned by user' });
    }

    res.json({ message: 'Board deleted successfully' });
  } catch (error) {
    console.error('Error deleting board:', error.message);
    res.status(500).json({ error: 'Failed to delete board' });
  }
});

// update board
app.put('/boards/:id', async (req, res) => {
  try {
    const boardId = req.params.id;
    const { name, description } = req.body;
    const userId = req.user.id;

    const result = await pool.query(
      'UPDATE boards SET name = $1, description = $2 WHERE id = $3 AND owner_id = $4 RETURNING *',
      [name, description, boardId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Board not found or not owned by user' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating board:', error.message);
    res.status(500).json({ error: 'Failed to update board' });
  }
});

app.listen(PORT, () => {
  console.log(`Board service running on http://localhost:${PORT}`);
});