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

export const Errors = {
	InvalidName: "Name must be a non-empty string",
	InvalidSize: "Size must be a non-negative finite integer",
	InvalidTimestamp: "Timestamp must be a non-negative finite integer",
	TooMuchData: "Subscription file limit exceeded",
	InvalidParent: "Parent must be null for root elements or a valid UUIDv4 for nested elements",
	SelfReferencingParent: "Parent must not be equal to FSID",
	SelfReferencingLink: "Link must not be equal to FSID",
	SelfReferencingChild: "Child must not be equal to FSID",
	InvalidData: "Data must be PlainData",
	InvalidFSID: "FSID must be a valid UUIDv4",
	InvalidSUB: "SUB must be a valid UUIDv4",
	InvalidLabel: "Label must be a non-empty string",
	InvalidProperties: "Properties must be an object or undefined",
	DataAlreadyExists: "Data already exists",
	DataNotFound: "Data not found",
	UnexpectedError: `Unexpected error: ` as `Unexpected error: ${string}`,
} as const

export const UnexpectedError = (error: Error) =>
	Errors.UnexpectedError.concat(error?.message) as (typeof Errors)["UnexpectedError"]
