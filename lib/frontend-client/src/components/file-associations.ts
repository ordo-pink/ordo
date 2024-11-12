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

import { BehaviorSubject, Subject, map, merge, scan, shareReplay } from "rxjs"

import { O, type TOption } from "@ordo-pink/option"
import { R } from "@ordo-pink/result"
import { RRR } from "@ordo-pink/core"

import { type TInitCtx } from "../frontend-client.types"

type TInitFileAssociationsParams = Pick<TInitCtx, "known_functions" | "commands">
type TInitFileAssociationsFn = (params: TInitFileAssociationsParams) => {
	get_current_file_association: (fid: symbol) => Ordo.CreateFunction.GetCurrentFileAssociationFn
	get_file_associations: (fid: symbol) => Ordo.CreateFunction.GetFileAssociationsFn
}
export const init_file_associations: TInitFileAssociationsFn = ({ known_functions, commands }) => {
	file_associations$.subscribe()

	commands.on("cmd.functions.file_associations.add", assoc => add$.next(assoc))
	commands.on("cmd.functions.file_associations.remove", name => remove$.next(name))

	return {
		get_current_file_association: fid => () =>
			R.If(
				known_functions.has_permissions(fid, { queries: ["functions.current_file_association"] }),
			)
				.pipe(R.ops.err_map(() => eperm(`get_current_file_association -> fid: ${String(fid)}`)))
				.pipe(R.ops.map(() => current_file_association$.asObservable())),

		get_file_associations: fid => () =>
			R.If(known_functions.has_permissions(fid, { queries: ["functions.file_associations"] }))
				.pipe(R.ops.err_map(() => eperm(`get_file_associations -> fid: ${String(fid)}`)))
				.pipe(R.ops.map(() => file_associations$)),
	}
}

const eperm = RRR.codes.eperm("init_file_associations")
const add$ = new Subject<Ordo.FileAssociation.Instance>()
const remove$ = new Subject<string>()

const add =
	(new_file_association: Ordo.FileAssociation.Instance) =>
	(state: Ordo.FileAssociation.Instance[]): Ordo.FileAssociation.Instance[] => [
		...state,
		new_file_association,
	]

const remove =
	(name: string) =>
	(state: Ordo.FileAssociation.Instance[]): Ordo.FileAssociation.Instance[] =>
		state.filter(fa => fa.name === name)

export const current_file_association$ = new BehaviorSubject<
	TOption<Ordo.FileAssociation.Instance>
>(O.None())
export const file_associations$ = merge(add$.pipe(map(add)), remove$.pipe(map(remove))).pipe(
	scan((acc, f) => f(acc), [] as Ordo.FileAssociation.Instance[]),
	shareReplay(1),
)
