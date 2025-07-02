import { maoka } from "@ordo-pink/maoka"

export const current_user_workspace = maoka.create("div", () => {
	return () => "HELLO USER"
})
