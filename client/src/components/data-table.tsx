import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { boardsApi, Board } from '@/api/boards/boards';
import { EditBoardDialog } from "./edit-board";
import { ShareBoardDialog } from './share-board';

interface DataTableProps {
  data: Board[];
  isLoading: boolean;
  onBoardUpdated: () => void;
}

export function DataTable({ data, isLoading, onBoardUpdated }: DataTableProps) {
  const navigate = useNavigate();
  const [owners, setOwner] = useState('');

  if (isLoading) {
    return <div>Loading...</div>;
  }

  useEffect(() => {
    const fetchOwnersForBoards = async () => {
      try {
        await Promise.all(
          data.map(async (board) => {
            const ownerData = await boardsApi.getBoardOwner(board.id);
            setOwner(ownerData.email);
          })
        );
      } catch (error) {
        console.error('Error fetching owners:', error);
      }
    };

    fetchOwnersForBoards();
  }, [data]);
  
  const handleDelete = async (boardId: number) => {
    try {
        await boardsApi.deleteBoard(boardId);
        console.log('Board deleted successfully');
        onBoardUpdated();
    } catch (error) {
        console.error('Error deleting board:', error);
    }
  };

  const handleViewBoard = async (boardId: number) => {
    try {
        navigate(`/board/${boardId}`);
    } catch (error) {
        console.error('Error fetching board details:', error);
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((board) => (
            <TableRow key={board.id}>
                <TableCell 
                    className="font-medium"
                    onClick={() => handleViewBoard(board.id)}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                >
                    {board.name}
                </TableCell>
                <TableCell>{board.description}</TableCell>
                <TableCell>{owners || 'Loading...'}</TableCell>
                <TableCell>
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <EditBoardDialog board={board} onBoardUpdated={onBoardUpdated}/>
                        <ShareBoardDialog boardId={board.id} boardName={board.name} />
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(board.id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}