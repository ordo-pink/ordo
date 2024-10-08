import { CurrentUserReference, Link, MetadataIcon } from "@ordo-pink/maoka-components"
import { Maoka, type TMaokaChildren, type TMaokaElement } from "@ordo-pink/maoka"
import { BsPlus } from "@ordo-pink/frontend-icons"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { R } from "@ordo-pink/result"

// TODO: Avoid unnecessary rerenders by narrowing down hooks

const BORDER_COLOR_CLASS = "border-neutral-300 dark:border-neutral-700"

export const Database = (metadata: Ordo.Metadata.Instance, ctx: Ordo.CreateFunction.Params) =>
	Maoka.create("div", ({ use, refresh, on_unmount }) => {
		let descendents: Ordo.Metadata.Instance[] = []

		use(MaokaOrdo.Context.provide(ctx))
		use(MaokaJabs.set_class("p-4"))

		const metadata_query = use(MaokaOrdo.Jabs.MetadataQuery)

		const subscription = metadata_query.$.subscribe(() => {
			const metadata_descendents = metadata_query
				.get_descendents(metadata.get_fsid())
				.cata(R.catas.or_else(() => []))

			if (descendents.length !== metadata_descendents.length) {
				descendents = metadata_descendents
				void refresh()
			}
		})

		on_unmount(() => subscription.unsubscribe())

		return () => {
			return Maoka.create("table", ({ use }) => {
				use(MaokaJabs.set_class(`w-full table-auto border-t ${BORDER_COLOR_CLASS}`))

				// TODO: Move to translations
				// TODO: Add icons
				const keys = [
					"Name",
					"Created At",
					"Created By",
					"Updated At",
					"Updated By",
					"Labels",
					// "Links",
					// "Size",
				]

				return () => [
					Maoka.create("thead", () => {
						return () =>
							Maoka.create("tr", ({ use }) => {
								use(MaokaJabs.set_class("text-left"))

								return () =>
									keys.map(key =>
										Maoka.create("th", ({ use }) => {
											use(
												MaokaJabs.set_class(
													`border-r text-sm last-of-type:border-r-0 last-of-type:border-l ${BORDER_COLOR_CLASS} px-2 py-1 font-normal text-neutral-500`,
												),
											)
											return () => key
										}),
									)
							})
					}),

					Maoka.create("tbody", () => {
						return () => [
							...descendents.map(child =>
								Maoka.create("tr", ({ use }) => {
									use(MaokaJabs.set_class(`border-y ${BORDER_COLOR_CLASS}`))

									return () => [
										FileNameCell(child),
										Cell(child.get_created_at().toLocaleDateString()),
										// Cell(UserReference(child.get_created_by())),
										Cell(CurrentUserReference),
										Cell(child.get_updated_at().toLocaleDateString()),
										// Cell(UserReference(child.get_updated_by())),
										Cell(CurrentUserReference),
										Cell(child.get_labels().join(", ")),
										// Cell(child.get_links().join(", ")),
										// Cell(child.get_readable_size()),
									]
								}),
							),

							Maoka.create("tr", ({ use }) => {
								const { emit } = use(MaokaOrdo.Jabs.Commands)
								use(MaokaJabs.set_class(`border-y ${BORDER_COLOR_CLASS}`))

								return () =>
									Maoka.create("td", ({ use }) => {
										use(
											MaokaJabs.set_class(
												"px-2 py-1 text-neutral-500 text-sm flex items-center gap-x-1 cursor-pointer",
											),
										)

										use(
											MaokaJabs.listen("onclick", () => {
												emit("cmd.metadata.show_create_modal", metadata.get_fsid())
											}),
										)

										return () => [
											BsPlus() as TMaokaElement,
											Maoka.create("div", () => () => "New"), // TODO: i18n
										]
									})
							}),
						]
					}),
				]
			})
		}
	})

const cell_class = `break-all border-r last-of-type:border-r-0 last-of-type:border-l ${BORDER_COLOR_CLASS} px-2 py-1 cursor-text`

const Cell = (value: TMaokaChildren, on_click?: (event: MouseEvent) => void) =>
	Maoka.create("td", ({ use }) => {
		use(MaokaJabs.set_class(cell_class))
		if (on_click) use(MaokaJabs.listen("onclick", on_click))

		return () => value
	})

const FileNameCell = (metadata: Ordo.Metadata.Instance) =>
	Maoka.create("td", ({ use }) => {
		const { emit } = use(MaokaOrdo.Jabs.Commands)

		const handle_context_menu = (event: MouseEvent) =>
			emit("cmd.application.context_menu.show", { event, payload: metadata })

		use(MaokaJabs.set_class(cell_class, "font-semibold"))
		use(MaokaJabs.listen("oncontextmenu", handle_context_menu))

		return () =>
			Maoka.create("div", ({ use }) => {
				const fsid = metadata.get_fsid()
				const name = metadata.get_name()

				use(MaokaJabs.set_class("flex gap-x-1 items-center"))

				return () => [
					MetadataIcon({ metadata }),

					Maoka.create("div", ({ use, element }) => {
						const { emit } = use(MaokaOrdo.Jabs.Commands)
						const keydown_listener = MaokaJabs.listen("onkeydown", event => {
							if (event.key !== "Enter" && event.key !== "Escape") return

							event.preventDefault()
							if (element instanceof HTMLElement) element.blur()
						})

						const blur_listener = MaokaJabs.listen("onblur", event => {
							R.FromNullable(event.target as unknown as HTMLDivElement)
								.pipe(R.ops.map(e => e.innerText))
								.pipe(R.ops.chain(new_name => R.If(name !== new_name, { T: () => new_name })))
								.cata(R.catas.if_ok(new_name => emit("cmd.metadata.rename", { fsid, new_name })))
						})

						use(MaokaJabs.set_attribute("contenteditable", "true"))
						use(MaokaJabs.set_class("w-full outline-none"))
						use(keydown_listener)
						use(blur_listener)

						return () => Link({ href: `/editor/${metadata.get_fsid()}`, children: name })
					}),
				]
			})
	})
