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

// TODO: Remove
export const EXTENSION_FILE_PREFIX = ".ext_"

export const OK = "OK" as const

export const ACTIVITY_BAR_WIDTH = 48
export const SIDEBAR_WORKSPACE_GUTTER_WIDTH = 10

export const LIB_DIRECTORY_FSID = "1de21bf3-2277-4d3a-bbd3-d120eb8a49d0"

export const ORDO_PINK_APP_FUNCTION = "pink.ordo.app"

export const ORDO_PINK_USER_FUNCTION = "pink.ordo.user"
export const ORDO_PINK_ACHIEVEMENTS_FUNCTION = "pink.ordo.achievements"
export const ORDO_PINK_FILE_EXPLORER_FUNCTION = "pink.ordo.file-explorer"
export const ORDO_PINK_LINKS_FUNCTION = "pink.ordo.links"
export const ORDO_PINK_HOME_FUNCTION = "pink.ordo.home"
export const ORDO_PINK_EDITOR_FUNCTION = "pink.ordo.editor"
export const ORDO_PINK_GTD_FUNCTION = "pink.ordo.gtd"
export const ORDO_PINK_EXCALIDRAW_FUNCTION = "pink.ordo.excalidraw"
// export const ORDO_PINK_MEDIA_FUNCTION = "pink.ordo.media"
// export const ORDO_PINK_BOARDS_FUNCTION = "pink.ordo.boards"
// export const ORDO_PINK_DATABASES_FUNCTION = "pink.ordo.databases"
// export const ORDO_PINK_DEV_TOOLS_FUNCTION = "pink.ordo.dev-tools"
// export const ORDO_PINK_CALENDAR_FUNCTION = "pink.ordo.calendar"

export const internalApps = [
	ORDO_PINK_APP_FUNCTION,
	ORDO_PINK_USER_FUNCTION,
	ORDO_PINK_FILE_EXPLORER_FUNCTION,
	ORDO_PINK_LINKS_FUNCTION,
	ORDO_PINK_HOME_FUNCTION,
	ORDO_PINK_EDITOR_FUNCTION,
	ORDO_PINK_GTD_FUNCTION,
	ORDO_PINK_ACHIEVEMENTS_FUNCTION,
	ORDO_PINK_EXCALIDRAW_FUNCTION,
]

export const enum BackgroundTaskStatus {
	NONE,
	SAVING,
	LOADING,
}
