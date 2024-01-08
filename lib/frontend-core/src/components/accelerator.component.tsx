// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { AiOutlineEnter } from "react-icons/ai"
import { BsBackspace } from "react-icons/bs"
import { Switch } from "@ordo-pink/switch"
import { PropsWithChildren } from "react"

/**
 * Accelerator is a component that renders a hotkey definition with minor visual improvements like
 * using Mac vs other OS symbols, `⇧` for shift, etc.
 */
type P = { accelerator: string; inline?: boolean }
export const Accelerator = ({ accelerator, inline }: P) => {
	const hotkeys = accelerator.split("||")

	return Switch.of(inline)
		.case(true, () => (
			<InlineWrapper>
				{hotkeys.map(accelerator => (
					<Hotkey key={accelerator} accelerator={accelerator} />
				))}
			</InlineWrapper>
		))
		.default(() => (
			<BlockWrapper>
				{hotkeys.map(accelerator => (
					<Hotkey key={accelerator} accelerator={accelerator} />
				))}
			</BlockWrapper>
		))
}

const BlockWrapper = ({ children }: PropsWithChildren) => (
	<div className="flex space-x-2">{children}</div>
)

const InlineWrapper = ({ children }: PropsWithChildren) => (
	<span className="inline-flex space-x-2">{children}</span>
)

const Hotkey = ({ accelerator }: P) => {
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

// Define helper functions
const isDarwin = navigator.appVersion.indexOf("Mac") !== -1

/**
 * Key renderer.
 */
type KeyP = { symbol: string }
const Key = ({ symbol }: KeyP) =>
	Switch.of(symbol)
		.case("backspace", () => <BackspaceKey />)
		.case("enter", () => <EnterKey />)
		.case("escape", () => <EscKey />)
		.default(() => <LetterKey symbol={symbol} />)

/**
 * Escape key renderer.
 */
const EscKey = () => <span>Esc</span>

/**
 * Backspace key renderer.
 */
const BackspaceKey = () => <BsBackspace />

/**
 * Enter key renderer.
 */
const EnterKey = () => <AiOutlineEnter />

/**
 * Any other key renderer.
 */
const LetterKey = ({ symbol }: KeyP) => <span>{symbol.toLocaleUpperCase()}</span>
