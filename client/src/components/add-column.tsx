import { useState } from "react"
import { Plus } from "lucide-react"
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
import { boardsApi } from "@/api/boards/boards"

interface AddColumnDialogProps {
    boardId: number;
    onColumnCreated: () => void;
}

export function AddColumnDialog({ boardId, onColumnCreated }: AddColumnDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [columnName, setColumnName] = useState("")

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open)
        if (!open) {
            setColumnName("")
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        const token = localStorage.getItem('token')
        if (!token) {
            console.error('No token found')
            return
        }

        try {
            const currentColumns = await boardsApi.getColumns(boardId)
            const position = currentColumns.length

            await boardsApi.createColumn(boardId, {
                name: columnName,
                position: position
            })
            
            onColumnCreated()
            setColumnName("")
            setIsOpen(false)
        } catch (error) {
            console.error("Error creating column:", error)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full ">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Column
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add column</DialogTitle>
                        <DialogDescription>
                            Create a new column for your board.
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
                                placeholder="Enter column name"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Create column</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}