import { useState, useEffect } from 'react';
import { DataTable } from '@/components/data-table';
import Navbar from '@/components/navbar';
import { boardsApi, Board } from '@/api/boards/boards';
import { AddBoardDialog } from '@/components/add-board';

export function Home() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBoards = async () => {
    try {
      const data = await boardsApi.getBoards();
      setBoards(data);
    } catch (error) {
      console.error('Failed to fetch boards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold mt-4 mb-4">Kanban Board</h1>
        <div className="flex flex-col items-center mt-4">
          <AddBoardDialog onBoardCreated={fetchBoards} />
          <h2 className="text-xl font-semibold mt-4 mb-2">Your Boards</h2>
          {isLoading ? (
            <p>Loading...</p>
          ) : boards.length > 0 ? (
            <DataTable data={boards} isLoading={isLoading} onBoardUpdated={fetchBoards} />
          ) : (
            <p>No boards available.</p>
          )}
        </div>
      </div>
    </>
  );
}