import { CurrentUserReference, Link, MetadataIcon } from "@ordo-pink/maoka-components"
import { Maoka, type TMaokaChildren } from "@ordo-pink/maoka"
import { Metadata, type TMetadata } from "@ordo-pink/data"
import { BsPlus } from "@ordo-pink/frontend-icons"
import { O } from "@ordo-pink/option"
import { OrdoHooks } from "@ordo-pink/maoka-ordo-hooks"
import { R } from "@ordo-pink/result"

// TODO: Avoid unnecessary rerenders by narrowing down hooks

const BORDER_COLOR_CLASS = "border-neutral-300 dark:border-neutral-700"

export const Database = Maoka.create("div", ({ use, refresh }) => {
	let metadata: TMetadata | null = null
	let descendents: TMetadata[] = []

	const params = use(OrdoHooks.route_params)
	const metadata_query = use(OrdoHooks.metadata_query)

	use(Maoka.hooks.set_class("p-4"))

	return () => {
		return Maoka.create("table", ({ use }) => {
			const handle_metadata_query_sub = () => {
				if (!params.value.fsid || !Metadata.Validations.is_fsid(params.value.fsid)) return

				const metadata_option = metadata_query
					.get_by_fsid(params.value.fsid)
					.cata(R.catas.or_else(() => O.None()))
				const new_metadata = metadata_option.unwrap() ?? null

				let should_refresh = false

				if (!metadata || (metadata && !metadata.equals(new_metadata!))) {
					metadata = new_metadata
					should_refresh = true
				}

				if (metadata) {
					const metadata_descendents = metadata_query
						.get_descendents(metadata.get_fsid())
						.cata(R.catas.or_else(() => []))

					if (descendents.length !== metadata_descendents.length) {
						descendents = metadata_descendents
						should_refresh = true
					}
				}

				should_refresh && refresh()
			}

			use(OrdoHooks.subscription(metadata_query.$, handle_metadata_query_sub))
			use(Maoka.hooks.set_class(`w-full table-auto border-t ${BORDER_COLOR_CLASS}`))

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
							use(Maoka.hooks.set_class("text-left"))

							return () =>
								keys.map(key =>
									Maoka.create("th", ({ use }) => {
										use(
											Maoka.hooks.set_class(
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
								use(Maoka.hooks.set_class(`border-y ${BORDER_COLOR_CLASS}`))

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
							const { emit } = use(OrdoHooks.commands)
							use(Maoka.hooks.set_class(`border-y ${BORDER_COLOR_CLASS}`))

							return () =>
								Maoka.create("td", ({ use }) => {
									use(
										Maoka.hooks.set_class(
											"px-2 py-1 text-neutral-500 text-sm flex items-center gap-x-1 cursor-pointer",
										),
									)

									use(
										Maoka.hooks.listen("onclick", () => {
											if (!Metadata.Validations.is_fsid(params.value.fsid)) return
											emit("cmd.data.metadata.show_create_modal", params.value.fsid)
										}),
									)

									return () => [
										BsPlus(),
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
		use(Maoka.hooks.set_class(cell_class))
		if (on_click) use(Maoka.hooks.listen("onclick", on_click))

		return () => value
	})

const FileNameCell = (metadata: TMetadata) =>
	Maoka.create("td", ({ use }) => {
		const { emit } = use(OrdoHooks.commands)

		use(Maoka.hooks.set_class(cell_class, "font-semibold"))
		use(
			Maoka.hooks.listen("oncontextmenu", event =>
				emit("cmd.application.context_menu.show", {
					event: event as any,
					payload: metadata,
				}),
			),
		)

		return () =>
			Maoka.create("div", ({ use }) => {
				const fsid = metadata.get_fsid()
				const name = metadata.get_name()

				use(Maoka.hooks.set_class("flex gap-x-1 items-center"))

				return () => [
					MetadataIcon({ metadata }),

					Maoka.create("div", ({ use, current_element }) => {
						const { emit } = use(OrdoHooks.commands)
						const keydown_listener = Maoka.hooks.listen("onkeydown", event => {
							if (event.key !== "Enter" && event.key !== "Escape") return

							event.preventDefault()
							current_element.blur()
						})

						const blur_listener = Maoka.hooks.listen("onblur", event => {
							R.FromNullable(event.target as unknown as HTMLDivElement)
								.pipe(R.ops.map(e => e.innerText))
								.pipe(R.ops.chain(new_name => R.If(name !== new_name, { T: () => new_name })))
								.cata(
									R.catas.if_ok(new_name => emit("cmd.data.metadata.rename", { fsid, new_name })),
								)
						})

						use(Maoka.hooks.set_attribute("contenteditable", "true"))
						use(Maoka.hooks.set_class("w-full outline-none"))
						use(keydown_listener)
						use(blur_listener)

						return () => Link({ href: `/editor/${metadata.get_fsid()}`, children: name })
					}),
				]
			})
	})
