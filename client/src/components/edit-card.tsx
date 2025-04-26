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
import { Textarea } from "@/components/ui/textarea"
import { boardsApi, Card } from '@/api/boards/boards'

interface EditCardDialogProps {
    boardId: number;
    columnId: number;
    card: Card;
    onCardUpdated: () => void;
  }

export function EditCardDialog({ 
    boardId, 
    columnId, 
    card, 
    onCardUpdated,
}: EditCardDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [title, setTitle] = useState(card.title)
    const [description, setDescription] = useState(card.description || "")

    useEffect(() => {
        setTitle(card.title)
        setDescription(card.description || "")
    }, [card])

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setTitle(card.title)
            setDescription(card.description || "")
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
            title,
            description,
        }

        try {
            await boardsApi.updateCard(boardId, columnId, card.id, data)
            onCardUpdated()
            setIsOpen(false)
        } catch (error) {
            console.error("Error updating card:", error)
        }
    }

    const handleDeleteCard = async (cardId: number) => {
        const token = localStorage.getItem('token')
        if (!token) {
            console.error('No token found')
            return
        }
    
        try {
            const allCards = await boardsApi.getCards(boardId, columnId);
            const currentCard = allCards.find(c => c.id === cardId);
            
            if (!currentCard) {
                throw new Error('Card not found');
            }
    
            await boardsApi.deleteCard(boardId, columnId, cardId);
    
            const columnCards = await boardsApi.getCards(boardId, columnId);
            const cardsToUpdate = columnCards
                .filter(c => c.position > currentCard.position)
                .map(c => ({
                    ...c,
                    position: c.position - 1
                }));
    
            await Promise.all(
                cardsToUpdate.map(card =>
                    boardsApi.updateCard(boardId, columnId, card.id, {
                        title: card.title,
                        description: card.description,
                        position: card.position
                    })
                )
            );
    
            onCardUpdated();
            setIsOpen(false);
        } catch (error) {
            console.error("Error deleting card:", error);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit card</DialogTitle>
                        <DialogDescription>
                            Make changes to your card here.
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
                        <Button type="button" variant={"destructive"} onClick={() => handleDeleteCard(card.id)}>
                            Delete
                        </Button>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}