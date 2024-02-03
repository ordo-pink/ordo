// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { map, scan, shareReplay } from "rxjs/operators"
import { merge, Subject, Observable } from "rxjs"
import { Binary, Curry, Nullable, callOnce } from "@ordo-pink/tau"
import { Logger } from "@ordo-pink/logger"
import { Extensions } from "@ordo-pink/frontend-core"
import { getCommands } from "./commands"

const commands = getCommands()

type Params = { logger: Logger }
type InitFileAssociationsFn = (params: Params) => __FileAssociations$
export type __FileAssociations$ = Observable<Extensions.FileAssociation[]>
export type __CurrentFileAssociation$ = Observable<Extensions.FileAssociation | null>
export const __initFileAssociations: InitFileAssociationsFn = callOnce(({ logger }) => {
	logger.debug("Initializing FileAssociations")

	commands.on<cmd.fileAssociations.add>("file-associations.add", ({ payload }) =>
		add$.next(payload),
	)
	commands.on<cmd.fileAssociations.remove>("file-associations.remove", ({ payload }) =>
		remove$.next(payload),
	)

	return fileAssociations$
})

const add$ = new Subject<Extensions.FileAssociation>()
const remove$ = new Subject<string>()

type AddP = Curry<
	Binary<Extensions.FileAssociation, Extensions.FileAssociation[], Extensions.FileAssociation[]>
>
const addP: AddP = newFileAssociation => state => [...state, newFileAssociation]

type RemoveP = Curry<Binary<string, Extensions.FileAssociation[], Extensions.FileAssociation[]>>
const removeP: RemoveP = FileAssociation => state => state.filter(a => a.name === FileAssociation)

const fileAssociations$ = merge(add$.pipe(map(addP)), remove$.pipe(map(removeP))).pipe(
	scan((acc, f) => f(acc), [] as Extensions.FileAssociation[]),
	shareReplay(1),
)

fileAssociations$.subscribe()
