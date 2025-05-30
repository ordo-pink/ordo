import type { Core } from "../sdk-core.types"

export namespace Transferable {
	export type Interface<$DTO extends any[], $Interface extends Core.BaseInterface> = {
		Instance: { to_dto: () => $DTO }
		Plain: $Interface["Plain"]
		Static: { from_dto: (...dto: $DTO) => Core.Prettify<$Interface["Instance"] & { to_dto: () => $DTO }> }
		Validations: { is_dto: (x: any) => x is $DTO }
	}
}
