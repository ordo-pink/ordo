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

import { type TGetTitleFn, type TTitleState } from "@ordo-pink/core"
import { call_once, is_non_empty_string, is_undefined } from "@ordo-pink/tau"
import { KnownFunctions } from "@ordo-pink/frontend-known-functions"
import { RRR } from "@ordo-pink/data"
import { Result } from "@ordo-pink/result"
import { type TLogger } from "@ordo-pink/logger"

type TInitTitleStreamFn = (
	logger: TLogger,
	commands: Client.Commands.Commands,
) => { get_title: TGetTitleFn }
export const init_title: TInitTitleStreamFn = call_once((logger, commands) => {
	logger.debug("Initialising title stream...")

	commands.on<cmd.application.set_title>(
		"application.set_title",
		state =>
			is_non_empty_string(state.window_title) &&
			(is_undefined(state.status_bar_title) || is_non_empty_string(state.status_bar_title)) &&
			title$.next(state),
	)

	logger.debug("Initialised title.")

	return {
		get_title: fid => () =>
			Result.If(KnownFunctions.check_permissions(fid, { queries: ["application.title"] }))
				.pipe(Result.ops.err_map(() => eperm(`get_title -> fid: ${String(fid)}`)))
				.pipe(Result.ops.map(() => title$.asObservable())),
	}
})

// --- Internal ---

const title$ = new BehaviorSubject<TTitleState>({
	window_title: "Loading...",
})

const eperm = RRR.codes.eperm("Init title")
