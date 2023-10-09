// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

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
	DataAlreadyExists: "Data already exists",
	DataNotFound: "Data not found",
	UnexpectedError: `Unexpected error: ` as `Unexpected error: ${string}`,
} as const

export const UnexpectedError = (error: Error) =>
	Errors.UnexpectedError.concat(error?.message) as (typeof Errors)["UnexpectedError"]
