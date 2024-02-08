// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

// TODO: Move extension state to /var/${extension}
export const EXTENSION_FILE_PREFIX = ".ext_"

export const ORDO_PINK_APP_FUNCTION = "pink.ordo.app"

export const ORDO_PINK_USER_FUNCTION = "pink.ordo.user"
export const ORDO_PINK_FILE_EXPLORER_FUNCTION = "pink.ordo.file-explorer"
// export const ORDO_PINK_LINKS_FUNCTION = "pink.ordo.links"
// export const ORDO_PINK_HOME_FUNCTION = "pink.ordo.home"
// export const ORDO_PINK_EDITOR_FUNCTION = "pink.ordo.editor"
// export const ORDO_PINK_GTD_FUNCTION = "pink.ordo.gtd"
// export const ORDO_PINK_MEDIA_FUNCTION = "pink.ordo.media"
// export const ORDO_PINK_BOARDS_FUNCTION = "pink.ordo.boards"
// export const ORDO_PINK_DATABASES_FUNCTION = "pink.ordo.databases"
// export const ORDO_PINK_DEV_TOOLS_FUNCTION = "pink.ordo.dev-tools"
// export const ORDO_PINK_CALENDAR_FUNCTION = "pink.ordo.calendar"

export const internalApps = [
	ORDO_PINK_APP_FUNCTION,
	ORDO_PINK_USER_FUNCTION,
	ORDO_PINK_FILE_EXPLORER_FUNCTION,
]

export const enum BackgroundTaskStatus {
	NONE,
	SAVING,
	LOADING,
}
