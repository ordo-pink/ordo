import type { RRR } from "./error.constants"

export namespace Rrr {
	export type Type = keyof typeof RRR.TYPE

	export type Instance<$Type extends Rrr.Type> = {
		type: (typeof RRR.TYPE)[$Type]
		message: string
		debug?: any[]
	}

	export type Create<$Type extends Rrr.Type> = (message: string, ...debug: any) => Rrr.Instance<$Type>

	export type CreateType = <$Type extends Rrr.Type>(type: $Type) => Rrr.Create<$Type>
}
