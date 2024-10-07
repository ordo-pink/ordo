import { Maoka } from "@ordo-pink/maoka"

type P = Pick<Ordo.Notification.Instance, "message">
export const NotificationMessage = ({ message }: P) => Paragraph(() => message)

const Paragraph = Maoka.styled("p")
