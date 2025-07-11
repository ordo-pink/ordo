import { maoka, maoka_styled } from "@ordo-pink/maoka"
import type { User } from "@ordo-pink/sdk-core"
import { maoka_sdk } from "@ordo-pink/sdk-maoka"

import { user_card, user_card_body, user_card_title } from "../user-card/user-card.component"

import "./user-credentials.styles.css"

export const credentials_card = maoka.create<{ handle: User.Handle; name: string; email: User.Email }>(
	"div",
	({ handle, email, name, use }) => {
		const t_edit = use(maoka_sdk.jabs.translate$("user_common_edit"))
		const t_email_title = use(maoka_sdk.jabs.translate$("user_workspace_current_user_info_email"))
		const t_handle_title = use(maoka_sdk.jabs.translate$("user_workspace_current_user_info_handle"))
		const t_name_title = use(maoka_sdk.jabs.translate$("user_workspace_current_user_info_name"))

		use(maoka_sdk.jabs.classes.set("credentials-card"))

		return () =>
			user_card(() => [
				user_card_title(t_handle_title),
				user_card_body(() =>
					items(() => [
						item(() => [
							item_title(t_handle_title),
							item_content(() => handle),
							maoka_sdk.components.button.neutral({ hotkey: "meta+h", kindergarten: t_edit, on_click: () => void 0 }),
						]),
						item(() => [
							item_title(t_email_title),
							item_content(() => email),
							maoka_sdk.components.button.neutral({ hotkey: "meta+e", kindergarten: t_edit, on_click: () => void 0 }),
						]),
						item(() => [
							item_title(t_name_title),
							item_content(() => name),
							maoka_sdk.components.button.neutral({ hotkey: "meta+n", kindergarten: t_edit, on_click: () => void 0 }),
						]),
					]),
				),
			])
	},
)

const items = maoka_styled.div("items")
const item = maoka_styled.div("item")
const item_title = maoka_styled.div("title")
const item_content = maoka_styled.div("content")
