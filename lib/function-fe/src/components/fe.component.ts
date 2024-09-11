import { create, listen, set_class } from "@ordo-pink/maoka"
import {
	get_commands,
	get_metadata_ancestors,
	get_metadata_by_fsid,
	get_metadata_children,
	get_route_params,
	ordo_context,
} from "@ordo-pink/maoka-ordo-hooks"
import { type FSID } from "@ordo-pink/data"
import { type TCreateFunctionContext } from "@ordo-pink/core"

import { FileExplorerFile } from "./file-explorer-file.component"
import { Switch } from "@ordo-pink/switch"
import { is_nan } from "@ordo-pink/tau"

export const FileExplorer = (ctx: TCreateFunctionContext) =>
	create("div", ({ use, on_mount }) => {
		use(ordo_context.provide(ctx))

		use(set_class("h-full overflow-y-hidden"))

		const commands = use(get_commands)
		const { fsid } = use(get_route_params<{ fsid: FSID }>)
		const ancestors = use(get_metadata_ancestors(fsid))
		const metadata = use(get_metadata_by_fsid(fsid))

		const path = Switch.OfTrue()
			.case(ancestors.length > 0, () =>
				metadata!
					.get_name()
					.concat(" / ")
					.concat(ancestors.map(ancestor => ancestor.get_name()).join(" / ")),
			)
			.case(!!metadata, () => `${metadata?.get_name()}`)
			.default(() => "/")

		const children = use(get_metadata_children(fsid)).sort((a, b) => {
			const a_as_number = Number.parseInt(a.get_name(), 10)
			if (!is_nan(a_as_number)) {
				const b_as_number = Number.parseInt(b.get_name(), 10)
				return a_as_number < b_as_number ? -1 : 1
			}

			return a.get_name().localeCompare(b.get_name())
		})

		on_mount(() => {
			commands.emit("cmd.application.set_title", {
				status_bar_title: path,
				window_title: `${path} | File Explorer`,
			})
		})

		return create("div", ({ use }) => {
			const context_menu_listener = listen("oncontextmenu", event => {
				event.preventDefault()

				commands.emit("cmd.application.context_menu.show", {
					event: event as any,
					payload: metadata ?? "root",
					hide_delete_items: !metadata,
					hide_update_items: !metadata,
					hide_read_items: !metadata,
				})
			})

			use(set_class("h-full overflow-y-auto p-4"))
			use(context_menu_listener)

			return create("div", ({ use }) => {
				use(set_class("flex gap-2 flex-wrap"))

				return children.map(child => FileExplorerFile(child))
			})
		})
	})
