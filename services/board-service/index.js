const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const pool = require('./db');
require('dotenv').config({ path : '../../.env' });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const authenticateToken = require('./middleware/auth');
app.use(authenticateToken);

// get all boards for a user
app.get('/boards', async (req, res) => {
  try {
    const userId = req.user.id;
    const boards = await pool.query(
      'SELECT DISTINCT b.* FROM boards b ' +
      'LEFT JOIN board_members bm ON b.id = bm.board_id ' +
      'WHERE b.owner_id = $1 OR bm.user_id = $1',
      [userId]
    );
    res.json(boards.rows);
  } catch (error) {
    console.error('Error fetching boards:', error.message);
    res.status(500).json({ error: 'Failed to fetch boards' });
  }
});

// get a board by id
app.get('/boards/:id', async (req, res) => {
  try {
    const boardId = req.params.id;
    const userId = req.user.id;

    const result = await pool.query(
      'SELECT * FROM boards WHERE id = $1 AND owner_id = $2',
      [boardId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Board not found or not owned by user' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching board:', error.message);
    res.status(500).json({ error: 'Failed to fetch board' });
  }
});

// get board owner
app.get('/boards/:id/owner', async (req, res) => {
  try {
    const boardId = req.params.id;
    const userId = req.user.id;
    
    const result = await pool.query(
      'SELECT u.id, u.email FROM users u ' +
      'JOIN boards b ON u.id = b.owner_id ' +
      'WHERE b.id = $1 AND b.owner_id = $2',
      [boardId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Board owner not found or not owned by user' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching board owner:', error.message);
    res.status(500).json({ error: 'Failed to fetch board owner' });
  }
});

// get all members of a board
app.get('/boards/:id/members', async (req, res) => {
  try {
    const boardId = req.params.id;
    const userId = req.user.id;

    const result = await pool.query(
      'SELECT u.id, u.email FROM users u ' +
      'JOIN board_members bm ON u.id = bm.user_id ' +
      'WHERE bm.board_id = $1 AND (bm.role = $2 OR bm.user_id = $3)',
      [boardId, 'owner', userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No members found for this board' });
    }

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching board members:', error.message);
    res.status(500).json({ error: 'Failed to fetch board members' });
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

        await pool.query(
          'INSERT INTO board_members (board_id, user_id, role) VALUES ($1, $2, $3)',
          [result.rows[0].id, userId, 'owner']
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

// get columns for a board_id
app.get('/boards/:boardId/columns', authenticateToken, async (req, res) => {
  try {
    const boardId = req.params.boardId;
    const columns = await pool.query(
      'SELECT * FROM columns WHERE board_id = $1 ORDER BY position',
      [boardId]
    );
    res.json(columns.rows);
  } catch (error) {
    console.error('Error fetching columns:', error);
    res.status(500).json({ error: 'Failed to fetch columns' });
  }
});

// create column @ board_id
app.post('/boards/:boardId/columns', authenticateToken, async (req, res) => {
  try {
    const boardId = req.params.boardId;
    const { name, position } = req.body;
    
    const result = await pool.query(
      'INSERT INTO columns (name, position, board_id) VALUES ($1, $2, $3) RETURNING *',
      [name, position, boardId]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating column:', error);
    res.status(500).json({ error: 'Failed to create column' });
  }
});

// update column @ board_id
app.put('/boards/:boardId/columns/:columnId', authenticateToken, async (req, res) => {
  try {
    const { boardId, columnId } = req.params;
    const { name, position } = req.body;

    const result = await pool.query(
      'UPDATE columns SET name = $1, position = $2 WHERE id = $3 AND board_id = $4 RETURNING *',
      [name, position, columnId, boardId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Column not found or does not belong to this board' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating column:', error);
    res.status(500).json({ error: 'Failed to update column' });
  }
});

// delete column @ board_id
app.delete('/boards/:boardId/columns/:columnId', authenticateToken, async (req, res) => {
  try {
    const { boardId, columnId } = req.params;

    const result = await pool.query(
      'DELETE FROM columns WHERE id = $1 AND board_id = $2 RETURNING *',
      [columnId, boardId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Column not found or does not belong to this board' });
    }

    res.json({ message: 'Column deleted successfully' });
  } catch (error) {
    console.error('Error deleting column:', error);
    res.status(500).json({ error: 'Failed to delete column' });
  }
});


// create card
app.post('/boards/:boardId/columns/:columnId/cards', authenticateToken, async (req, res) => {
  try {
    const { boardId, columnId } = req.params;
    const { title, description } = req.body;

    const columnCheck = await pool.query(
      'SELECT * FROM columns WHERE id = $1 AND board_id = $2',
      [columnId, boardId]
    );

    if (columnCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Column not found or does not belong to this board' });
    }

    const cardsCount = await pool.query(
      'SELECT COUNT(*) FROM cards WHERE column_id = $1',
      [columnId]
    );
    const position = parseInt(cardsCount.rows[0].count);

    const result = await pool.query(
      'INSERT INTO cards (title, description, column_id, board_id, position) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, columnId, boardId, position]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating card:', error);
    res.status(500).json({ error: 'Failed to create card' });
  }
});

// get cards
app.get('/boards/:boardId/columns/:columnId/cards', authenticateToken, async (req, res) => {
  try {
    const { boardId, columnId } = req.params;
    const cards = await pool.query(
      'SELECT * FROM cards WHERE column_id = $1',
      [columnId]
    );
    res.json(cards.rows);
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).json({ error: 'Failed to fetch cards' });
  }
});

// update card
app.put('/boards/:boardId/columns/:columnId/cards/:cardId', authenticateToken, async (req, res) => {
  try {
    const { boardId, columnId, cardId } = req.params;
    const { title, description, position } = req.body;

    const updateQuery = position !== undefined
      ? 'UPDATE cards SET title = $1, description = $2, position = $3 WHERE id = $4 AND column_id = $5 AND board_id = $6 RETURNING *'
      : 'UPDATE cards SET title = $1, description = $2 WHERE id = $3 AND column_id = $4 AND board_id = $5 RETURNING *';

    const queryParams = position !== undefined
      ? [title, description, position, cardId, columnId, boardId]
      : [title, description, cardId, columnId, boardId];

    const result = await pool.query(updateQuery, queryParams);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Card not found or does not belong to this board' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating card:', error);
    res.status(500).json({ error: 'Failed to update card' });
  }
});

// delete card
app.delete('/boards/:boardId/columns/:columnId/cards/:cardId', authenticateToken, async (req, res) => {
  try {
    const { boardId, columnId, cardId } = req.params;

    const result = await pool.query(
      'DELETE FROM cards WHERE id = $1 AND column_id = $2 AND board_id = $3 RETURNING *',
      [cardId, columnId, boardId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Card not found or does not belong to this board' });
    }

    res.json({ message: 'Card deleted successfully' });
  } catch (error) {
    console.error('Error deleting card:', error);
    res.status(500).json({ error: 'Failed to delete card' });
  }
});

// share board with a user
app.post('/boards/:boardId/share', authenticateToken, async (req, res) => {
  const client = await pool.connect();
  try {
    const { boardId } = req.params;
    const { email } = req.body;
    const currentUserId = req.user.id;

    await client.query('BEGIN');

    const userResult = await client.query(
      'SELECT id, email FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      throw new Error('User not found');
    }

    const targetUser = userResult.rows[0];

    const boardResult = await client.query(
      'SELECT name FROM boards WHERE id = $1',
      [boardId]
    );

    const boardName = boardResult.rows[0].name;

    await client.query(
      'INSERT INTO board_members (board_id, user_id, role) VALUES ($1, $2, $3)',
      [boardId, targetUser.id, 'member']
    );

    await client.query(
      'INSERT INTO notifications (user_id, type, message, read) VALUES ($1, $2, $3, $4)',
      [
        targetUser.id,
        'board_shared',
        `You have been added to board "${boardName}"`,
        false
      ]
    );

    await client.query('COMMIT');
    res.status(201).json({ message: 'Board shared successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error sharing board:', error);
    res.status(500).json({ error: 'Failed to share board' });
  } finally {
    client.release();
  }
});

// get notification
app.get('/notifications', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const notifications = await pool.query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    
    res.json(notifications.rows);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

app.listen(PORT, () => {
  console.log(`Board service running on http://localhost:${PORT}`);
});