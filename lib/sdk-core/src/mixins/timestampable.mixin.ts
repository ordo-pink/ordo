import type { Core } from "../sdk-core.types"
import { is_finite_non_negative_int } from "../validations.impl"

export namespace timestampable {
	export const without_updates: Core.Mixin<Timestampable.Interface<"without_updates">> = {
		instance: ({ created_at }) => ({
			get_created_at: () => created_at,
			get_raw_created_at: () => created_at.getMilliseconds(),
			is_created_after: (date, exclude) => (exclude ? created_at > date : created_at >= date),
			is_created_before: (date, exclude) => (exclude ? created_at < date : created_at <= date),
		}),
		static: { create_timestamp: () => Date.now() },
		validations: { is_timestamp: is_finite_non_negative_int },
	}

	export const with_updates: Core.Mixin<Timestampable.Interface<"with_updates">> = {
		...timestampable.without_updates,
		instance: ({ created_at, updated_at }) => ({
			...timestampable.without_updates.instance({ created_at }),
			get_raw_updated_at: () => updated_at.getMilliseconds(),
			get_updated_at: () => updated_at,
			is_updated_after: (date, exclude) => (exclude ? updated_at > date : updated_at >= date),
			is_updated_before: (date, exclude) => (exclude ? updated_at < date : updated_at <= date),
		}),
	}
}

// --- Types ---

export namespace Timestampable {
	export type Timestamp = number & {}

	export type TrackUpdates = "with_updates" | "without_updates"

	export type DTO<$TrackUpdates extends TrackUpdates> = $TrackUpdates extends "with_updates"
		? [created_at: Timestamp, updated_at: Timestamp]
		: [created_at: Timestamp]

	export type Interface<$TrackUpdates extends TrackUpdates> = {
		Instance: $TrackUpdates extends "with_updates" ? InstanceWithUpdates : InstanceWithoutUpdates
		Plain: $TrackUpdates extends "with_updates" ? PlainWithUpdates : PlainWithoutUpdates
		Static: { create_timestamp: () => Timestamp }
		Validations: { is_timestamp: (x: any) => x is Timestamp }
	}

	// --- Internal ---

	type InstanceWithoutUpdates = {
		get_created_at: () => Date
		get_raw_created_at: () => Timestamp
		is_created_after: (date: Date, exclude_exact_match?: boolean) => boolean
		is_created_before: (date: Date, exclude_exact_match?: boolean) => boolean
	}

	type InstanceWithUpdates = InstanceWithoutUpdates & {
		get_raw_updated_at: () => Timestamp
		get_updated_at: () => Date
		is_updated_after: (date: Date, exclude_exact_match?: boolean) => boolean
		is_updated_before: (date: Date, exclude_exact_match?: boolean) => boolean
	}

	type PlainWithoutUpdates = { created_at: Date }
	type PlainWithUpdates = PlainWithoutUpdates & { updated_at: Date }
}
