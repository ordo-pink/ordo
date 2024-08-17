import { create } from "@ordo-pink/maoka"

const p = create("p")

type P = Pick<Client.Notification.Item, "message">
export const NotificationMessage = ({ message }: P) => p(() => message)
