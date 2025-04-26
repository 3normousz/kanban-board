import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { boardsApi, Column } from '@/api/boards/boards'

interface EditColumnDialogProps {
    boardId: number;
    column: Column;
    onColumnUpdated: () => void;
}

export function EditColumnDialog({ boardId, column, onColumnUpdated }: EditColumnDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [columnName, setColumnName] = useState(column.name)
    const [position, setPosition] = useState(column.position)

    useEffect(() => {
        setColumnName(column.name)
        setPosition(column.position)
    }, [column])

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setColumnName(column.name)
            setPosition(column.position)
        }
        setIsOpen(open)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        const token = localStorage.getItem('token')
        if (!token) {
            console.error('No token found')
            return
        }

        const data = {
            name: columnName,
            position: position
        }

        try {
            await boardsApi.updateColumn(boardId, column.id, data)
            onColumnUpdated()
            setIsOpen(false)
        } catch (error) {
            console.error("Error updating column:", error)
        }
    }

    const handleDeleteColumn = async (columnId: number) => {
        const token = localStorage.getItem('token')
        if (!token) {
            console.error('No token found')
            return
        }
    
        try {
            const allColumns = await boardsApi.getColumns(boardId);
            const currentColumn = allColumns.find(c => c.id === columnId);
            
            if (!currentColumn) {
                throw new Error('Column not found');
            }
    
            await boardsApi.deleteColumn(boardId, columnId);
    
            const remainingColumns = await boardsApi.getColumns(boardId);
            const columnsToUpdate = remainingColumns
                .filter(c => c.position > currentColumn.position)
                .map(c => ({
                    ...c,
                    position: c.position - 1
                }));
    
            await Promise.all(
                columnsToUpdate.map(column =>
                    boardsApi.updateColumn(boardId, column.id, {
                        name: column.name,
                        position: column.position
                    })
                )
            );
    
            onColumnUpdated();
            setIsOpen(false);
        } catch (error) {
            console.error("Error deleting column:", error);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit column</DialogTitle>
                        <DialogDescription>
                            Make changes to your column here.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="column-name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="column-name"
                                value={columnName}
                                onChange={(e) => setColumnName(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="position" className="text-right">
                                Position
                            </Label>
                            <Input
                                id="position"
                                type="number"
                                value={position}
                                onChange={(e) => setPosition(parseInt(e.target.value))}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="destructive" onClick={() => handleDeleteColumn(column.id)}>
                            Delete
                        </Button>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}