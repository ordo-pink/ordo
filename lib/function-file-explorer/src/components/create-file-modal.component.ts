import { Maoka, type TMaokaChildren } from "@ordo-pink/maoka"
import { MaokaOrdo, ordo_context } from "@ordo-pink/maoka-ordo-hooks"
import { BS_FILE_EARMARK_PLUS } from "@ordo-pink/frontend-icons"
import { BsFileEarmarkPlus } from "@ordo-pink/frontend-icons"
import { MaokaHooks } from "@ordo-pink/maoka-hooks"
import { Result } from "@ordo-pink/result"
import { Switch } from "@ordo-pink/switch"

export const CreateFileModal = (
	ctx: Ordo.CreateFunction.Params,
	parent: Ordo.Metadata.FSID | null = null,
) =>
	Maoka.create("div", ({ use }) => {
		let type = "text/ordo"

		use(ordo_context.provide(ctx))
		use(MaokaHooks.set_class("p-4 w-96 flex flex-col gap-y-2"))

		const { t } = use(MaokaOrdo.Hooks.translations)
		const commands = use(MaokaOrdo.Hooks.commands)

		const t_title = t("t.file_explorer.modals.create_file.title")
		const state = { name: "" }

		return () => [
			Header([TitleIcon, Title(t_title)]),
			Body([
				CreateFileModalInput(event => void (state.name = (event.target as any).value)),
				FileAssociationSelector((fa, selected_type) => {
					type = selected_type
				}),
			]),
			Footer([
				CancelBtn,
				OkBtn(() => {
					commands.emit("cmd.application.modal.hide")
					commands.emit("cmd.metadata.create", { name: state.name, parent, type })
				}),
			]),
		]
	})

const Header = (children: TMaokaChildren) =>
	Maoka.create("div", ({ use }) => {
		use(MaokaHooks.set_class("flex gap-x-2 items-center"))
		return () => children
	})

const TitleIcon = Maoka.create("div", ({ use }) =>
	use(MaokaHooks.set_inner_html(BS_FILE_EARMARK_PLUS)),
)

const Title = (children: TMaokaChildren) =>
	Maoka.create("h2", ({ use }) => {
		use(MaokaHooks.set_class("text-lg"))
		return () => children
	})

const Body = (children: TMaokaChildren) => Maoka.create("div", () => () => children)

// TODO Extract select
// TODO Add caret showing expanded-contracted status
const FileAssociationSelector = (
	on_select_type: (file_association: Ordo.FileAssociation.Instance, type: string) => void,
) =>
	Maoka.create("div", ({ use, refresh, on_unmount }) => {
		const select_class =
			"relative bg-neutral-200 dark:bg-neutral-600 rounded-md mt-2 cursor-pointer"

		let current_file_association: Ordo.FileAssociation.Instance | null = null
		let current_type_index = 0
		let file_associations: Ordo.FileAssociation.Instance[] = []
		let is_expanded = false

		use(MaokaHooks.set_class(select_class))

		const file_associations$ = use(MaokaOrdo.Hooks.file_associations)

		const handle_item_click = (fa: Ordo.FileAssociation.Instance, type: string) => {
			is_expanded = !is_expanded
			current_file_association = fa
			current_type_index = fa.types.findIndex(t => t.name === type)
			on_select_type(fa, type)
			void refresh()
		}

		const subscription = file_associations$.subscribe(value => {
			file_associations = value
			void refresh()
		})

		const handle_escape_press = (event: KeyboardEvent) => {
			if (is_expanded && event.key === "Escape") {
				event.preventDefault()
				event.stopPropagation()

				is_expanded = false

				void refresh()
			}
		}

		document.addEventListener("keydown", handle_escape_press)

		on_unmount(() => {
			subscription.unsubscribe()
			document.removeEventListener("keydown", handle_escape_press)
		})

		return () => [
			SelectItem(
				current_file_association
					? current_file_association.types[current_type_index]
					: file_associations[0].types[0],
				current_file_association ? current_file_association : file_associations[0],
				handle_item_click,
			),

			is_expanded
				? Maoka.create("div", ({ use }) => {
						use(
							MaokaHooks.set_class(
								"absolute top-0 left-0 right-0 bg-neutral-200 dark:bg-neutral-600 rounded-md",
							),
						)

						return () =>
							file_associations.flatMap(file_association =>
								file_association.types.map(type =>
									SelectItem(type, file_association, handle_item_click, true),
								),
							)
					})
				: void 0,
		]
	})

