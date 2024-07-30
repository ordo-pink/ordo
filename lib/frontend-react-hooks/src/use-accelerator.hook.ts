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

import { HotkeyCallback, useHotkeys } from "react-hotkeys-hook" // TODO: Make custom

import { O } from "@ordo-pink/option"

import { use$ } from ".."

type UseAccelerator = (
	accelerator: string | undefined,
	callback: HotkeyCallback,
	deps?: unknown[],
) => void

/**
 * Registers provided keyboard accelerator that is compatible with the Ordo notation.
 *
 * @type {UseAccelerator}
 *
 * TODO: Add support for multiple accelerators
 * TODO: Provide at_see link to accelerators description
 */
export const useAccelerator: UseAccelerator = (accelerator, callback, deps) => {
	const is_darwin = use$.is_apple()
	const hotkeys = O.FromNullable(accelerator).cata({
		None: () => [],
		Some: renameToAppleOrNormalModifierKeys(is_darwin),
	})

	useHotkeys(
		hotkeys,
		callback,
		{ enableOnFormTags: true, enableOnContentEditable: true, preventDefault: true },
		deps,
	)
}

// --- Internal ---

const renameToAppleOrNormalModifierKeys = (is_darwin: boolean) => (accelerator: string) => {
	const keys: string[] = accelerator.split("+")
	const newKeys: string[] = []

	if (keys.includes("mod")) newKeys.push(is_darwin ? "cmd" : "ctrl")
	if (keys.includes("meta")) newKeys.push(is_darwin ? "option" : "alt")
	if (keys.includes("ctrl") && is_darwin) newKeys.push("ctrl")
	if (keys.includes("shift")) newKeys.push("shift")

	newKeys.push(keys.at(-1)!)

	return newKeys.join("+")
}
