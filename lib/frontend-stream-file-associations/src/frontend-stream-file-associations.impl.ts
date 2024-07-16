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

import { BehaviorSubject } from "rxjs/internal/BehaviorSubject"
import { Subject } from "rxjs/internal/Subject"
import { map } from "rxjs/internal/operators/map"
import { merge } from "rxjs/internal/observable/merge"
import { scan } from "rxjs/internal/operators/scan"
import { shareReplay } from "rxjs/internal/operators/shareReplay"

import { N, call_once } from "@ordo-pink/tau"
import { chainE, fromBooleanE, fromNullableE } from "@ordo-pink/either"
import { KnownFunctions } from "@ordo-pink/frontend-known-functions"
import { _get_commands } from "@ordo-pink/frontend-stream-commands"
import { get_logger } from "@ordo-pink/frontend-logger"

export const __init_file_associations$ = call_once((fid: symbol) => {
	const logger = get_logger(fid)
	const commands = _get_commands(fid)

	logger.debug("Initializing file associations...")

	commands.on<cmd.editor.registerFileAssociation>("editor.register-file-association", assoc =>
		add$.next(assoc),
	)
	commands.on<cmd.editor.unregisterFileAssociation>("editor.unregister-file-association", name =>
		remove$.next(name),
	)

	fileAssociations$.subscribe()

	logger.debug("Initialized file associations.")
})

const add$ = new Subject<Functions.FileAssociation>()
const remove$ = new Subject<string>()

const add =
	(newFileAssociation: Functions.FileAssociation) =>
	(state: Functions.FileAssociation[]): Functions.FileAssociation[] => [
		...state,
		newFileAssociation,
	]

const remove =
	(activityName: string) =>
	(state: Functions.FileAssociation[]): Functions.FileAssociation[] =>
		state.filter(activity => activity.name === activityName)

export const currentFileAssociation$ = new BehaviorSubject<Functions.FileAssociation | null>(null)
export const fileAssociations$ = merge(add$.pipe(map(add)), remove$.pipe(map(remove))).pipe(
	scan((acc, f) => f(acc), [] as Functions.FileAssociation[]),
	shareReplay(1),
)

export const getCurrentFileAssociation = (fid: symbol | null): Functions.FileAssociation | null =>
	fromNullableE(fid)
		.pipe(chainE(checkCurrentFileAssociationQueryPermissionE))
		.fold(N, () => currentFileAssociation$.value)

const checkCurrentFileAssociationQueryPermissionE = (fid: symbol) =>
	fromBooleanE(
		KnownFunctions.check_permissions(fid, { queries: ["functions.current-file-association"] }),
		fid,
	)
