import type { Core } from "../core/core.types"
import type { CoreMixins } from "./mixins.types"
import { core } from "../core/core.impl"

export namespace core_mixins {
	export const identifiable: Core.Mixin<CoreMixins.Identifiable.Interface> = {
		instance: ({ id }) => ({ get_id: () => id, has_id: x => id === x }),
		static: { create_id: () => crypto.randomUUID() },
		validations: { is_id: core.validations.is_uuid },
	}

	export namespace authored {
		export const without_updates: Core.Mixin<CoreMixins.Authored.Interface<"without_updates">> = {
			instance: ({ created_by }) => ({ get_created_by: () => created_by, is_created_by: id => created_by === id }),
			static: {},
			validations: identifiable.validations,
		}

		export const with_updates: Core.Mixin<CoreMixins.Authored.Interface<"with_updates">> = {
			instance: ({ created_by, updated_by }) => ({
				...authored.without_updates.instance({ created_by }),
				get_updated_by: () => updated_by,
				is_updated_by: id => updated_by === id,
			}),
			static: without_updates.static,
			validations: without_updates.validations,
		}
	}

	export const extendable: Core.Mixin<CoreMixins.Extendable.Interface> = {
		instance: plain => ({
			get_extension: key => (plain as any)[key] ?? null,
			has_extension: key => !!(plain as any)[key],
		}),
		static: {
			get_default_extensions: () => ({}),
		},
		validations: {
			is_extensions: (x): x is CoreMixins.Extendable.Extensions => core.validations.is_object(x),
		},
	}

	export const named: Core.Mixin<CoreMixins.Named.Interface> = {
		instance: ({ name }) => ({ get_name: () => name }),
		static: { get_default_name: () => "" },
		validations: { is_name: core.validations.is_string },
	}

	export namespace timestampable {
		export const without_updates: Core.Mixin<CoreMixins.Timestampable.Interface<"without_updates">> = {
			instance: plain => ({
				get_created_at: () => new Date(plain.created_at),
				get_raw_created_at: () => plain.created_at,
				is_created_after: (date, exclude) =>
					exclude ? plain.created_at > date.getMilliseconds() : plain.created_at >= date.getMilliseconds(),
				is_created_before: (date, exclude) =>
					exclude ? plain.created_at < date.getMilliseconds() : plain.created_at <= date.getMilliseconds(),
			}),
			static: { create_timestamp: () => Date.now() },
			validations: { is_timestamp: core.validations.is_finite_non_negative_int },
		}

		export const with_updates: Core.Mixin<CoreMixins.Timestampable.Interface<"with_updates">> = {
			...timestampable.without_updates,
			instance: plain => ({
				...timestampable.without_updates.instance(plain),
				get_raw_updated_at: () => plain.updated_at,
				get_updated_at: () => new Date(plain.updated_at),
				is_updated_after: (date, exclude) =>
					exclude ? plain.updated_at > date.getMilliseconds() : plain.updated_at >= date.getMilliseconds(),
				is_updated_before: (date, exclude) =>
					exclude ? plain.updated_at < date.getMilliseconds() : plain.updated_at <= date.getMilliseconds(),
			}),
		}
	}
}
