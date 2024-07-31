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

	commands.emit("cmd.application.add_translations", {
		lang: "ru",
		prefix: "common",
		translations: RU_TRANSLATIONS,
	})

	logger.debug("🟢 Registerred common translations.")
}

const EN_TRANSLATIONS: Record<keyof t.common, string> = {
	email: "Email",
	handle: "Handle",
	password: "Password",
	privacy_policy: "Privacy Policy",
	repeat_password: "Repeat Password",
	twitter_url: "https://x.com/ordo_pink",
	messenger_support_url: "https://t.me/ordo_pink",
	email_support: "support@ordo.pink",
	license: "License",
	contact_us: "Contact Us",
	command_palette_search_placeholder: "Search...",
	command_palette_hide: "Hide Command Palette",
	command_palette_press_to_exit: "to exit",
	sidebar_toggle: "Toggle Sidebar",
	sidebar_hide: "Hide Sidebar",
	sidebar_show: "Show Sidebar",
}

const RU_TRANSLATIONS: Record<keyof t.common, string> = {
	email: "Email",
	handle: "Имя пользователя",
	password: "Пароль",
	privacy_policy: "Политика конфиденциальности",
	repeat_password: "И ещё раз пароль",
	twitter_url: "https://x.com/ordo_pink",
	messenger_support_url: "https://t.me/ordo_pink_ru",
	email_support: "support@ordo.pink",
	license: "Лицензия",
	contact_us: "Написать нам",
	command_palette_search_placeholder: "Поиск...",
	command_palette_hide: "Скрыть панель команд",
	command_palette_press_to_exit: "для завершения",
	sidebar_toggle: "Показать/скрыть боковую панель",
	sidebar_hide: "Скрыть боковую панель",
	sidebar_show: "Показать боковую панель",
}
