import { ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CardMoveControlsProps {
  isFirst: boolean;
  isLast: boolean;
  onMoveCard: (direction: 'up' | 'down') => Promise<void>;
}

export function CardMoveControls({ isFirst, isLast, onMoveCard }: CardMoveControlsProps) {
  return (
    <div className="flex gap-1">
      {!isFirst && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 p-0"
          onClick={() => onMoveCard('up')}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
      )}
      {!isLast && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 p-0"
          onClick={() => onMoveCard('down')}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}