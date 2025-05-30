import { type Core, type Transferable, identifiable, timestampable } from "@ordo-pink/sdk-core"

import type { Session } from "./session.impl"
import { device_aware } from "./device-aware.mixin"
import { is_array } from "../validations.impl"

export namespace session_transferable {
	export const mixin: Core.Mixin<Transferable.Interface<Session.DTO, Session.DataInterface>> = {
		instance: ({ created_at, device_info, id }) => ({
			to_dto: () => [id, created_at.getMilliseconds(), device_info],
		}),
		static: {
			from_dto: (...dto) => {
				const plain: Session.Interface["Plain"] = { created_at: new Date(dto[1]), device_info: dto[2], id: dto[0] }

				return {
					...identifiable.instance(plain),
					...timestampable.without_updates.instance(plain),
					...device_aware.mixin.instance(plain),
					...session_transferable.mixin.instance(plain),
				}
			},
		},
		validations: {
			is_dto: (x): x is Session.DTO => {
				if (!is_array(x)) return false

				const dto = x as Session.DTO

				return (
					identifiable.validations.is_id(dto[0]) &&
					timestampable.without_updates.validations.is_timestamp(dto[1]) &&
					device_aware.mixin.validations.is_device_info(dto[2])
				)
			},
		},
	}
}
