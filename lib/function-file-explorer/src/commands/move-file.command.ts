import { ContextMenuItemType, Metadata } from "@ordo-pink/core"
import { BsFilesAlt } from "@ordo-pink/frontend-icons"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { MetadataIcon } from "@ordo-pink/maoka-components"
import { Result } from "@ordo-pink/result"

export const register_move_command = (ctx: Ordo.CreateFunction.Params) => {
	const commands = ctx.get_commands()
	const metadata_query = ctx.get_metadata_query().cata(Result.catas.expect(() => "Permission denied"))

	commands.emit("cmd.application.context_menu.add", {
		command: "cmd.metadata.show_move_palette",
		render_icon: div => div.appendChild(BsFilesAlt() as SVGSVGElement),
		readable_name: "t.file_explorer.modals.move.title",
		should_show: ({ payload }) => Metadata.Validations.is_metadata(payload),
		payload_creator: ({ payload }) => (payload as Ordo.Metadata.Instance).get_fsid(),
		type: ContextMenuItemType.UPDATE,
	})

	commands.on("cmd.metadata.show_move_palette", id => {
		const move_metadata_destionations = metadata_query
			.get()
			.pipe(Result.ops.chain(all_metadata => metadata_query.get_descendents(id).pipe(Result.ops.map(descs => [all_metadata, descs]))))
			.pipe(
				Result.ops.map(([all_metadata, descendents]) =>
					all_metadata.filter(
						metadata =>
							metadata.get_fsid() !== id &&
							!metadata_query.has_child(metadata.get_fsid(), id).unwrap() &&
							!descendents.some(metadata.equals),
					),
				),
			)
			.cata(Result.catas.or_else(() => [] as Ordo.Metadata.Instance[]))

		commands.emit("cmd.application.command_palette.show", {
			items: move_metadata_destionations.map(metadata => {
				const Icon = MaokaOrdo.Components.WithCtx(ctx, () => MetadataIcon({ metadata, show_emoji_picker: false }))

				const on_select = () => commands.emit("cmd.metadata.move", { fsid: id, new_parent: metadata.get_fsid() })
				const readable_name = metadata.get_name() as Ordo.I18N.TranslationKey
				const render_icon = (div: HTMLDivElement) => Maoka.render_dom(div, Icon)

				return { render_icon, readable_name, on_select }
			}),
		})
	})
}
