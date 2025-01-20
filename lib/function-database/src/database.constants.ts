/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2024  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

export enum SortingDirection {
	ASC,
	DESC,
}

export enum ColumnType {
	METADATA_NAME,
	METADATA_FSID,
	METADATA_LABELS,
	METADATA_CREATED_AT,
	METADATA_CREATED_BY,
	METADATA_UPDATED_AT,
	METADATA_UPDATED_BY,
	METADATA_LINKS,
	METADATA_SIZE,
	METADATA_PARENT,
	METADATA_TYPE,
	CHECKBOX,
	NUMBER,
	TEXT,
	DATE,
	USER,
	LINK,
	SELECT,
	MULTISELECT,
}

export const DATABASE_CONTEXT_MENU_PAYLOAD = "pink.ordo.database.context_menu_payload"

export const is_database_context_menu_payload = ({ payload }: Ordo.ContextMenu.Params) =>
	payload === DATABASE_CONTEXT_MENU_PAYLOAD
