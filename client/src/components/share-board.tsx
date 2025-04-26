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
import { boardsApi } from "@/api/boards/boards"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

interface ShareBoardDialogProps {
    boardId: number;
    boardName: string;
}

export function ShareBoardDialog({ boardId, boardName }: ShareBoardDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [email, setEmail] = useState("")
    const [isSharing, setIsSharing] = useState(false)

    const handleShare = async () => {
        if (!email) return

        setIsSharing(true)
        try {
            await boardsApi.shareBoard(boardId, email)
            setIsOpen(false)
            setEmail("")
        } catch (error) {
            console.error("Error sharing board:", error)
        } finally {
            setIsSharing(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Share
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Share Board</DialogTitle>
                    <DialogDescription>
                        Share "{boardName}" with other users
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="col-span-3"
                            placeholder="user@example.com"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button 
                        onClick={handleShare} 
                        disabled={isSharing || !email}
                    >
                        {isSharing ? "Sharing..." : "Share"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}