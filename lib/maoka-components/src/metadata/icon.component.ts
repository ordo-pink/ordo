import { BsFileEarmark, BsFileEarmarkBinary, BsFolderOpen } from "@ordo-pink/frontend-icons"
import { MaokaOrdo, OrdoHooks } from "@ordo-pink/maoka-ordo-hooks"
import { Maoka } from "@ordo-pink/maoka"
import { R } from "@ordo-pink/result"
import { Switch } from "@ordo-pink/switch"
import { type TMetadata } from "@ordo-pink/managers"
import { emojis } from "@ordo-pink/emojis"

type P = { metadata: TMetadata; custom_class?: string }
export const MetadataIcon = ({ metadata, custom_class = "" }: P) =>
	Maoka.create("div", ({ use, refresh, on_unmount }) => {
		let emoji = metadata.get_property("emoji_icon")

		const commands = use(OrdoHooks.commands)
		const metadata_query = use(OrdoHooks.metadata_query)

		const subscription = metadata_query.$.subscribe(() => {
			metadata_query
				.get_by_fsid(metadata.get_fsid())
				.pipe(R.ops.chain(R.FromOption))
				.pipe(R.ops.map(metadata => metadata.get_property("emoji_icon")))
				.cata(
					R.catas.if_ok(icon => {
						emoji = icon
						refresh()
					}),
				)
		})

		on_unmount(() => subscription.unsubscribe())

		use(Maoka.hooks.set_class("cursor-pointer"))

		use(
			Maoka.hooks.listen("onclick", event => {
				event.stopPropagation()

				commands.emit("cmd.application.command_palette.show", {
					items: emojis.map(
						emoji =>
							({
								id: emoji.code_point,
								on_select: () => {
									commands.emit("cmd.metadata.set_property", {
										fsid: metadata.get_fsid(),
										key: "emoji_icon",
										value: emoji.icon,
									})

									commands.emit("cmd.application.command_palette.hide")
								},
								readable_name: `${emoji.icon} ${emoji.description}` as any,
								shows_next_palette: false,
							}) satisfies Client.CommandPalette.Item,
					),
				})
			}),
		)

		return () => {
			if (emoji.is_some)
				return Maoka.create("div", ({ use }) => {
					use(Maoka.hooks.set_class(custom_class))
					return () => emoji.unwrap()
				})

			return metadata_query.has_children(metadata.get_fsid()).cata({
				Err: () => Icon({ metadata, custom_class, has_children: false }),
				Ok: has_children => Icon({ metadata, custom_class, has_children }),
			})
		}
	})

type P2 = P & { has_children: boolean }
const Icon = ({ metadata, custom_class, has_children }: P2) =>
	Maoka.create("div", ({ use, refresh, on_unmount, current_element }) => {
		let file_associations: Ordo.FileAssociation.Instance[] = []

		const file_associations$ = use(MaokaOrdo.Hooks.file_associations)

		const subscription = file_associations$.subscribe(value => {
			file_associations = value
			refresh()
		})

		on_unmount(() => subscription.unsubscribe())

		const metadata_content_type = metadata.get_type()
		const fa = file_associations.find(association =>
			association.types.some(type => metadata_content_type === type.name),
		)

		return () =>
			Switch.OfTrue()
				.case(!!fa && !!fa.render_icon, () => fa!.render_icon!(current_element))
				.case(has_children, () => BsFolderOpen(`ml-1 shrink-0 ${custom_class}`))
				.case(metadata.get_size() === 0, () => BsFileEarmark(`ml-1 shrink-0 ${custom_class}`))
				.default(() => BsFileEarmarkBinary(`ml-1 shrink-0 ${custom_class}`))
	})
