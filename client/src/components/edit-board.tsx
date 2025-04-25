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
import { boardsApi, Board } from '@/api/boards/boards'

interface EditBoardDialogProps {
    board: Board;
    onBoardUpdated: () => void;
}

export function EditBoardDialog({ board, onBoardUpdated }: EditBoardDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [boardName, setBoardName] = useState(board.name)
    const [description, setDescription] = useState(board.description || "")

    useEffect(() => {
        setBoardName(board.name)
        setDescription(board.description || "")
    }, [board])

    const handleOpenChange = (open: boolean) => {
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
            name: boardName,
            description: description,
        }

        try {
            const response = await boardsApi.updateBoard(board.id, data)
            console.log("Board updated:", response)
            onBoardUpdated()
            setIsOpen(false)
        } catch (error) {
            console.error("Error updating board:", error)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="w-full justify-start font-normal px-2 py-1.5">
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit board</DialogTitle>
                        <DialogDescription>
                            Make changes to your board here.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="board-name" className="text-right">
                                Board Name
                            </Label>
                            <Input
                                id="board-name"
                                value={boardName}
                                onChange={(e) => setBoardName(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <Input
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}