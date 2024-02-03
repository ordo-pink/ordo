import { User, EXTENSION_FILE_PREFIX } from "@ordo-pink/frontend-core"
import { PlainData } from "@ordo-pink/data"
import { Either } from "@ordo-pink/either"
import { extend } from "@ordo-pink/tau"

import { TUsedSpaceModel } from "./used-space.types"

export const UsedSpaceModel = {
	empty: () => [0, 0] as TUsedSpaceModel,
	of: (data: PlainData[] | null, user: User.User | null): TUsedSpaceModel =>
		Either.fromNullable(data)
			.chain(data => Either.fromNullable(user).map(user => ({ data, user })))
			.map(extend(({ data }) => ({ data: filterOutInternalFiles(data) })))
			.fold(
				() => UsedSpaceModel.empty(),
				({ data, user }) => [data.length, user.fileLimit] as const,
			),
}

const filterOutInternalFiles = (data: PlainData[]): PlainData[] =>
	data.filter(item => !item.name.startsWith(EXTENSION_FILE_PREFIX))
