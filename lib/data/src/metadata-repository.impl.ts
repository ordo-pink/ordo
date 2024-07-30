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

import { map } from "rxjs"

import { Oath } from "@ordo-pink/oath"
import { Result } from "@ordo-pink/result"

import {
	type TMetadataRepositoryStatic,
	type TRemoteMetadataRepositoryStatic,
} from "./metadata-repository.types"
import { RRR } from "./metadata.errors"

const LOCATION = "MetadataRepository"

const eagain = RRR.codes.eagain(LOCATION)
const einval = RRR.codes.einval(LOCATION)
const eio = RRR.codes.eio(LOCATION)

export const MetadataRepository: TMetadataRepositoryStatic = {
	of: metadata$ => ({
		get: () =>
			Result.Try(() => metadata$.getValue())
				.pipe(Result.ops.chain(Result.FromNullable))
				.pipe(Result.ops.err_map(() => eagain())),

		put: metadata =>
			Result.FromNullable(metadata)
				.pipe(Result.ops.chain(() => Result.If(Array.isArray(metadata)))) // TODO: Add validations
				.pipe(Result.ops.chain(() => Result.Try(() => metadata$.next(metadata))))
				.pipe(Result.ops.err_map(() => einval(`.put: ${JSON.stringify(metadata)}`))),
		get sub() {
			let i = 0
			return metadata$.pipe(map(() => i++))
		},
	}),
}

export const MR = MetadataRepository

export const RemoteMetadataRepository: TRemoteMetadataRepositoryStatic = {
	of: (data_host, fetch) => ({
		get: token =>
			Oath.Try(() => fetch(`${data_host}`, { headers: { Authorization: `Bearer ${token}` } }))
				.pipe(Oath.ops.chain(response => Oath.FromPromise(() => response.json())))
				.pipe(Oath.ops.chain(r => Oath.If(r.success, { T: () => r.result, F: () => r.error })))
				.pipe(Oath.ops.rejected_map(error => eio(error))),
		put: () => Oath.Reject(eio("TODO: UNIMPLEMENTED")),
	}),
}
