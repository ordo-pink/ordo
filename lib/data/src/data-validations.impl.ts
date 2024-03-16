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

import { isNonEmptyString, isNonNegativeFiniteInteger, isObject, isUUID } from "@ordo-pink/tau"
import { Either } from "@ordo-pink/either"

import { DataError } from "./errors.types"
import { Errors } from "./errors.impl"
import { type Validations } from "./data-validations.types"

export const validations: Validations = {
	isValidDataE: x =>
		Either.fromBoolean(() => isObject(x))
			.chain(() => validations.isValidFsidE(x.fsid))
			.chain(() => validations.isValidParentE(x.parent))
			.chain(() => validations.isValidNameE(x.name))
			.chain(() => validations.isValidSizeE(x.size))
			.chain(() => validations.isValidTimestampE(x.createdAt))
			.chain(() => validations.isValidTimestampE(x.updatedAt))
			.chain(() => validations.isValidSubE(x.createdBy))
			.chain(() => validations.isValidSubE(x.updatedBy))
			.chain(() => validations.isValidPropertiesE(x.properties))
			.chain(() =>
				x.links.reduce((acc, v) => acc.chain(() => validations.isValidFsidE(v)), Either.right("")),
			)
			.chain(() =>
				x.labels.reduce(
					(acc, v) => acc.chain(() => validations.isValidStringE(v)),
					Either.right(""),
				),
			)
			.map(() => x)
			.leftMap(e => e as DataError),
	isValidNameE: x =>
		Either.fromBoolean(
			() => isNonEmptyString(x),
			() => x,
			() => Errors.InvalidName,
		),
	isValidSizeE: x =>
		Either.fromBoolean(
			() => isNonNegativeFiniteInteger(x),
			() => x,
			() => Errors.InvalidSize,
		),
	isValidTimestampE: x =>
		Either.fromBoolean(
			() => isNonNegativeFiniteInteger(x),
			() => x,
			() => Errors.InvalidTimestamp,
		),
	isValidFsidE: x =>
		Either.fromBoolean(
			() => isUUID(x),
			() => x,
			() => Errors.InvalidFSID,
		),
	isValidParentE: x =>
		Either.fromBoolean(
			() => x === null || isUUID(x),
			() => x,
			() => Errors.InvalidFSID,
		),
	isValidSubE: x =>
		Either.fromBoolean(
			() => isUUID(x),
			() => x,
			() => Errors.InvalidSUB,
		),
	isValidStringE: x =>
		Either.fromBoolean(
			() => isNonEmptyString(x),
			() => x,
			() => Errors.InvalidLabel,
		),
	isValidPropertiesE: x =>
		Either.fromBoolean(
			() => typeof x === "undefined" || isObject(x),
			() => x,
			() => Errors.InvalidProperties,
		),
}
