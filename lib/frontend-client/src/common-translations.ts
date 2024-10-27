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

import { TLogger } from "@ordo-pink/logger"

export const register_common_translations = (logger: TLogger, commands: Ordo.Command.Commands) => {
	logger.debug("🟡 Registerring common translations...")

	commands.emit("cmd.application.add_translations", {
		lang: "en",
		translations: {
			"t.common.components.command_palette.exit_key_hint": "to exit",
			"t.common.components.command_palette.hide": "Hide Command Palette",
			"t.common.components.command_palette.search_placeholder": "Search...",
			"t.common.components.command_palette.toggle": "Toggle Command Palette",
			"t.common.components.command_palette.toggle_description":
				"Shows or hides Command Palette depending on its current state.",
			"t.common.components.sidebar.hide": "Hide Sidebar",
			"t.common.components.sidebar.show": "Show Sidebar",
			"t.common.components.sidebar.toggle": "Toggle Sidebar",
			"t.common.urls.contact_us": "Contact Us",
			"t.common.urls.support_email": "support@ordo.pink",
			"t.common.urls.support_messenger": "https://t.me/ordo_pink",
			"t.common.urls.twitter_x": "https://x.com/ordo_pink",
			"t.common.state.loading": "Loading...",
		},
	})

	logger.debug("🟢 Registerred common translations.")
}
