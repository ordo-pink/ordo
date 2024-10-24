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
