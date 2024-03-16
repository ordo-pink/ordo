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

import { HotkeyCallback, useHotkeys } from "react-hotkeys-hook"
import { Either } from "@ordo-pink/either"

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
 * @todo Add support for multiple accelerators
 * @todo Provide at_see link to accelerators description
 */
export const useAccelerator: UseAccelerator = (accelerator, callback, deps) => {
	const hotkeys = Either.fromNullable(accelerator).fold(() => [], renameToAppleOrNormalModifierKeys)

	useHotkeys(
		hotkeys,
		callback,
		{ enableOnFormTags: true, enableOnContentEditable: true, preventDefault: true },
		deps,
	)
}

// --- Internal ---

const isDarwin: boolean = navigator.appVersion.indexOf("Mac") !== -1

type RenameToAppleOrNormalModifierKeys = (accelerator: string) => string
const renameToAppleOrNormalModifierKeys: RenameToAppleOrNormalModifierKeys = accelerator => {
	const keys: string[] = accelerator.split("+")
	const newKeys: string[] = []

	if (keys.includes("mod")) newKeys.push(isDarwin ? "cmd" : "ctrl")
	if (keys.includes("meta")) newKeys.push(isDarwin ? "option" : "alt")
	if (keys.includes("ctrl") && isDarwin) newKeys.push("ctrl")
	if (keys.includes("shift")) newKeys.push("shift")

	newKeys.push(keys.at(-1)!)

	return newKeys.join("+")
}
