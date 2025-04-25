import { useState } from "react"
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
import { Plus } from "lucide-react"
import { boardsApi } from '@/api/boards/boards';

export function AddBoardDialog({ onBoardCreated }: { onBoardCreated: () => void }) {
    const [isOpen, setIsOpen] = useState(false)
    const [boardName, setBoardName] = useState("")
    const [description, setDescription] = useState("")

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open)
        if (!open) {
            setBoardName("")
            setDescription("")
        }
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
            const response = await boardsApi.createBoard(data)
            console.log("Board created:", response)
            onBoardCreated()
        }
        catch (error) {
            console.error("Error creating board:", error)
        }
        
        setBoardName("")
        setDescription("")
        setIsOpen(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                    Add Board
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add a new board</DialogTitle>
                        <DialogDescription>
                            Create a new board to organize your tasks and projects.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="board-name" className="text-right">
                                Board Name
                            </Label>
                            <Input id="board-name"
                                value={boardName}
                                onChange={(e) => setBoardName(e.target.value)}
                                placeholder="My Board"
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
                                placeholder="A brief description of the board"
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Add a new board</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
