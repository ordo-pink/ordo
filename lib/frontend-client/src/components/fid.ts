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

import { BehaviorSubject } from "rxjs"

import { O, type TOption } from "@ordo-pink/option"
import { RRR, type TRrr } from "@ordo-pink/data"
import { type TGetCurrentFIDFn, type TSetCurrentFIDFn } from "@ordo-pink/core"
import { KnownFunctions } from "@ordo-pink/frontend-known-functions"
import { Result } from "@ordo-pink/result"
import { type TLogger } from "@ordo-pink/logger"
import { call_once } from "@ordo-pink/tau"

type TInitFIDFn = (logger: TLogger) => {
	set_current_fid: TSetCurrentFIDFn
	get_current_fid: TGetCurrentFIDFn
}
export const init_fid: TInitFIDFn = call_once(logger => {
	logger.debug("🟡 Initialising FID...")

	current_fid$.subscribe()

	logger.debug("🟢 Initialised FID.")

	return {
		get_current_fid: fid => () =>
			Result.If(KnownFunctions.check_is_internal(fid))
				.pipe(Result.ops.err_map(_log_error(fid, "get_current_fid")))
				.pipe(Result.ops.map(() => current_fid$.asObservable())),

		set_current_fid: fid => new_fid =>
			Result.If(KnownFunctions.check_is_internal(fid))
				.pipe(Result.ops.err_map(_log_error(fid, "set_current_fid")))
				.pipe(Result.ops.map(() => current_fid$.next(O.Some(new_fid)))),
	}
})

// --- Internal ---

const eperm = RRR.codes.eperm("init_fid")

const current_fid$ = new BehaviorSubject<TOption<symbol>>(O.None())

type TLogErrorFn = (fid: symbol | null, fn: string) => () => TRrr<"EPERM">
const _log_error: TLogErrorFn = (fid, fn) => () => eperm(`${fn} -> fid: ${String(fid)}`)
