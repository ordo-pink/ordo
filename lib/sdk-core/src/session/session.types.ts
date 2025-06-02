import type { GetDeviceInfo } from "@ordo-pink/get-device-info"

import type { CoreMixins } from "../mixins/mixins.types"

export namespace Session {
	export type DTO = [
		...CoreMixins.Identifiable.DTO,
		...CoreMixins.Timestampable.DTO<"without_updates">,
		...Session.CustomMixins.DeviceAware.DTO,
	]

	export type DataInterface = CoreMixins.Identifiable.Interface &
		CoreMixins.Timestampable.Interface<"without_updates"> &
		Session.CustomMixins.DeviceAware.Interface

	export type Interface = Session.DataInterface & CoreMixins.Serializable.Interface<Session.DTO, Session.DataInterface>

	export type Static = Session.Interface["Static"]

	export type Instance = Session.Interface["Instance"]

	export namespace CustomMixins {
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
	}
}
