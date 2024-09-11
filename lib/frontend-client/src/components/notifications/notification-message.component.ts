import { create } from "@ordo-pink/maoka"

type P = Pick<Client.Notification.Item, "message">
export const NotificationMessage = ({ message }: P) => create("p", () => message)
