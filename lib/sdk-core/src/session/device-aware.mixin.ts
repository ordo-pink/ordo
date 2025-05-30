import type { GetDeviceInfo } from "@ordo-pink/get-device-info"

import type { Core } from "../sdk-core.types"
import { is_string } from "../validations.impl"

export namespace device_aware {
	export const mixin: Core.Mixin<DeviceAware.Interface> = {
		instance: ({ device_info }) => ({ get_device_info: () => device_info }),
		static: {},
		// TODO Improve validation
		validations: { is_device_info: (x): x is GetDeviceInfo.DeviceInfo => is_string(x) },
	}
}

// --- Types ---

export namespace DeviceAware {
	export type DTO = [device_info: GetDeviceInfo.DeviceInfo]

	export type Interface = {
		Instance: {
			get_device_info: () => GetDeviceInfo.DeviceInfo
		}
		Plain: { device_info: GetDeviceInfo.DeviceInfo }
		Static: {}
		Validations: {
			is_device_info: (x: any) => x is GetDeviceInfo.DeviceInfo
		}
	}
}
