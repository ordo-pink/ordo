import { AiOutlineEnter } from "react-icons/ai"
import { BsBackspace } from "react-icons/bs"
import { Switch } from "#lib/switch/mod"

type Props = { accelerator: string }

const Esc = () => <span>Esc</span>
const Backspace = () => <BsBackspace />
const Enter = () => <AiOutlineEnter />
const Letter = ({ symbol }: { symbol: string }) => <span>{symbol.toLocaleUpperCase()}</span>

export const Accelerator = ({ accelerator }: Props) => {
	const isDarwin = navigator.appVersion.indexOf("Mac") !== -1

	const split = accelerator.split("+")
	const alt = isDarwin ? "⌥" : "Alt"
	const ctrl = isDarwin ? "⌘" : "Ctrl"

	const symbol = split[split.length - 1].toLowerCase()

	const Key = Switch.of(symbol)
		.case("backspace", () => Backspace)
		.case("enter", () => Enter)
		.case("escape", () => Esc)
		.default(() => Letter)

	return (
		<div className="hidden md:flex shrink-0 items-center space-x-1 text-neutral-500 dark:text-neutral-300 text-xs">
			{split.includes("alt") && <div className="">{alt} +</div>}
			{split.includes("option") && <div className="">⌥ +</div>}
			{split.includes("ctrl") && <div className="">{ctrl} +</div>}
			{split.includes("shift") && <div className="">⇧ +</div>}

			<Key symbol={symbol} />
		</div>
	)
}
