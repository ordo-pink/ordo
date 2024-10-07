import { BsFileEarmark, BsFileEarmarkBinary, BsFolderOpen } from "@ordo-pink/frontend-icons"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { R } from "@ordo-pink/result"
import { Switch } from "@ordo-pink/switch"
import { emojis } from "@ordo-pink/emojis"

type P = { metadata: Ordo.Metadata.Instance; custom_class?: string }
export const MetadataIcon = ({ metadata, custom_class = "" }: P) =>
	Maoka.create("div", ({ use, refresh, on_unmount }) => {
		let emoji = metadata.get_property("emoji_icon")

		const commands = use(MaokaOrdo.Jabs.Commands)
		const metadata_query = use(MaokaOrdo.Jabs.MetadataQuery)

		const subscription = metadata_query.$.subscribe(() => {
			metadata_query
				.get_by_fsid(metadata.get_fsid())
				.pipe(R.ops.chain(R.FromOption))
				.pipe(R.ops.map(metadata => metadata.get_property("emoji_icon")))
				.cata(
					R.catas.if_ok(icon => {
						emoji = icon
						void refresh()
					}),
				)
		})

		on_unmount(() => subscription.unsubscribe())

		use(MaokaJabs.set_class("cursor-pointer"))

		use(
			MaokaJabs.listen("onclick", event => {
				event.stopPropagation()

				commands.emit("cmd.application.command_palette.show", {
					items: emojis.map(
						emoji =>
							({
								on_select: () => {
									commands.emit("cmd.metadata.set_property", {
										fsid: metadata.get_fsid(),
										key: "emoji_icon",
										value: emoji.icon,
									})

									commands.emit("cmd.application.command_palette.hide")
								},
								readable_name: `${emoji.icon} ${emoji.description}` as any,
							}) satisfies Ordo.CommandPalette.Instance,
					),
				})
			}),
		)

		return () => {
			if (emoji.is_some)
				return Maoka.create("div", ({ use }) => {
					use(MaokaJabs.set_class(custom_class))
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
	Maoka.create("div", ({ use, refresh, element }) => {
		let file_associations: Ordo.FileAssociation.Instance[] = []

		const metadata_content_type = metadata.get_type()

		const $ = use(MaokaOrdo.Jabs.FileAssociations$)
		const handle_file_associations_update = (value: Ordo.FileAssociation.Instance[]) => {
			file_associations = value
			void refresh()
		}

		use(MaokaOrdo.Jabs.subscribe($, handle_file_associations_update))

		return async () => {
			const fa = file_associations.find(association =>
				association.types.some(type => metadata_content_type === type.name),
			)

			if (fa && fa.render_icon) {
				element.innerHTML = ""
				await fa.render_icon(element as HTMLSpanElement)
				return
			}

			return Switch.OfTrue()
				.case(has_children, () => BsFolderOpen(`ml-1 shrink-0 ${custom_class}`))
				.case(metadata.get_size() === 0, () => BsFileEarmark(`ml-1 shrink-0 ${custom_class}`))
				.default(() => BsFileEarmarkBinary(`ml-1 shrink-0 ${custom_class}`))
		}
	})