const SelectItem = (
	type: Ordo.FileAssociation.Type,
	file_association: Ordo.FileAssociation.Instance,
	on_click: (file_association: Ordo.FileAssociation.Instance, type: string) => void,
	is_select_active = false,
) =>
	Maoka.create("div", ({ use }) => {
		use(MaokaHooks.set_class("flex gap-x-4"))
		use(MaokaHooks.listen("onclick", () => on_click(file_association, type.name)))

		const Icon = Switch.OfTrue()
			.case(!!file_association.render_icon, () =>
				Maoka.create("span", ({ element }) =>
					file_association.render_icon!(element as HTMLElement),
				),
			)
			.default(() => BsFileEarmarkPlus())

		return () => [
			Maoka.create("div", ({ use }) => {
				use(
					MaokaHooks.set_class(
						"p-2 rounded-none first-of-type:rounded-t-md last-of-type:rounded-b-md",
					),
				)

				return () => {
					if (is_select_active)
						use(MaokaHooks.add_class("hover:bg-neutral-300 hover:dark:bg-neutral-800"))

					return [
						Maoka.create("div", ({ use }) => {
							use(MaokaHooks.set_class("flex gap-x-1 items-center"))

							return () => [
								Icon,
								Maoka.create("div", ({ use }) => {
									const { t } = use(MaokaOrdo.Hooks.translations)
									return () => t(type.readable_name)
								}),
							]
						}),

						Maoka.create("div", ({ use }) => {
							use(MaokaHooks.set_class("text-xs text-neutral-600 dark:text-neutral-400"))
							const { t } = use(MaokaOrdo.Hooks.translations)
							return () => t(type.description)
						}),
					]
				}
			}),
		]
	})

const CreateFileModalInput = (handle_change: (event: Event) => void) =>
	Maoka.create("label", () => {
		return () => [
			Maoka.create("div", ({ use }) => {
				use(MaokaHooks.set_class("font-bold text-sm"))
				const { t } = use(MaokaOrdo.Hooks.translations)

				return () => t("t.file_explorer.modals.create_file.input_label")
			}),

			Maoka.create("input", ({ use, element }) => {
				const { t } = use(MaokaOrdo.Hooks.translations)

				use(MaokaHooks.listen("oninput", handle_change))
				use(MaokaHooks.set_attribute("autofocus", "autofocus"))
				use(
					MaokaHooks.set_attribute(
						"placeholder",
						t("t.file_explorer.modals.create_file.input_placeholder"),
					),
				)

				use(
					MaokaHooks.set_class(
						"w-full rounded-md border-0 px-2 py-1 shadow-inner focus:ring-0 sm:text-sm sm:leading-6",
						"bg-neutral-50 dark:bg-neutral-600 placeholder:text-neutral-500",
					),
				)

				if (element instanceof HTMLElement) element.focus()
			}),
		]
	})

const Footer = (children: TMaokaChildren) =>
	Maoka.create("div", ({ use }) => {
		use(MaokaHooks.set_class("flex justify-end items-center gap-x-2"))

		return () => children
	})

const OkBtn = (on_click: (event: MouseEvent) => void) =>
	Maoka.create("button", ({ use }) => {
		use(
			MaokaHooks.set_class(
				"bg-emerald-700 shadow-md rounded-md px-4 py-1 text-sm flex items-center space-x-2 hover:shadow-lg hover:scale-110 transition-all duration-300",
			),
		)
		use(MaokaHooks.listen("onclick", on_click))

		return () => [Maoka.create("div", () => () => "OK"), Hotkey("enter")]
	})

const CancelBtn = Maoka.create("button", ({ use }) => {
	const commands = use(MaokaOrdo.Hooks.commands)

	use(MaokaHooks.set_class("px-4 py-1 text-sm flex items-center space-x-2"))
	use(MaokaHooks.listen("onclick", () => commands.emit("cmd.application.modal.hide")))

	return () => [Maoka.create("div", () => () => "Cancel"), Hotkey("escape")]
})

const hotkey_class =
	"hidden shrink-0 rounded-md px-2 py-0.5 items-center justify-center space-x-1 text-xs text-neutral-500 md:flex dark:text-neutral-300"

// TODO Move to hooks
const isDarwin = navigator.appVersion.indexOf("Mac") !== -1

