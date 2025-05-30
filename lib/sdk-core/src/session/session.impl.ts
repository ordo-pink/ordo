import { type DeviceAware, device_aware } from "./device-aware.mixin"
import { type Identifiable, identifiable } from "../mixins/identifiable.mixin"
import { type Timestampable, timestampable } from "../mixins/timestampable.mixin"
import type { Core } from "../sdk-core.types"
import { Transferable } from "../mixins/transferable.mixin"
import { mix } from "../sdk-core.impl"
import { session_transferable } from "./transferable.mixin"

// --- Impl ---

export const session: Core.Impl<Session.Interface> = mix(
	identifiable,
	timestampable.without_updates,
	device_aware.mixin,
	session_transferable.mixin,
)

// --- Types ---

export namespace Session {
	export type DTO = [...Identifiable.DTO, ...Timestampable.DTO<"without_updates">, ...DeviceAware.DTO]

	export type DataInterface = Identifiable.Interface & Timestampable.Interface<"without_updates"> & DeviceAware.Interface

	export type Interface = DataInterface & Transferable.Interface<DTO, DataInterface>

	export type Static = Interface["Static"]
}
