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

export const register_common_translations = (
	logger: TLogger,
	commands: Client.Commands.Commands,
) => {
	logger.debug("🟡 Registerring common translations...")

	commands.emit("cmd.application.add_translations", {
		lang: "en",
		prefix: "common",
		translations: EN_TRANSLATIONS,
	})

	logger.debug("🟢 Registerred common translations.")
}

const EN_TRANSLATIONS: TScopedTranslations<"common"> = {
	"components.command_palette.exit_key_hint": "to exit",
	"components.command_palette.hide": "Hide Command Palette",
	"components.command_palette.search_placeholder": "Search...",
	"components.command_palette.toggle": "Toggle Command Palette",
	"components.sidebar.hide": "Hide Sidebar",
	"components.sidebar.show": "Show Sidebar",
	"components.sidebar.toggle": "Toggle Sidebar",
	"urls.contact_us": "Contact Us",
	"urls.support_email": "support@ordo.pink",
	"urls.support_messenger": "https://t.me/ordo_pink",
	"urls.twitter_x": "https://x.com/ordo_pink",
	"state.loading": "Loading...",
}
