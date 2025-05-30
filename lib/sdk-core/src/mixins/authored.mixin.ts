import { type Identifiable, identifiable } from "./identifiable.mixin"
import type { Core } from "../sdk-core.types"

export namespace authored {
	/** Implements {@link Authored.Interface}. */
	export const without_updates_mixin: Core.Mixin<Authored.Interface<"without_updates">> = {
		instance: ({ created_by }) => ({
			get_created_by: () => created_by,
			is_created_by: id => created_by === id,
		}),
		static: {},
		validations: identifiable.validations,
	}

	export const with_updates_mixin: Core.Mixin<Authored.Interface<"with_updates">> = {
		...authored.without_updates_mixin,
		instance: ({ created_by, updated_by }) => ({
			...authored.without_updates_mixin.instance({ created_by }),
			get_updated_by: () => updated_by,
			is_updated_by: id => updated_by === id,
		}),
	}
}

// --- Types ---

export namespace Authored {
	/** Author {@link Identifiable.ID id} used in `created_by` and `updated_by` fields. */
	export type AuthorID = Identifiable.ID

	export type DTO<$TrackUpdates extends TrackUpdates> = $TrackUpdates extends "with_updates"
		? [created_by: AuthorID, updated_by: AuthorID]
		: [created_by: AuthorID]

	/**
	 * Adds support for **created_by** (and, optionally, **updated_by**) field, represented by {@link AuthorID}.
	 *
	 * To only get type definition for **created_by**, use `Authored.Interface<"without_updates">`.
	 * To get both **created_by** and **updated_by**, use `Authored.Interface<"with_updates">`.
	 */
	export type Interface<$TrackUpdates extends TrackUpdates> = {
		Instance: $TrackUpdates extends "with_updates" ? InstanceWithUpdates : InstanceWithoutUpdates
		Plain: $TrackUpdates extends "with_updates" ? PlainWithUpdates : PlainWithoutUpdates
		Static: {}
		Validations: Identifiable.Interface["Validations"]
	}

	// --- Internal ---

	type TrackUpdates = "with_updates" | "without_updates"

	type PlainWithoutUpdates = { created_by: AuthorID }
	type PlainWithUpdates = PlainWithoutUpdates & { updated_by: AuthorID }

	type InstanceWithoutUpdates = {
		/** Get the {@link AuthorID} the entity was created by. */
		get_created_by: () => AuthorID

		/** Check if entity was created by given {@link AuthorID}. */
		is_created_by: (id: AuthorID) => boolean
	}
	type InstanceWithUpdates = InstanceWithoutUpdates & {
		/** Get the {@link AuthorID} the entity was last modified by. */
		get_updated_by: () => AuthorID

		/** Check if entity was last modified by given {@link AuthorID}. */
		is_updated_by: (id: AuthorID) => boolean
	}
}
