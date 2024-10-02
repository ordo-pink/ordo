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

export const OK = "OK" as const

export const LIB_DIRECTORY_FSID = "1de21bf3-2277-4d3a-bbd3-d120eb8a49d0"

export const ACTIVITY_BAR_WIDTH = 48
export const SIDEBAR_WORKSPACE_GUTTER_WIDTH = 10

export const enum BackgroundTaskStatus {
	NONE,
	SAVING,
	LOADING,
	length,
}

export enum AchievementCategory {
	EDUCATION,
	COLLECTION,
	CHALLENGE,
	LEGACY,
	length,
}

export enum UserSubscription {
	FREE,
	PERSONAL,
	TEAM,
	ENTERPRISE,
	CUSTOM,
	length,
}

export enum NotificationType {
	DEFAULT,
	SUCCESS,
	INFO,
	WARN,
	QUESTION,
	RRR,
	length,
}

/**
 * Context menu item type. This impacts two things:
 *
 * 1. Grouping items in the context menu.
 * 2. Given type can be hidden when showing context menu.
 */
export enum ContextMenuItemType {
	CREATE,
	READ,
	UPDATE,
	DELETE,
	length,
}

export enum ErrorType {
	EPERM = 1, // Permission denied
	ENOENT, // Not found
	EINTR, // Interrupted
	EIO, // I/O error
	ENXIO, // Invalid address
	EAGAIN, // Loading
	EACCES, // Access denied
	EEXIST, // Already exists
	EINVAL, // Invalid
	EMFILE, // Too many open files
	EFBIG, // File too big
	ENOSPC, // Out of memory
	length,
}
