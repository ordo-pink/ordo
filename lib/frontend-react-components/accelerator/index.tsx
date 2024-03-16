// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

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
