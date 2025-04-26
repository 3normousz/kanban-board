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
import { Textarea } from "@/components/ui/textarea"
import { boardsApi } from "@/api/boards/boards"

interface AddCardDialogProps {
    boardId: number;
    columnId: number;
    onCardCreated: () => void;
}

export function AddCardDialog({ boardId, columnId, onCardCreated }: AddCardDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await boardsApi.createCard( boardId, columnId, {
                title,
                description
            })
            onCardCreated()
            setIsOpen(false)
            setTitle("")
            setDescription("")
        } catch (error) {
            console.error("Error creating card:", error)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Card
                </Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add new card</DialogTitle>
                        <DialogDescription>
                            Create a new card for this column.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                                Title
                            </Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Create card</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}