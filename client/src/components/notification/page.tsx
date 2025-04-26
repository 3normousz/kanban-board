import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { boardsApi, Notification } from "@/api/boards/boards"


export function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const data = await boardsApi.getNotifications()
                console.log("Fetched notifications:", data)
                setNotifications(data)
            } catch (error) {
                console.error("Error fetching notifications:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchNotifications()
    }, [])

    if (isLoading) {
        return <div>Loading notifications...</div>
    }

    return (
        <div className="flex flex-col items-center min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Notifications</h1>
            <div className="space-y-4">
                {notifications.map((notification) => (
                    <Card 
                        key={notification.id} 
                        className={`p-4 ${!notification.read ? 'bg-slate-50' : ''}`}
                    >
                        <p>{notification.message}</p>
                        <small className="text-gray-500">
                            {new Date(notification.created_at).toLocaleString()}
                        </small>
                    </Card>
                ))}
                {notifications.length === 0 && (
                    <p className="text-gray-500">No notifications</p>
                )}
            </div>
        </div>
    )
}