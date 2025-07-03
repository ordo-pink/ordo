import { maoka, maoka_styled } from "@ordo-pink/maoka"
import type { User } from "@ordo-pink/sdk-core"
import { maoka_sdk } from "@ordo-pink/sdk-maoka"

import { user_card, user_card_body, user_card_title } from "../user-card/user-card.component"

export const credentials_card = maoka.create<{ handle: User.Handle; name: string; email: User.Email }>(
	"div",
	({ handle, email, name, use }) => {
		const t_handle_title = use(maoka_sdk.jabs.translate$("user_workspace_current_handle_title"))
		const t_edit = use(maoka_sdk.jabs.translate$("user_common_edit"))
		const t_email_title = use(maoka_sdk.jabs.translate$("user_workspace_current_email_title"))
		const t_name_title = use(maoka_sdk.jabs.translate$("user_workspace_current_name_title"))

		/**
		 * maoka_sdk.components.button.neutral({ hotkey: "meta+n", kindergarten: t_edit, on_click: () => void 0 }),
		 */

		return () =>
			user_card(() => [
				user_card_title(t_handle_title),
				user_card_body(() =>
					items(() => [
						item(() => [
							item_title(t_handle_title),
							item_main(() => handle),
							maoka_sdk.components.button.neutral({ hotkey: "meta+h", kindergarten: t_edit, on_click: () => void 0 }),
						]),
						item(() => [
							item_title(t_email_title),
							item_main(() => email),
							maoka_sdk.components.button.neutral({ hotkey: "meta+e", kindergarten: t_edit, on_click: () => void 0 }),
						]),
						item(() => [
							item_title(t_name_title),
							item_main(() => name),
							maoka_sdk.components.button.neutral({ hotkey: "meta+n", kindergarten: t_edit, on_click: () => void 0 }),
						]),
					]),
				),
			])
	},
)

const items = maoka_styled.div("flex gap-2 text-left flex-col")
const item = maoka_styled.div("flex gap-2 items-center")
const item_title = maoka_styled.div("hidden lg:block lg:w-1/6")
const item_main = maoka_styled.div("flex-grow")
