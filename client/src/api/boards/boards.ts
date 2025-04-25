const BASE_URL = 'http://localhost:3001';

export interface Board {
  id: number;
  name: string;
  description: string;
  owner_id: number;
  created_at: string;
}

export const boardsApi = {
  getBoards: async (): Promise<Board[]> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/boards`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch boards');
    }

    return response.json();
  },

  createBoard: async (data: { name: string; description: string }): Promise<Board> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/boards`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create board');
    }

    return response.json();
  },

  deleteBoard: async (boardId: number): Promise<void> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/boards/${boardId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete board');
    }
  },

  updateBoard: async (boardId: number, data: { name?: string; description?: string }): Promise<Board> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/boards/${boardId}`, {
    method: 'PUT',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    });

    if (!response.ok) {
    throw new Error('Failed to update board');
    }

    return response.json();
  },

};