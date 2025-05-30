import type { GetDeviceInfo } from "@ordo-pink/get-device-info"

import { type Identifiable, identifiable } from "../../mixins/identifiable.mixin"
import { type Timestampable, timestampable } from "../../mixins/timestampable.mixin"
import { is_array, is_string } from "../../validations.impl"
import type { Core } from "../../sdk-core.types"
import type { Session } from "../../session/session.impl"

export namespace authenticated {
	export const DEFAULT_SESSIONS = [] as Session.DTO[]

	export const mixin: Core.Mixin<Authenticated.Interface> = {
		instance: ({ sessions }) => ({
			get_sessions: () => sessions,
			get_sessions_raw: () => sessions.map(session => session.to_dto()),
		}),
		static: {
			...identifiable.static,
			...timestampable.without_updates.static,
			create_session: data_info => [mixin.static.create_id(), mixin.static.create_timestamp(), data_info],
			get_default_sessions: () => DEFAULT_SESSIONS,
		},
		validations: {
			...identifiable.validations,
			...timestampable.without_updates.validations,
			is_session: (x): x is Session.DTO =>
				// TODO More precise check for device info
				is_array(x) &&
				identifiable.validations.is_id(x[0]) &&
				timestampable.without_updates.validations.is_timestamp(x[1]) &&
				is_string(x[2]),
		},
	}
}

export namespace Authenticated {
	export type DTO = [sessions: Session.DTO[]]

	export type Interface = {
		Instance: {
			get_sessions: () => Session.Interface["Instance"][]
			get_sessions_raw: () => Session.DTO[]
		}
		Plain: { sessions: Session.Interface["Instance"][] }
		Static: Identifiable.Interface["Static"] &
			Timestampable.Interface<"without_updates">["Static"] & {
				create_session: (device_info: GetDeviceInfo.DeviceInfo) => Session.DTO
				get_default_sessions: () => Session.DTO[]
			}
		Validations: Identifiable.Interface["Validations"] &
			Timestampable.Interface<"without_updates">["Validations"] & {
				is_session: (x: any) => x is Session.DTO
			}
	}
}
