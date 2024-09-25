import { Maoka, type TMaokaChildren } from "@ordo-pink/maoka"
import { get_commands, get_translations, ordo_context } from "@ordo-pink/maoka-ordo-hooks"
import { BS_FILE_EARMARK_PLUS } from "@ordo-pink/frontend-icons"
import { type FSID } from "@ordo-pink/data"
import { Result } from "@ordo-pink/result"
import { Switch } from "@ordo-pink/switch"
import { type TCreateFunctionContext } from "@ordo-pink/core"

export const CreateFileModal = (ctx: TCreateFunctionContext, parent: FSID | null = null) =>
	Maoka.create("div", ({ use }) => {
		use(ordo_context.provide(ctx))
		use(Maoka.hooks.set_class("p-4 w-96 flex flex-col gap-y-2"))

		const { t } = use(get_translations)
		const commands = use(get_commands)

		// TODO: Drop requirement for author_id when creating a file
		const author_id = "asdf-adsf-asdf-asdf-asdf"

		const t_title = t("t.file_explorer.modals.create_file.title")
		const state = { name: "" }

		return () => [
			Header([TitleIcon, Title(t_title)]),
			Body([CreateFileModalInput(event => void (state.name = (event.target as any).value))]),
			Footer([
				CancelBtn,
				OkBtn(() => {
					commands.emit("cmd.application.modal.hide")
					commands.emit("cmd.data.metadata.create", { name: state.name, author_id, parent })
				}),
			]),
		]
	})

const Header = (children: TMaokaChildren) =>
	Maoka.create("div", ({ use }) => {
		use(Maoka.hooks.set_class("flex gap-x-2 items-center"))
		return () => children
	})

const TitleIcon = Maoka.create("div", ({ use }) =>
	use(Maoka.hooks.set_inner_html(BS_FILE_EARMARK_PLUS)),
)

const Title = (children: TMaokaChildren) =>
	Maoka.create("h2", ({ use }) => {
		use(Maoka.hooks.set_class("text-lg"))
		return () => children
	})

const Body = (children: TMaokaChildren) => Maoka.create("div", () => () => children)

const CreateFileModalInput = (handle_change: (event: Event) => void) =>
	Maoka.create("label", () => {
		return () => [
			Maoka.create("div", ({ use }) => {
				use(Maoka.hooks.set_class("font-bold text-sm"))
				const { t } = use(get_translations)

				return () => t("t.file_explorer.modals.create_file.input_label")
			}),
			Maoka.create("input", ({ use, current_element }) => {
				const { t } = use(get_translations)

				use(Maoka.hooks.listen("oninput", handle_change))
				use(Maoka.hooks.set_attribute("autofocus", "autofocus"))
				use(
					Maoka.hooks.set_attribute(
						"placeholder",
						t("t.file_explorer.modals.create_file.input_placeholder"),
					),
				)

				use(
					Maoka.hooks.set_class(
						"w-full rounded-md border-0 px-2 py-1 shadow-inner focus:ring-0 sm:text-sm sm:leading-6",
						"bg-neutral-50 dark:bg-neutral-600 placeholder:text-neutral-500",
					),
				)

				current_element.focus()

				return () => {
					current_element.focus()
				}
			}),
		]
	})

const Footer = (children: TMaokaChildren) =>
	Maoka.create("div", ({ use }) => {
		use(Maoka.hooks.set_class("flex justify-end items-center gap-x-2"))

		return () => children
	})

const OkBtn = (on_click: (event: MouseEvent) => void) =>
	Maoka.create("button", ({ use }) => {
		use(
			Maoka.hooks.set_class(
				"bg-emerald-700 shadow-md rounded-md px-4 py-1 text-sm flex items-center space-x-2 hover:shadow-lg hover:scale-110 transition-all duration-300",
			),
		)
		use(Maoka.hooks.listen("onclick", on_click))

		return () => [Maoka.create("div", () => () => "OK"), Hotkey("enter")]
	})

const CancelBtn = Maoka.create("button", ({ use }) => {
	const commands = use(get_commands)

	use(Maoka.hooks.set_class("px-4 py-1 text-sm flex items-center space-x-2"))
	use(Maoka.hooks.listen("onclick", () => commands.emit("cmd.application.modal.hide")))

	return () => [Maoka.create("div", () => () => "Cancel"), Hotkey("escape")]
})

const hotkey_class =
	"hidden shrink-0 rounded-md px-2 py-0.5 items-center justify-center space-x-1 text-xs text-neutral-500 md:flex dark:text-neutral-300"

// TODO Move to hooks
const isDarwin = navigator.appVersion.indexOf("Mac") !== -1

const Hotkey = (accelerator: string) =>
	Maoka.create("div", ({ use, on_unmount, current_element }) => {
		const split = accelerator.split("+")
		const meta = isDarwin ? "⌥" : "Alt"
		const mod = isDarwin ? "⌘" : "Ctrl"
		const ctrl = "Ctrl"
		const option = "⌥"
		const shift = "⇧"

		const symbol = split[split.length - 1].toLowerCase()

		use(Maoka.hooks.set_class(hotkey_class))

		const handle_keydown = (event: KeyboardEvent) => {
			if (IGNORED_KEYS.includes(event.key)) return

			const hotkey = create_hotkey_string(event, false)

			if (hotkey === accelerator) {
				event.preventDefault()
				event.stopPropagation()

				current_element.click()
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
