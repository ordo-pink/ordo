import { BsCaretRight, BsPlus } from "@ordo-pink/frontend-icons"
import { Link, MetadataIcon } from "@ordo-pink/maoka-components"
import { Maoka, type TChildren } from "@ordo-pink/maoka"
import { Metadata, type TMetadata } from "@ordo-pink/data"
import { OrdoHooks } from "@ordo-pink/maoka-ordo-hooks"
import { R } from "@ordo-pink/result"

const BORDER_COLOR_CLASS = "border-neutral-300 dark:border-neutral-700"

export const Database = Maoka.create("div", ({ use }) => {
	const { fsid } = use(OrdoHooks.route_params<"fsid">)
	use(Maoka.hooks.set_class("p-4"))

	if (!fsid || !Metadata.Validations.is_fsid(fsid)) return "TODO: Empty Editor"

	const metadata_query = use(OrdoHooks.metadata_query)
	const metadata_result = metadata_query
		.get_by_fsid(fsid)
		.pipe(R.ops.chain(option => R.If(option.is_some, { T: () => option.unwrap()! })))

	const descendents_result = metadata_result
		.pipe(R.ops.chain(metadata => metadata_query.get_descendents(metadata.get_fsid())))
		.cata(R.catas.or_else(() => [] as TMetadata[]))

	return metadata_result.cata(
		R.catas.if_ok(() =>
			Maoka.create("table", ({ use }) => {
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

				return [
					Maoka.create("thead", () => {
						return Maoka.create("tr", ({ use }) => {
							use(Maoka.hooks.set_class("text-left"))

							return keys.map(key =>
								Maoka.create("th", ({ use }) => {
									use(
										Maoka.hooks.set_class(
											`border-r text-sm last-of-type:border-r-0 last-of-type:border-l ${BORDER_COLOR_CLASS} px-2 py-1 font-normal text-neutral-500`,
										),
									)
									return key
								}),
							)
						})
					}),

					Maoka.create("tbody", () => {
						return [
							...descendents_result.map(child =>
								Maoka.create("tr", ({ use }) => {
									use(Maoka.hooks.set_class(`border-y ${BORDER_COLOR_CLASS}`))

									return [
										FileNameCell(child),
										Cell(child.get_created_at().toLocaleDateString()),
										// Cell(UserReference(child.get_created_by())),
										Cell(UserReference()),
										Cell(child.get_updated_at().toLocaleDateString()),
										// Cell(UserReference(child.get_updated_by())),
										Cell(UserReference()),
										Cell(child.get_labels().join(", ")),
										// Cell(child.get_links().join(", ")),
										// Cell(child.get_readable_size()),
									]
								}),
							),

							Maoka.create("tr", ({ use }) => {
								const { emit } = use(OrdoHooks.commands)
								use(Maoka.hooks.set_class(`border-y ${BORDER_COLOR_CLASS}`))

								return Maoka.create("td", ({ use }) => {
									use(
										Maoka.hooks.set_class(
											"px-2 py-1 text-neutral-500 text-sm flex items-center gap-x-1 cursor-pointer",
										),
									)

									use(
										Maoka.hooks.listen("onclick", () =>
											emit("cmd.data.metadata.show_create_modal", fsid),
										),
									)

									return [
										BsPlus(),
										Maoka.create("div", () => "New"), // TODO: i18n
									]
								})
							}),
						]
					}),
				]
			}),
		),
	)
})

const cell_class = `break-all border-r last-of-type:border-r-0 last-of-type:border-l ${BORDER_COLOR_CLASS} px-2 py-1 cursor-text`

const Cell = (value: TChildren, on_click?: (event: MouseEvent) => void) =>
	Maoka.create("td", ({ use }) => {
		use(Maoka.hooks.set_class(cell_class))
		if (on_click) use(Maoka.hooks.listen("onclick", on_click))

		return value
	})

const FileNameCell = (metadata: TMetadata) =>
	Maoka.create("td", ({ use }) => {
		const { emit } = use(OrdoHooks.commands)

		use(Maoka.hooks.set_class(cell_class))
		use(
			Maoka.hooks.listen("oncontextmenu", event =>
				emit("cmd.application.context_menu.show", {
					event: event as any,
					payload: metadata,
				}),
			),
		)

		return Maoka.create("div", ({ use, get_current_element }) => {
			const fsid = metadata.get_fsid()
			const name = metadata.get_name()
			const { emit } = use(OrdoHooks.commands)

			use(Maoka.hooks.set_attribute("contenteditable", "true"))
			use(Maoka.hooks.set_class("flex gap-x-1 items-center outline-none"))
			use(
				Maoka.hooks.listen("onkeydown", event => {
					if (event.key !== "Enter") return
					const element = get_current_element()
					element.blur()
				}),
			)

			use(
				Maoka.hooks.listen("onblur", event => {
					R.FromNullable(event.target as unknown as HTMLDivElement)
						.pipe(R.ops.chain(e => R.FromNullable(e.children.item(1) as HTMLAnchorElement)))
						.pipe(R.ops.map(e => e.innerText))
						.pipe(R.ops.chain(new_name => R.If(name !== new_name, { T: () => new_name })))
						.cata(R.catas.if_ok(new_name => emit("cmd.data.metadata.rename", { fsid, new_name })))
				}),
			)

			return [
				MetadataIcon({ metadata }),
				Link({
					href: `/editor/${metadata.get_fsid()}`,
					children: name,
					custom_class: "text-inherit visited:text-inherit",
				}),
			]
		})
	})

// TODO: Get actual user
// TODO: Lead to user page
// const UserReference = (id: string) =>
const UserReference = () =>
	Maoka.create("div", ({ use }) => {
		use(Maoka.hooks.set_class("flex gap-x-2 items-center"))

		const user_query = use(OrdoHooks.user_query)
		const UserNameComponent = user_query
			.get_current()
			.pipe(R.ops.map(user => UserName(user)))
			.cata(R.catas.or_nothing())

		return [UserAvatar, UserNameComponent]
	})

const UserName = (user: User.User) =>
	Maoka.create("div", ({ use }) => {
		use(Maoka.hooks.set_class("underline cursor-pointer"))

		return user.handle.slice(1) // TODO: Use readable name
	})

const user_avatar_class = [
	"flex shrink-0 cursor-pointer items-center justify-center rounded-full p-0.5 shadow-lg",
	"bg-gradient-to-tr from-sky-400 via-purple-400 to-rose-400",
]

const UserAvatar = Maoka.create("div", ({ use }) => {
	use(Maoka.hooks.set_class(...user_avatar_class))

	return Maoka.create("div", ({ use }) => {
		use(Maoka.hooks.set_class("rounded-full bg-neutral-500"))

		return Maoka.create("div", ({ use }) => {
			use(Maoka.hooks.set_class("size-3 rounded-full text-xs"))

			// TODO: User icon
			return BsCaretRight("size-3 white")
		})
	})
})
