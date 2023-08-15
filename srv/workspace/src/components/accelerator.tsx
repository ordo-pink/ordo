import { AiOutlineEnter } from "react-icons/ai"
import { BsBackspace } from "react-icons/bs"
import { Switch } from "#lib/switch/mod"

// TODO: Add support for comma-separated accelerators

// --- Public ---

type _P = { accelerator: string }
export default function Accelerator({ accelerator }: _P) {
	const hotkeys = accelerator.split("||")

	return (
		<div className="flex space-x-2">
			{hotkeys.map(accelerator => (
				<Hotkey key={accelerator} accelerator={accelerator} />
			))}
		</div>
	)
}

const Hotkey = ({ accelerator }: _P) => {
	const split = accelerator.split("+")
	const meta = isDarwin ? "⌥" : "Alt"
	const mod = isDarwin ? "⌘" : "Ctrl"
	const ctrl = "Ctrl"

	const symbol = split[split.length - 1].toLowerCase()

	return (
		<div className="hidden md:flex shrink-0 items-center space-x-1 text-neutral-500 dark:text-neutral-300 text-xs">
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