const Hotkey = (accelerator: string) =>
	Maoka.create("div", ({ use, on_unmount, element }) => {
		const split = accelerator.split("+")
		const meta = isDarwin ? "⌥" : "Alt"
		const mod = isDarwin ? "⌘" : "Ctrl"
		const ctrl = "Ctrl"
		const option = "⌥"
		const shift = "⇧"

		const symbol = split[split.length - 1].toLowerCase()

		use(MaokaHooks.set_class(hotkey_class))

		const handle_keydown = (event: KeyboardEvent) => {
			if (IGNORED_KEYS.includes(event.key)) return

			const hotkey = create_hotkey_string(event, false)

			if (hotkey === accelerator) {
				event.preventDefault()
				event.stopPropagation()

				if (element instanceof HTMLElement) element.click()
			}
		}

		document.addEventListener("keydown", handle_keydown)

		on_unmount(() => {
			document.removeEventListener("keydown", handle_keydown)
		})

		return () => [
			Result.If(split.includes("ctrl")).cata(Result.catas.if_ok(() => `${ctrl} +`)),
			Result.If(split.includes("meta")).cata(Result.catas.if_ok(() => `${meta} +`)),
			Result.If(split.includes("option")).cata(Result.catas.if_ok(() => `${option} +`)),
			Result.If(split.includes("mod")).cata(Result.catas.if_ok(() => `${mod} +`)),
			Result.If(split.includes("shift")).cata(Result.catas.if_ok(() => `${shift} +`)),

			Key(symbol),
		]
	})

const IGNORED_KEYS = ["Control", "Shift", "Alt", "Meta"]

const create_hotkey_string = (event: KeyboardEvent, isApple: boolean) => {
	let hotkey = ""

	if (event.altKey) hotkey += "meta+"
	if (event.ctrlKey) hotkey += isApple ? "ctrl+" : "mod+"
	if (event.metaKey) hotkey += "mod+"
	if (event.shiftKey) hotkey += "shift+"

	hotkey += event.key.toLocaleLowerCase()

	return hotkey
}

const Key = (key: string) =>
	Maoka.create(
		"span",
		() => () =>
			Switch.Match(key)
				.case("backspace", () => "⌫")
				.case("enter", () => "⏎")
				.case("escape", () => "Esc")
				.default(() => key.toLocaleUpperCase()),
	)

/*
import { AiOutlineEnter } from "react-icons/ai"
import { BsBackspace } from "react-icons/bs"

import { Switch } from "@ordo-pink/switch"

// --- Public ---

type _P = { accelerator: string; inline?: boolean; className?: string }
export default function Accelerator({ accelerator, inline, className = "" }: _P) {
	const hotkeys = accelerator.split("||")

	return Switch.of(inline)
		.case(true, () => (
			<InlineWrapper>
				{hotkeys.map(accelerator => (
					<Hotkey key={accelerator} accelerator={accelerator} className={className} />
				))}
			</InlineWrapper>
		))
		.default(() => (
			<BlockWrapper>
				{hotkeys.map(accelerator => (
					<Hotkey key={accelerator} accelerator={accelerator} className={className} />
				))}
			</BlockWrapper>
		))
}

// eslint-disable-next-line
const BlockWrapper = ({ children }: any) => <div className="flex space-x-2">{children}</div>

// eslint-disable-next-line
const InlineWrapper = ({ children }: any) => (
	<span className="inline-flex space-x-2">{children}</span>
)

const Hotkey = ({ accelerator, className }: _P) => {
	const split = accelerator.split("+")
	const meta = isDarwin ? "⌥" : "Alt"
	const mod = isDarwin ? "⌘" : "Ctrl"
	const ctrl = "Ctrl"

	const symbol = split[split.length - 1].toLowerCase()

	return (
		<div
			className={`hidden shrink-0 items-center space-x-1 text-xs text-neutral-500 md:flex dark:text-neutral-300 ${className}`}
		>
			{split.includes("ctrl") && <div>{ctrl} +</div>}
			{split.includes("meta") && <div>{meta} +</div>}
			{split.includes("option") && <div>⌥ +</div>}
			{split.includes("mod") && <div>{mod} +</div>}
			{split.includes("shift") && <div>⇧ +</div>}

			<Key symbol={symbol} />
		</div>
	)
}

// --- Internal ---

type KeyProps = { symbol: string }

const isDarwin = navigator.appVersion.indexOf("Mac") !== -1

const Key = ({ symbol }: KeyProps) =>
	Switch.of(symbol)
		.case("backspace", () => <BackspaceKey />)
		.case("enter", () => <EnterKey />)
		.case("escape", () => <EscKey />)
		.default(() => <LetterKey symbol={symbol} />)

const EscKey = () => <span>Esc</span>
const BackspaceKey = () => <BsBackspace />
const EnterKey = () => <AiOutlineEnter />
const LetterKey = ({ symbol }: KeyProps) => <span>{symbol.toLocaleUpperCase()}</span>

*/
