const BASE_URL = import.meta.env.VITE_BOARD_API_URL;

export interface Board {
  id: number;
  name: string;
  description: string;
  owner_id: number;
  owner_email: string;
  created_at: string;
}

export interface Column {
    id: number;
    name: string;
    position: number;
    board_id: number;
}
  
export interface Card {
    id: number;
    title: string;
    description?: string;
    position: number;
    column_id: number;
}

export interface Notification {
    id: number;
    type: string;
    message: string;
    created_at: string;
    read: boolean;
}

export const boardsApi = {

  getBoardOwner: async (boardId: number): Promise<{ email: string }> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/boards/${boardId}/owner`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch board owners');
    }
    return response.json();
  },
    
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

  getBoardMembers: async (boardId: number): Promise<{ id: number; name: string }[]> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/boards/${boardId}/members`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch board members');
    }

    return response.json();
  },

  getBoardById: async (boardId: number): Promise<Board> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/boards/${boardId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch board');
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

  getColumns: async (boardId: number): Promise<Column[]> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/boards/${boardId}/columns`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch columns');
    }

    return response.json();
  },

  createColumn: async (boardId: number, data: { name: string; position: number }): Promise<Column> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/boards/${boardId}/columns`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create column');
    }

    return response.json();
  },

  updateColumn: async (boardId: number, columnId: number, data: { name?: string; position?: number }): Promise<Column> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/boards/${boardId}/columns/${columnId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update column');
    }

    return response.json();
  },

  deleteColumn: async (boardId: number, columnId: number): Promise<void> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/boards/${boardId}/columns/${columnId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete column');
    }
  },

  getCards: async (boardsId:number, columnId: number): Promise<Card[]> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/boards/${boardsId}/columns/${columnId}/cards`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch cards');
    }

    return response.json();
  },

  createCard: async (boardsId: number, columnId: number, data: { title: string; description?: string }): Promise<Card> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/boards/${boardsId}/columns/${columnId}/cards`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create card');
    }

    return response.json();
  },

  updateCard: async (boardsId: number, columnId: number, cardId: number, data: { title?: string; description?: string, position?: number }): Promise<Card> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/boards/${boardsId}/columns/${columnId}/cards/${cardId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update card');
    }

    return response.json();
  },

  deleteCard: async (boardsId: number, columnId: number, cardId: number): Promise<void> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/boards/${boardsId}/columns/${columnId}/cards/${cardId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete card');
    }
  },

  shareBoard: async (boardId: number, email: string): Promise<void> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/boards/${boardId}/share`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
    });

    if (!response.ok) {
        throw new Error('Failed to share board');
    }
  },

  getNotifications: async (): Promise<Notification[]> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/notifications`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch notifications');
    }

    return response.json();
  },

};