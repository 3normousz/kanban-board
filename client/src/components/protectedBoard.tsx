import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { boardsApi } from '@/api/boards/boards';

interface ProtectedBoardProps {
  children: React.ReactNode;
  boardId: number;
}

export function ProtectedBoard({ children, boardId }: ProtectedBoardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const checkOwnership = async () => {
      try {
        const boardMembers = await boardsApi.getBoardMembers(boardId);
        const token = localStorage.getItem('token');
        if (!token) {
          setIsOwner(false);
          return;
        }
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.id;
        const isBoardOwner = boardMembers.some((member) => member.id === userId);
        setIsOwner(isBoardOwner);
      } catch (error) {
        console.error('Error checking board ownership:', error);
        setIsOwner(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkOwnership();
  }, [boardId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isOwner) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}