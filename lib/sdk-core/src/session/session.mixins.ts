/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { GetDeviceInfo } from "@ordo-pink/get-device-info"

import type { Core } from "../core/core.types"
import type { CoreMixins } from "../mixins/mixins.types"
import type { Session } from "./session.types"
import { core } from "../core/core.impl"
import { core_mixins } from "../mixins/mixins.impl"

export namespace session_mixins {
	export const device_aware: Core.Mixin<Session.CustomMixins.DeviceAware.Interface> = {
		instance: ({ device_info }) => ({ get_device_info: () => device_info }),
		static: {},
		// TODO Improve validation
		validations: { is_device_info: (x): x is GetDeviceInfo.DeviceInfo => core.validations.is_string(x) },
	}

	export const serializable: Core.Mixin<CoreMixins.Serializable.Interface<Session.DTO, Session.DataInterface>> = {
		instance: plain => ({ to_dto: () => [plain.id, plain.created_at, plain.device_info] }),
		static: {
			from_dto: (...dto) => {
				const plain: Session.Interface["Plain"] = { created_at: dto[1], device_info: dto[2], id: dto[0] }

				return {
					...core_mixins.identifiable.instance(plain),
					...core_mixins.timestampable.without_updates.instance(plain),
					...device_aware.instance(plain),
					...serializable.instance(plain),
				}
			},
		},
		validations: {
			is_dto: (x): x is Session.DTO => {
				if (!core.validations.is_array(x)) return false

				const dto = x as Session.DTO

				return (
					core_mixins.identifiable.validations.is_id(dto[0]) &&
					core_mixins.timestampable.without_updates.validations.is_timestamp(dto[1]) &&
					device_aware.validations.is_device_info(dto[2])
				)
			},
		},
	}
}
