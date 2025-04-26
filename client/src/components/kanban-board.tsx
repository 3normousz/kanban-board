import { useState, useEffect } from "react"
import { boardsApi, Column, Card as CardType } from "@/api/boards/boards"
import { Card } from "@/components/ui/card"
import { AddColumnDialog } from "./add-column"
import { AddCardDialog } from "./add-card"
import { EditColumnDialog } from "./edit-column"
import { EditCardDialog } from "./edit-card"
import { CardMoveControls } from "./move-card"

interface KanbanBoardProps {
  boardId: number;
}

export function KanbanBoard({ boardId }: KanbanBoardProps) {
  const [columns, setColumns] = useState<Column[]>([])
  const [cards, setCards] = useState<{ [columnId: number]: CardType[] }>({})
  const [isLoading, setIsLoading] = useState(true)

  const fetchCards = async (columnId: number) => {
    try {
      const cardData = await boardsApi.getCards(boardId, columnId)
      const sortedCards = cardData.sort((a, b) => a.position - b.position)

      setCards(prev => ({
        ...prev,
        [columnId]: sortedCards
      }))
    } catch (error) {
      console.error('Failed to fetch cards:', error)
    }
  }

  const fetchColumns = async () => {
    try {
      const data = await boardsApi.getColumns(boardId)
      setColumns(data)
      await Promise.all(data.map(column => fetchCards(column.id)))
    } catch (error) {
      console.error('Failed to fetch columns:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleMoveCard = async (columnId: number, card: CardType, direction: 'up' | 'down') => {
    const columnCards = cards[columnId];
    if (!columnCards) return;

    const currentIndex = columnCards.findIndex(c => c.id === card.id);
    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (swapIndex < 0 || swapIndex >= columnCards.length) return;

    const swapCard = columnCards[swapIndex];

    try {
      await Promise.all([
        boardsApi.updateCard(boardId, columnId, card.id, {
          ...card,
          position: swapCard.position
        }),
        boardsApi.updateCard(boardId, columnId, swapCard.id, {
          ...swapCard,
          position: card.position
        })
      ]);

      await fetchCards(columnId);
    } catch (error) {
      console.error("Error swapping cards:", error);
    }
  };

  useEffect(() => {
    fetchColumns()
  }, [boardId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">
          Loading board...
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center">
          <div className="w-200">
            <AddColumnDialog boardId={boardId} onColumnCreated={fetchColumns} />
          </div>
      </div>
      <div className="p-4">
        <div className="flex gap-4">
          {columns.map((column) => (
            <div key={column.id} className="w-80">
              <Card className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">{column.name}</h3>
                  <EditColumnDialog 
                    boardId={boardId} 
                    column={column} 
                    onColumnUpdated={fetchColumns} 
                  />
                </div>     
                <div className="space-y-2">
                  {cards[column.id]?.map((card, index) => (
                    <Card key={card.id} className="p-3 bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium">{card.title}</h4>
                          {card.description && (
                            <p className="text-sm text-gray-500 mt-1">{card.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <CardMoveControls
                            isFirst={index === 0}
                            isLast={index === (cards[column.id]?.length || 0) - 1}
                            onMoveCard={async (direction) => {
                              await handleMoveCard(column.id, card, direction);
                            }}
                          />
                          <EditCardDialog 
                            boardId={boardId} 
                            columnId={column.id} 
                            card={card}
                            onCardUpdated={() => fetchCards(column.id)}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                <AddCardDialog 
                  boardId={boardId}
                  columnId={column.id} 
                  onCardCreated={() => fetchCards(column.id)} 
                />
              </Card>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}